import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@prticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroupName } from "./queue-group";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId)

        if(!order){
            throw new NotFoundError()
        }

        order.set({status: OrderStatus.Complete})
        await order.save()
        msg.ack()
    }
}