import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { currentUser } from './routes/current-user'
import { signin } from './routes/signin'
import { signout } from './routes/signout'
import { signup } from './routes/signup'
import { errorHandler } from '@prticket/common'
import { NotFoundError } from '@prticket/common'

import cookieSession from 'cookie-session'


const app = express()
app.set("trust proxy",true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !=='test'
}))
app.use(currentUser)
app.use(signin)
app.use(signout)
app.use(signup)
app.all("*",async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}