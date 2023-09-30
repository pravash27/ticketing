import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/setup'

it("returns 404 if ticket not found",async () => {
    const response = await request(app)
            .get("/api/tickets/hsdkfjhsdkfj")
            .set('cookie',signin())
            .send()
            .expect(404)
})

it("returns ticket if ticket found",async () => {
    const response = await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(201)
    const ticket = response.body;

    const responseTicket =  await request(app)
            .get(`/api/tickets/${ticket.id}`)
            .set('cookie',signin())
            .send()
            .expect(200)

    expect(responseTicket.body.title).toEqual('Concert')
    expect(responseTicket.body.price).toEqual(100)
})
