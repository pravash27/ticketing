import { Publisher, Subjects, TicketCreatedEvent } from "@prticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}