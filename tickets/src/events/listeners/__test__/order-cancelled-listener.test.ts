import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@prticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'Concert',
        price: 100,
        userId: 'dsfdsf'
    })
    ticket.set({orderId})
    await ticket.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
            version: 0
        }
    } 

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg}
}


it('sets orderId to undefined of the ticket', async () => {
    const { listener, data, ticket, msg} = await setup()
    
    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it("acks the message", async() => {
    const { listener, data, ticket, msg} = await setup()
    
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})