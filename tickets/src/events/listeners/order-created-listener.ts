import { Listener, OrderCreatedEvent, Subjects, TicketUpdatedEvent } from "@prticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publish";
import { queueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new Error("Ticket not found")
        }
        ticket.set({orderId: data.id})
        await ticket.save()
        try{
            await new TicketUpdatedPublisher(natsWrapper.client).publish({
                    id: ticket.id,
                    price: ticket.price,
                    title: ticket.title,
                    version: ticket.version,
                    userId: ticket.userId,
                    orderId: ticket.orderId
                })
        }catch(e: any){
            throw new Error(e.message)
        }
        
        msg.ack()
    }
}