import request from 'supertest'
import { Ticket } from '../ticket'
it("check the version validation", async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 100,
        userId: 'dsfdsfdsf'
    })
    await ticket.save()
    const updatedTicket = await Ticket.findById(ticket.id)
    updatedTicket!.set({
        title: "Concert",
        price: 200
    })
    await updatedTicket!.save()
    updatedTicket!.set({
        title: "Concert",
        price: 300
    })
    await updatedTicket!.save()
})