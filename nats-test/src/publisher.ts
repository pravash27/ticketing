import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher Connected to NATS')
    const data = {
        id: '234',
        title: 'Concert',
        price: 200
    }
    const ticketCreated = new TicketCreatedPublisher(stan)
    await ticketCreated.publish(data)
})