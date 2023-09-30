import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from '@prticket/common'
import { natsWrapper }  from '../../../nats-wrapper'
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: 'sdfsd',
        version: 0,
        status: OrderStatus.Created,
        expiresAt: 'fsdf',
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            price: 90
        }
    }

    // @ts-ignore
    const msg:  Message = {
        ack: jest.fn()
    }
    return { listener, data, msg}
}

it("replicates the order", async() => {
    const { listener, data, msg}  = await  setup();
    
    listener.onMessage(data,msg)

    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price)
})

