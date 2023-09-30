import { Listener, Subjects, TicketUpdatedEvent } from "@prticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const { id, title, price, orderId} = data;
        console.log("Event Function")
        const ticket = await Ticket.findByEvent(data)
        if(!ticket){
            throw new Error("Ticket not found")
        }
        ticket.set({title,price,orderId})
        await ticket.save()
        msg.ack()
    }
}