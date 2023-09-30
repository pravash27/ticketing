import request  from "supertest"
import { app } from "../../app"

it("returns 201 on successful signup", async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com',
            password: 'password'
        })
        .expect(201)
})

it("returns 400 with an invalid email", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs',
            password: 'fffff'
        })
        .expect(400)
})

it("returns 400 with an invalid password", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com',
            password: 'f'
        })
        .expect(400)
})

it("returns 400 with missing email and password", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com'
        })
        .expect(400)
    await request(app)
        .post('/api/users/signup')
        .send({
            password: '123'
        })
        .expect(400)
})

it("disallow duplicate emails", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com',
            password: '1234'
        })
        .expect(201)
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com',
            password: '1234'
        })
        .expect(400)
})

it("set cookie after successful sign up", async () => {
    const response =  await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com',
            password: '1234'
        })
        .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined()
})