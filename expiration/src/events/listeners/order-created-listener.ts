import { Listener, OrderCreatedEvent, Subjects } from "@prticket/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queus/expiration-queue";
import { queueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        await expirationQueue.add({
            orderId: data.id
        },{
            delay: delay
        })
        msg.ack()
    }
}