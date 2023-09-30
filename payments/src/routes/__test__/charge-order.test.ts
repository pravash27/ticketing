import { OrderStatus } from '@prticket/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { signin } from '../../test/setup'
import { stripe }  from '../../stripe'
import { Payment } from '../../models/payment'

//jest.mock("../../stripe")
it("return 404 if order not found", async () => {
    await request(app)
        .post("/api/payments")
        .set('cookie', signin())
        .send({
            tokenId: 'sdfsdf',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it("return 401 if order belongs to other user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 90,
        status: OrderStatus.Created
    })
    await order.save()
    await request(app)
        .post("/api/payments")
        .set('cookie', signin())
        .send({
            tokenId: 'sdfsdf',
            orderId: order.id
        })
        .expect(401)
})

it("return 400 if order is already cancelled", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        price: 90,
        status: OrderStatus.Cancelled
    })
    await order.save()
    await request(app)
    .post("/api/payments")
    .set('cookie', signin(userId))
    .send({
        tokenId: 'sdfsdf',
        orderId: order.id
    })
    .expect(400)
})

it("return 201 with successfull payment", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId,
        price: price,
        status: OrderStatus.Created
    })
    await order.save()
    let x = await request(app)
    .post("/api/payments")
    .set('cookie', signin(userId))
    .send({
        tokenId: 'tok_visa',
        orderId: order.id
    })
    expect(x.statusCode).toEqual(201)
    const stripeCharges = await stripe.paymentIntents.list({ limit: 50})
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100
    })
    expect(stripeCharge).toBeDefined()
    expect(stripeCharge?.currency).toEqual("usd");

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    })
    expect(payment).not.toBeNull();
})