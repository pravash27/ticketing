import express from 'express'
import { checkAuth } from '@prticket/common'
import { currentUser } from '@prticket/common'

const router = express.Router()

router.get('/api/users/currentuser',currentUser,(req,res) => {
    res.send({currentUser: req.currentUser});
})

export { router as currentUser }