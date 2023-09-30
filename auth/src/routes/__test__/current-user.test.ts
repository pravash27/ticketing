import request from 'supertest'
import {app} from '../../app'

it("get current user", async () => {
    const signup=  await request(app)
        .post('/api/users/signup')
        .send({
            email: 'prs@gmail.com',
            password: 'password'
        })
        .expect(201)
    const cookie = signup.get('Set-Cookie')
    return await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(200)
    
})

it("unauth access to get current user", async () => {
    const user =  await request(app)
    .get('/api/users/currentuser')
    .send()
    expect(user.body?.email).toEqual(undefined);
    
})