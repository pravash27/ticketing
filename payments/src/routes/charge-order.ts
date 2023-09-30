import { BadRequestError, checkAuth, currentUser, NotAuthorizedError, NotFoundError, OrderStatus, requestValidation } from '@prticket/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';



const router = express.Router();
router.post(
    '/api/payments',
    checkAuth,
    currentUser,
    [
        body('tokenId')
            .notEmpty()
            .withMessage("Provide valid stripe token"),
        body('orderId')
            .notEmpty()
            .withMessage("Provide valid order id")
    ],
    requestValidation,
    async (req: Request, res: Response) => {
        const {tokenId, orderId} = req.body;
        const order = await Order.findById(orderId)
        if(!order){
            throw new NotFoundError()
        }
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError()
        }
        if(order.status === OrderStatus.Cancelled){
            console.log("Cancelled")
            throw new BadRequestError("Payment cannot be processed on cancelled order")
        }

        let stripePayment = await stripe.paymentIntents.create({
            currency: 'usd',
            amount: order.price * 100,
        })
        let payment = Payment.build({
            orderId: orderId,
            stripeId: stripePayment.id,
        })
        await payment.save();
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            orderId: orderId,
            stripeId: payment.stripeId,
            id: payment.id
        })
        res.status(201).send({success: true})
    }
)

export { router as chargeOrderRouter }
