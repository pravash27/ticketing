import { OrderStatus } from '@prticket/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/orders'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'
import { signin } from '../../test/setup'
it("returns 404 if ticket does not exist", async () => {
    const ticketid = new mongoose.Types.ObjectId().toHexString();
    return request(app)
        .post('/api/orders')
        .set('cookie',signin())
        .send({ticketid})
        .expect(404)
})

it("returns 400 if ticket isn reserved", async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 100
    })
    await ticket.save()
    const order = Order.build({
        ticket,
        userId: 'sdfdsfsdf',
        expiresAt: new Date(),
        status: OrderStatus.Created
    })
    await order.save()
    return request(app)
        .post('/api/orders')
        .set('cookie',signin())
        .send({ticketid: ticket.id})
        .expect(400)
    
})

it("reserves a ticket", async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 100
    })
    await ticket.save()
    await request(app)
        .post('/api/orders')
        .set('cookie',signin())
        .send({ticketid: ticket.id})
        .expect(201)
})

it("reserves a ticket and publish event", async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 100
    })
    await ticket.save()
    await request(app)
        .post('/api/orders')
        .set('cookie',signin())
        .send({ticketid: ticket.id})
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})