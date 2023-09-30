import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { currentUser, errorHandler, NotFoundError } from '@prticket/common'

import cookieSession from 'cookie-session'
import { createTickerRouter } from './routes/new-ticket'
import { showTickets } from './routes/show-tickets'
import { showAllTickets } from './routes/show-all-tickets'
import { updateTicket } from './routes/update-ticket'


const app = express()
app.set("trust proxy",true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !=='test'
}))

app.use(currentUser)
app.use(createTickerRouter)
app.use(showTickets)
app.use(showAllTickets)
app.use(updateTicket)
app.all("*",async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}