import { Listener, OrderCreatedEvent, Subjects, TicketUpdatedEvent } from "@prticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const order = Order.build({
            userId: data.userId,
            status: data.status,
            price: data.ticket.price,
            id: data.id,
            version: data.version
        })
        await order.save()
        msg.ack()
    }
}