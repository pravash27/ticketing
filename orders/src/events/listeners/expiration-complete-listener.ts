import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@prticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publish";
import { queueGroupName } from "./queue-group";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order){
            throw new Error('Order Not Found')
        }
        if(order.status === OrderStatus.Complete){
            throw new Error("Order with payment done cannot be cancelled.")
        }
        order.set({
            status: OrderStatus.Cancelled
        })
        await order.save();
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket:{
                id: order.ticket.id,
                version: order.ticket.version
            }
        })
    }
}