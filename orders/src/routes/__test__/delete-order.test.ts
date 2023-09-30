import { Ticket } from "../../models/ticket"
import { signin } from "../../test/setup"
import request from 'supertest'
import { app } from "../../app"
import { OrderStatus } from "@prticket/common"
import { Order } from "../../models/orders"
import mongoose from "mongoose"
it("set order status to cancelled", async () => {
    const user = signin()
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Screening',
        price: 100
    })
    await ticket.save()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('cookie',user)
        .send({ticketid: ticket.id})
        .expect(201)

    await  request(app)
                .delete('/api/orders/'+order.id)
                .set('cookie',user)
                .send()
                .expect(204)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})