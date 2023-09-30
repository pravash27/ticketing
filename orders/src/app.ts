import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { currentUser, errorHandler, NotFoundError } from '@prticket/common'

import cookieSession from 'cookie-session'
import { createOrderRouter } from './routes/new-order'
import { deleteOrderRouter } from './routes/delete-order'
import { getOrderRouter } from './routes/get-order'
import { allOrderRouter } from './routes/get-all-order'


const app = express()
app.set("trust proxy",true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !=='test'
}))

app.use(currentUser)
app.use(createOrderRouter)
app.use(deleteOrderRouter)
app.use(getOrderRouter)
app.use(allOrderRouter)

app.all("*",async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}