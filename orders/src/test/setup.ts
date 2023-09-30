import { app } from '../app'
import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request  from "supertest"
import  jwt from 'jsonwebtoken';

let mongo: MongoMemoryServer

beforeAll(async () => {
    process.env.JWT_KEY = "adsdf"
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri,{})
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})


jest.mock('../nats-wrapper')
const signin =  () =>{
    const email = 'test@test.com'
    const id = new mongoose.Types.ObjectId().toHexString()
    const userDetails = {
        id: id,
        email: email,
    }
    
    const token = jwt.sign(userDetails,process.env.JWT_KEY!)
    const session = {jwt: token}
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return `session=${base64}`;

}

export {signin}