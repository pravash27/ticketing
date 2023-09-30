import request from 'supertest'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { signin } from '../../test/setup'

it("has a route handller listening /api/tickets for post requests",async () => {
    const response = await request(app)
            .post("/api/tickets")
            .send()
    expect(response.status).not.toEqual(404)
})

it("can only be accessed if user is signed in",async () => {
    const response = await request(app)
            .post("/api/tickets")
            .send({})
            .expect(401)
})

it("returns status code other than 401 if user is signed in",async () => {
    const response = await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({})
    expect(response.status).not.toEqual(401)
})

it("returns an error if invalid title is provided",async () => {
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: '',
                price: 10
            })
            .expect(400)
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                price: 10
            })
            .expect(400)
})

it("returns an error if invalid price is provided",async () => {
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: 'dfsfs',
                price: -10
            })
            .expect(400)
    await request(app)
            .post("/api/tickets")
            .set('cookie',signin())
            .send({
                title: 'dfsfs',
            })
            .expect(400)
})

it("create ticket with valid input",async () => {
    await request(app)
        .post("/api/tickets")
        .set('cookie',signin())
        .send({
            title: 'shdfkjdshk',
            price: 10
        })
        .expect(201)
})