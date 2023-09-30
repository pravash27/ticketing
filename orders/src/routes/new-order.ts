import express, { Request, Response } from 'express'
import { BadRequestError, checkAuth, NotFoundError, OrderStatus, requestValidation } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { body } from 'express-validator'
import { natsWrapper } from '../nats-wrapper'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/orders'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publish'
const EXPIRATION_WINDOW_DURATION = 1 * 60
const router = express.Router()

router.post('/api/orders',
    checkAuth,
    currentUser,
    [
        body('ticketid')
            .not()
            .isEmpty()
            .custom((ticketid: string) => mongoose.Types.ObjectId.isValid(ticketid))
            .withMessage("Valid ticket id is required"),
    ],
    requestValidation,
    async (req: Request,res: Response) => {
        const {ticketid} = req.body;
        const ticket = await Ticket.findById(ticketid)
        if(!ticket){
            throw new NotFoundError()
        }
        const isReserved = await ticket.isReserved()
        if(isReserved){
            throw new BadRequestError("Ticket is already reserved")
        }
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_DURATION)
        const order = Order.build({
            userId: req.currentUser? req.currentUser.id: '',
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })

        await order.save()
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price,
                version: order.ticket.version
            }
        })
        res.status(201).send(order)
})

export { router as  createOrderRouter}