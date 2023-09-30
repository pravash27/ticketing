import { ExpirationCompleteEvent, Publisher, Subjects } from "@prticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}