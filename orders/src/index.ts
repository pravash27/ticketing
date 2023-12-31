import mongoose from 'mongoose'
import { app } from './app'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';
const start = async () => {
    console.log("Started......")
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY is not specified");
    }
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI is not specified");
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error("NATS_CLUSTER_ID is not specified");
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error("NATS_CLIENT_ID is not specified");
    }
    if(!process.env.NATS_URL){
        throw new Error("NATS_URL is not specified");
    }
    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)
        natsWrapper.client.on('close', () => { 
            console.log("Listener is closed")
            process.exit()
        })
        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        process.on("SIGINT", () => natsWrapper.client.close())
        process.on("SIGTERM", () => natsWrapper.client.close())
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

