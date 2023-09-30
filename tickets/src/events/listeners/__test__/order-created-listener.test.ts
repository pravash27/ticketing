import { OrderCreatedEvent, OrderStatus } from "@prticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'Concert',
        price: 100,
        userId: 'dsfdsf'
    })
    await ticket.save()

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'sdfsdf',
        expiresAt: 'sdfdsf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
            version: 0
        }
    } 

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg}
}


it('sets orderId of the ticket', async () => {
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