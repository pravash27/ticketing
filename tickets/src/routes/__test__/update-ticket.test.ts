import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/setup'
import { natsWrapper } from '../../nats-wrapper'

it("returns 404 if provided ticket id not found",async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
            .put(`/api/tickets`)
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(404)
})

it("returns 401 if user not authenticated",async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(401)

})

it("returns 401 if user does not own ticket",async () => {
    const ticketResponse = await request(app)
            .post(`/api/tickets`)
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(201)
    const ticket = ticketResponse.body
    await request(app)
            .put(`/api/tickets/${ticket.id}`)
            .set('cookie',signin())
            .send({
                title: 'New Concert',
                price: 1000
            })
            .expect(401)
})

it("returns 400 if user provides invalid title or price",async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
            .put(`/api/tickets/${id}`)
            .set('cookie',signin())
            .send({
                title: '',
                price: 10
            })
            .expect(400)
    await request(app)
            .put(`/api/tickets/${id}`)
            .set('cookie',signin())
            .send({
                price: 10
            })
            .expect(400)
    await request(app)
            .put(`/api/tickets/${id}`)
            .set('cookie',signin())
            .send({
                title: 'dfsfs',
                price: -10
            })
            .expect(400)
    await request(app)
            .put(`/api/tickets/${id}`)
            .set('cookie',signin())
            .send({
                title: 'dfsfs',
            })
            .expect(400)
})

it("return 200 after successfully updating ticket",async () => {
    const ticketResponse = await request(app)
            .post(`/api/tickets`)
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(201)
    const ticket = ticketResponse.body
    await request(app)
            .put(`/api/tickets/${ticket.id}`)
            .set('cookie',signin())
            .send({
                title: 'New Concert',
                price: 1000
            })
            .expect(200)
})
