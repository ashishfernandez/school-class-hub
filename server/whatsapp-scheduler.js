/**
 * 🤖 Automated WhatsApp Event Reminder Service
 * Runs daily at 09:00 AM server time.
 * Calculates events occurring in exactly 4 days and sends WhatsApp reminders via Twilio or Meta Cloud API.
 * 
 * Usage:
 * 1. npm install twilio node-cron dotenv
 * 2. Configure .env with TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, USER_WHATSAPP_NUMBER
 * 3. Run: node whatsapp-scheduler.js
 */

const cron = require('node-cron');
const twilio = require('twilio');

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN';
const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio Sandbox
const toWhatsApp = process.env.USER_WHATSAPP_NUMBER || 'whatsapp:+15550192834';

const client = twilio(accountSid, authToken);

// Sample Event Fetcher (Can be connected to your DB / API Endpoint)
async function fetchUpcomingEvents() {
  // In production, fetch from your deployed ClassConnect database or API
  return [
    { title: '🚌 Metro Zoo Science Field Trip', date: '2026-10-18', time: '08:30 AM', location: 'City Zoo' },
    { title: '🍕 Class Autumn Pizza & Pumpkin Party', date: '2026-10-24', time: '01:00 PM', location: 'Room 3B' }
  ];
}

// Function to check and send reminders
async function checkAndSendReminders() {
  console.log(`\n[${new Date().toISOString()}] 🔍 Checking calendar events for 4-day advance reminders...`);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await fetchUpcomingEvents();

  for (const event of events) {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // CHECK EXACTLY 4 DAYS BEFORE EVENT
    if (diffDays === 4) {
      const messageBody = 
        `🚨 *AUTOMATED 4-DAY CLASS REMINDER* 🚨\n\n` +
        `Event: ${event.title}\n` +
        `Date: ${event.date}\n` +
        `Time: ${event.time}\n` +
        `Location: ${event.location}\n\n` +
        `This event is in 4 days! Please ensure all preparations are complete.`;

      console.log(`🚀 Found event occurring in 4 days: "${event.title}". Dispatching WhatsApp message...`);

      try {
        if (accountSid !== 'YOUR_TWILIO_ACCOUNT_SID') {
          const message = await client.messages.create({
            body: messageBody,
            from: fromWhatsApp,
            to: toWhatsApp.startsWith('whatsapp:') ? toWhatsApp : `whatsapp:${toWhatsApp}`
          });
          console.log(`✅ WhatsApp Reminder Sent Successfully! Message SID: ${message.sid}`);
        } else {
          console.log(`⚠️ Twilio Credentials not set. Simulation mode log:`);
          console.log(`TO: ${toWhatsApp}\nMESSAGE:\n${messageBody}`);
        }
      } catch (err) {
        console.error(`❌ Error dispatching WhatsApp reminder:`, err);
      }
    } else {
      console.log(`ℹ️ Event "${event.title}" is in ${diffDays} days (not 4 days). Skipping.`);
    }
  }
}

// Schedule task to run every day at 9:00 AM (0 9 * * *)
cron.schedule('0 9 * * *', () => {
  checkAndSendReminders();
});

console.log('⚡ GISSVROOS WhatsApp 4-Day Reminder Cron Daemon Started!');
console.log('Running initial check on startup...');
checkAndSendReminders();
