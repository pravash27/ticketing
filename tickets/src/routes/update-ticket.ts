import express, { Request, Response } from 'express'
import { BadRequestError, checkAuth, NotAuthorizedError, NotFoundError, requestValidation } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publish'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put('/api/tickets/:id',
    checkAuth,
    currentUser,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage("Valid Title is required"),
        body('price')
            .isFloat({gt: 0})
            .withMessage("Price must be grater than 0")
    ],
    requestValidation,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const {title,price} = req.body;
        const ticket = await Ticket.findById(id);
        if(!ticket){
            throw new NotFoundError()
        }
        if(ticket.userId!==req.currentUser!.id){
            return new NotAuthorizedError()
        }
        if(ticket.orderId){
            throw new BadRequestError("Reserved ticket cannot be updated")
        }
        ticket.set({
            title,
            price
        })
        await ticket.save()
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })
        res.status(200).send(ticket);
})

export { router as updateTicket }