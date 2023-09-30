import { app } from '../app'
import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request  from "supertest"
declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>;
        }
    }
}

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

// global.signin = async (): Promise<String[]> =>{
//     const email = 'test@test.com'
//     const password = "password"
//     const response = await request(app)
//     .post('/api/users/signup')
//     .send({
//         email: email,
//         password: password
//     })
//     .expect(201)

//     const cookie = response.get('Set-Cookie')
//     return cookie;

// }