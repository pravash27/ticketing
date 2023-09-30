import { Ticket } from "../../models/ticket"
import { signin } from "../../test/setup"
import request from 'supertest'
import { app } from "../../app"
import mongoose from "mongoose"
it("return all the order belogs to user 2", async () => {
    const user1 = signin()
    const user2 = signin()
    const ticket1 = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Screening',
        price: 100
    })
    await ticket1.save()
    const ticket2 = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Screening',
        price: 100
    })
    await ticket2.save()
    const ticket3 = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Screening',
        price: 100
    })
    await ticket3.save()
    const {body: order1} = await request(app)
        .post('/api/orders')
        .set('cookie',user1)
        .send({ticketid: ticket1.id})
        .expect(201)
    const {body: order2} = await request(app)
        .post('/api/orders')
        .set('cookie',user2)
        .send({ticketid: ticket2.id})
        .expect(201)
    const {body: order3} = await request(app)
        .post('/api/orders')
        .set('cookie',user2)
        .send({ticketid: ticket3.id})
        .expect(201)

    const { body: orders } = await  request(app)
                            .get('/api/orders')
                            .set('cookie',user2)
                            .send()
                            .expect(200)

    expect(orders.length).toEqual(2)
    expect(orders[0].id).toEqual(order2.id)
    expect(orders[1].id).toEqual(order3.id)
})