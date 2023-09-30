import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { currentUser, errorHandler, NotFoundError } from '@prticket/common'

import cookieSession from 'cookie-session'
import { chargeOrderRouter } from './routes/charge-order'



const app = express()
app.set("trust proxy",true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !=='test'
}))

app.use(currentUser)
app.use(chargeOrderRouter)

app.all("*",async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}