import { OrderCancelledEvent, Publisher, Subjects } from "@prticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}