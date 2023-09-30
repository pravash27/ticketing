import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { TicketUpdatedListener } from './events/ticket-updated-listener';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener Connected to NATS')
    stan.on('close', () => {
        console.log("Listener is closed")
        process.exit()
    })
    new TicketCreatedListener(stan).listen()
    new TicketUpdatedListener(stan).listen()
})
process.on("SIGINT", () => stan.close())
process.on("SIGTERM", () => stan.close())



