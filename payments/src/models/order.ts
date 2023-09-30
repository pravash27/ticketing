import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@prticket/common'

interface OrderAttrs {
    id: string,
    version: number,
    status: OrderStatus,
    price: number,
    userId: string,
}

interface OrderDoc extends mongoose.Document{
    version: number,
    status: OrderStatus,
    price: number,
    userId: string
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs) : OrderDoc 
}


const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        },
    }
})

orderSchema.set("versionKey","version")
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status
    })
}



const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema)

export { Order }


