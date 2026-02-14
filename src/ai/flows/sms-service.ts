'use server';
/**
 * @fileOverview SMS Service for handling OTP generation and formatting.
 * 
 * - sendOtpSms - Generates and "sends" a verification code to a mobile number.
 * - verifyOtp - (Simulated) validation of the OTP.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmsTemplateInputSchema = z.object({
  mobileNumber: z.string().describe('The destination mobile number.'),
  appName: z.string().default('ePAO').describe('The name of the application.'),
  loginCode: z.string().describe('The 6-digit verification code.'),
});

const SmsTemplateOutputSchema = z.object({
  formattedMessage: z.string().describe('The final SMS message string.'),
});

/**
 * Defines a prompt to format the SMS message according to the user's template.
 */
const smsPrompt = ai.definePrompt({
  name: 'smsPrompt',
  input: { schema: SmsTemplateInputSchema },
  output: { schema: SmsTemplateOutputSchema },
  prompt: `You are an SMS gateway formatter.
  
Format the following verification message exactly as follows:
{{loginCode}} is your verification code for {{appName}}.

Input Details:
Mobile: {{mobileNumber}}
Code: {{loginCode}}
App: {{appName}}`,
});

/**
 * Server action to "send" an SMS OTP.
 * In this prototype, it returns the code and logs the formatted message.
 */
export async function sendOtpSms(mobileNumber: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  const { output } = await smsPrompt({
    mobileNumber,
    loginCode: code,
    appName: 'ePAO',
  });

  const message = output?.formattedMessage || `${code} is your verification code for ePAO.`;
  
  // LOGGING: This is where you'd call an actual SMS API (e.g., Twilio)
  console.log('--- SMS GATEWAY SIMULATION ---');
  console.log(`TO: ${mobileNumber}`);
  console.log(`MESSAGE: ${message}`);
  console.log('------------------------------');

  return { 
    success: true, 
    code, // Returning the code for prototype testing convenience
    message: "A verification code has been sent to your mobile number."
  };
}
