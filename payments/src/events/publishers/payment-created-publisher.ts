import { PaymentCreatedEvent, Publisher, Subjects } from "@prticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}