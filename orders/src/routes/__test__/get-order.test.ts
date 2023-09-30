import { Ticket } from "../../models/ticket"
import { signin } from "../../test/setup"
import request from 'supertest'
import { app } from "../../app"
import mongoose from "mongoose"
it("return the order belogs to user", async () => {
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

    const { body: ordersData } = await  request(app)
                            .get('/api/orders/'+order.id)
                            .set('cookie',user)
                            .send()
                            .expect(200)

    expect(ordersData.id).toEqual(order.id)
})

it("return 401 if order not belog to user", async () => {
    const user1 = signin()
    const user2 = signin()
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Screening',
        price: 100
    })
    await ticket.save()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('cookie',user1)
        .send({ticketid: ticket.id})
        .expect(201)

    await  request(app)
        .get('/api/orders/'+order.id)
        .set('cookie',user2)
        .send()
        .expect(401)

})