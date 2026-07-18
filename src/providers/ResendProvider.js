
import { env } from '~/config/environment';
import { Resend } from 'resend';


const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  const resend = new Resend(env.RESEND_APIKEY);
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: recipientEmail,
    subject: customSubject,
    html: htmlContent
  });
}
export const ResendProvider = {
  sendEmail
}