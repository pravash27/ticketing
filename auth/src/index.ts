import mongoose from 'mongoose'
import { app } from './app'
const start = async () => {
    console.log("Auth Startedff")
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY is not specified");
    }
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI is not specified");
    }
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database")
    }catch(e){
        console.error(e)
    }
    app.listen(3000,() => {
        console.log("Listening at port 3000!")
    })
}
start();

