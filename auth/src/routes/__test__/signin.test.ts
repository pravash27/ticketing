import request  from "supertest"
import { app } from "../../app"

it("failed when a email does not exist is supplied", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@gmail.com",
            password: "1234"
        })
        .expect(400)
})

it("failed when a incorrect password is supplied", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "1234"
        })
        .expect(201)
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@gmail.com",
            password: "12345"
        })
        .expect(400)
})

it("failed when a correct email and  password is supplied", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "1234"
        })
        .expect(201)
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@gmail.com",
            password: "1234"
        })
        .expect(200)
    expect(response.get('Set-Cookie')).toBeDefined()
})