import { OrderCancelledEvent, OrderStatus } from '@prticket/common'
import { natsWrapper }  from '../../../nats-wrapper'
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { OrderCancelledListener } from "../order-cancelled-listener"
const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 90,
        userId: 'sdf',
        version: 0
    })
    await order.save()
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
        }
    }

    // @ts-ignore
    const msg:  Message = {
        ack: jest.fn()
    }
    return { listener, data, msg, order}
}

it("cancel the order", async() => {
    const { listener, data, msg, order}  = await  setup();
    
    listener.onMessage(data,msg)

    const updatedorder = await Order.findById(order.id);
    expect(updatedorder!.status).toEqual(OrderStatus.Cancelled)
})

