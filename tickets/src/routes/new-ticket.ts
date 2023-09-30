import express, { Request, Response } from 'express'
import { checkAuth, requestValidation } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publish'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/tickets',
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
    async (req: Request,res: Response) => {
        const {title,price} = req.body
        const ticket = await Ticket.build({title,price,userId: req.currentUser!.id})
        await ticket.save()
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })
        res.status(201).send(ticket)
})

export { router as  createTickerRouter}