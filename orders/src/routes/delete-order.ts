import express, { Request, Response } from 'express'
import { checkAuth, NotAuthorizedError, NotFoundError, OrderStatus, requestValidation } from '@prticket/common'
import { currentUser } from '@prticket/common'
import { Order } from '../models/orders'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publish'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete('/api/orders/:orderId',
    checkAuth,
    currentUser,
    async (req: Request,res: Response) => {
        const {orderId} = req.params;
        const order = await Order.findById(orderId).populate('ticket')
        if(!order){
            throw new NotFoundError()
        }
        if(order.userId !== req.currentUser?.id){
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled
        await order.save();
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                version: order.ticket.version
            }
        })
        res.status(204).send({})
})

export { router as  deleteOrderRouter}