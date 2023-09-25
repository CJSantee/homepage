const twilio = require('twilio');

const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = process.env;

const twilioClient = twilio(
  TWILIO_ACCOUNT_SID || 'AC',
  TWILIO_AUTH_TOKEN || 'password',
);

const TWILIO_TOLL_FREE_NUMBER = '+18555040561';

export async function sendMessage(message: string, to: string) {
  const sentMessage = await twilioClient.messages.create({
    from: TWILIO_TOLL_FREE_NUMBER,
    to,
    body: message,
  });
  console.log('sentMessage', sentMessage);
}
