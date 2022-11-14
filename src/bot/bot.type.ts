export class IncomingMessage {
  id: string;
  business: {
    displayPhoneNumber: string;
    phoneNumberId: string;
  };
  message: { type: string };
  customer: {
    customerWhatsappId: string;
    profile: { name: string };
  };
}
