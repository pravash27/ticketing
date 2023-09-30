import express, { Request, Response } from 'express'
import { checkAuth, NotAuthorizedError, NotFoundError, requestValidation } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { Order } from '../models/orders'

const router = express.Router()

router.get('/api/orders/:orderId',
    checkAuth,
    currentUser,
    async (req: Request,res: Response) => {
        const {orderId} = req.params;
        const order = await Order.findById(orderId)
        if(!order){
            throw new NotFoundError()
        }
        if(order.userId !== req.currentUser?.id){
            throw new NotAuthorizedError();
        } 
        res.status(200).send(order)
})

export { router as  getOrderRouter}