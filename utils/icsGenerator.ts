import { BookingData } from "../types";

export const generateICSFile = (data: BookingData): string => {
  if (!data.date || !data.timeSlot) return '';

  // Парсинг даты и времени
  const [hours, minutes] = data.timeSlot.split(':').map(Number);
  const startDate = new Date(data.date);
  startDate.setHours(hours, minutes, 0);

  // Длительность встречи (например, 1 час)
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const summary = `Встреча: ${data.name}`;
  const description = `Тема: ${data.description}\n\nПовестка (AI):\n${data.agenda || 'Не указана'}\n\nEmail: ${data.email}`;
  
  // Генерация контента .ics
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ConnectAndCollaborate//RU',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:Online / Phone`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'DESCRIPTION:Reminder',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};

export const downloadICS = (data: BookingData) => {
  const content = generateICSFile(data);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'meeting_invite.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};