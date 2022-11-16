export class IncomingMessage {
  id: string;
  business: {
    phoneNumber: string;
    phoneNumberId: string;
  };
  message: {
    text?: any;
    type: string;
    from: string;
    id: string;
    timestamp: string;
  };
  customer: {
    phoneNumber: string;
    profile: { name: string };
  };
}
