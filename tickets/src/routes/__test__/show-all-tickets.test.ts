import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/setup'


it("returns all tickets",async () => {
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(201)
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(201)
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: 'Concert',
                price: 100
            })
            .expect(201)

    const responseTicket =  await request(app)
            .get(`/api/tickets/`)
            .set('cookie',signin())
            .send()
            .expect(200)

    expect(responseTicket.body.length).toEqual(3)

})
