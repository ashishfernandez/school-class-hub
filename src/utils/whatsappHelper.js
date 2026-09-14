/**
 * WhatsApp Reminder Math & Link Helper
 */

// Calculate 4 days prior to event date
export function calculateReminderDate(eventDateStr) {
  if (!eventDateStr) return null;
  const eventDate = new Date(eventDateStr);
  const reminderDate = new Date(eventDate);
  reminderDate.setDate(eventDate.getDate() - 4);
  return reminderDate;
}

export function formatDateString(dateObj) {
  if (!dateObj) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getReminderStatus(eventDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(eventDateStr);
  eventDate.setHours(0, 0, 0, 0);

  const reminderDate = calculateReminderDate(eventDateStr);
  if (!reminderDate) return { label: 'Unknown', color: 'gray' };

  reminderDate.setHours(0, 0, 0, 0);

  const diffTime = reminderDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: '🔔 Reminder Due TODAY (4 Days Before Event)', badge: 'urgent', code: 'DUE_TODAY' };
  } else if (diffDays > 0) {
    return { label: `📅 Scheduled (Triggers in ${diffDays} day${diffDays > 1 ? 's' : ''})`, badge: 'scheduled', code: 'SCHEDULED' };
  } else {
    return { label: '✅ Reminder Window Passed', badge: 'passed', code: 'PASSED' };
  }
}

export function formatWhatsAppMessage(event, recipientName = 'Class Family') {
  const reminderDateStr = formatDateString(calculateReminderDate(event.date));
  return `*🚨 4-DAY CLASS EVENT REMINDER 🚨*\n\n` +
    `Hello ${recipientName}!\n` +
    `This is an automated 4-day advance reminder for our upcoming class event:\n\n` +
    `📌 *Event:* ${event.title}\n` +
    `📅 *Event Date:* ${event.date}\n` +
    `⏰ *Time:* ${event.time || 'All Day'}\n` +
    `📍 *Location:* ${event.location || 'School'}\n` +
    `📝 *Details:* ${event.description || 'No additional details.'}\n\n` +
    `🔔 *Reminder Triggered On:* ${reminderDateStr} (4 days before event)\n\n` +
    `Please check the ClassConnect Portal for updates!`;
}

export function generateWhatsAppLink(phoneNumber, event) {
  const cleanPhone = (phoneNumber || '').replace(/[^\d]/g, '');
  const message = encodeURIComponent(formatWhatsAppMessage(event));
  
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${message}`;
  } else {
    return `https://api.whatsapp.com/send?text=${message}`;
  }
}
