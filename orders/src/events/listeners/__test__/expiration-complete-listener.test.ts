import { ExpirationCompleteEvent, OrderStatus } from "@prticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import request from 'supertest'
const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 100
    })
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        expiresAt: new Date(),
        userId: 'sdfsdfsd',
        ticket
    })
    await order.save()
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, order, ticket, msg}
}

it("updates order status to cancelled", async () => {
    const { listener, data, order, ticket, msg} = await setup()
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
})

it("emits order cancelled event", async () => {
    const { listener, data, order, ticket, msg} = await setup()
    await listener.onMessage(data, msg);
    console.log(((natsWrapper.client.publish) as jest.Mock).mock.calls[1])
    const eventData = JSON.parse(((natsWrapper.client.publish) as jest.Mock).mock.calls[1][1])
    expect(eventData.id).toEqual(order.id)
})