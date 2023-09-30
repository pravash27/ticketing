import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError } from '@prticket/common'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'
import { requestValidation } from '@prticket/common'
const router = express.Router()

router.post(
    '/api/users/signup',
    [
        body("email")
            .isEmail()
            .withMessage("Email is no valid"),
        body("password")
            .isLength({min: 4, max: 20})
            .withMessage("Password must be between 4 and 20 characters")
    ],
    requestValidation,
    async (req: Request,res: Response) => {
        const {email, password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            throw new BadRequestError('User already exists with this email!!')
        }
        const user = await User.build({email,password})
        await user.save()
        const jsonWebToken = jwt.sign({
            id: user.id,
            email: user.email
        },process.env.JWT_KEY!)
        req.session = {
            jwt: jsonWebToken
        }
        res.status(201).send(user);
    }
)

export { router as signup }