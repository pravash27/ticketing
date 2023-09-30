import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError } from '@prticket/common'
import { requestValidation } from '@prticket/common'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage("Email is no valid"),
        body('password')
            .trim()
            .notEmpty()
            .withMessage("Password is invalid")
    ],
    requestValidation,
    async (req: Request,res: Response) => 
    {
        const {email, password} = req.body
        const existingUser = await User.findOne({email})
        if(!existingUser){
            throw new BadRequestError('Invalid Email and Password')
        }
        
        const comparePassword = await Password.compare(existingUser.password, password)
        if(!comparePassword){
            throw new BadRequestError('Invalid Email and Password')
        }
        const jsonWebToken = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        },process.env.JWT_KEY!)
        req.session = {
            jwt: jsonWebToken
        }
        res.status(200).send(existingUser);
    }
)

export { router as signin }