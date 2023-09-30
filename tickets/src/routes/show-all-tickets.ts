import express from 'express'
import { checkAuth, NotFoundError } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets',checkAuth,async (req,res) => {
    const id = req.params.id
    const ticket = await Ticket.find({});
    if(!ticket){
        throw new NotFoundError()
    }
    res.status(200).send(ticket);
})

export { router as showAllTickets }