export class IncomingMessage {
  id: string;
  business: {
    phoneNumber: string;
    phoneNumberId: string;
  };
  message: { type: string; from: string; id: string; timestamp: string };
  customer: {
    phoneNumber: string;
    profile: { name: string };
  };
}
