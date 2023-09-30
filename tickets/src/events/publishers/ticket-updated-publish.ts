import { Publisher, Subjects, TicketUpdatedEvent } from "@prticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}