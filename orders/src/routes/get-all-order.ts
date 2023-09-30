import express, { Request, Response } from 'express'
import { checkAuth, requestValidation } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { Order } from '../models/orders'

const router = express.Router()

router.get('/api/orders',
    checkAuth,
    currentUser,
    async (req: Request,res: Response) => {
        const orders = await Order.find({
            userId: req.currentUser?.id
        }).populate('ticket')
        res.status(200).send(orders)
})

export { router as  allOrderRouter}