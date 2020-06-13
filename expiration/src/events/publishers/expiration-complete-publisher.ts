import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@sg-tickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
