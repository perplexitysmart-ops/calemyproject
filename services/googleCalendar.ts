import { BookingData } from "../types";

const CLIENT_ID = '922787364972-oonlmduc83kklj8dsm56h6i6jnddkr0d.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// Type definition for the Google Identity Services client
interface TokenClient {
  requestAccessToken: (overrideConfig?: any) => void;
  callback?: (resp: any) => void;
}

let tokenClient: TokenClient | null = null;

export const initializeGoogleCalendar = () => {
  if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (resp: any) => {}, // placeholder, will be overridden
        });
        console.log('Google Token Client initialized');
    } catch (e) {
        console.error('Error initializing token client:', e);
    }
  } else {
    // Retry slightly later if script isn't ready
    setTimeout(initializeGoogleCalendar, 500);
  }
};

export const createCalendarEvent = async (data: BookingData, ownerEmail: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
        initializeGoogleCalendar();
        if(!tokenClient) {
            return reject({ error: 'Google Client not ready', message: 'Скрипт авторизации не загружен' });
        }
    }

    // Define the callback that handles the token response
    if (tokenClient) {
        tokenClient.callback = async (resp: any) => {
            if (resp.error) {
                console.error('Google Auth Error:', resp);
                reject(resp);
                return;
            }

            if (resp.access_token) {
                try {
                    await postEventToCalendar(resp.access_token, data, ownerEmail);
                    resolve(true);
                } catch (error) {
                    console.error('Error creating event:', error);
                    // We resolve false here because auth worked, but API call failed
                    // In real world, we might want to reject to show detailed error
                    reject(error);
                }
            }
        };

        try {
             // Prompt for consent to ensure we get a fresh token if needed
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (e) {
            reject(e);
        }
    }
  });
};

const postEventToCalendar = async (accessToken: string, data: BookingData, ownerEmail: string) => {
  if (!data.date || !data.timeSlot) return;

  const [hours, minutes] = data.timeSlot.split(':').map(Number);
  const startDate = new Date(data.date);
  startDate.setHours(hours, minutes, 0);
  
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1); // 1 hour duration

  const event = {
    summary: `Встреча: ${data.name}`,
    description: `Тема: ${data.description}\n\nПовестка (AI):\n${data.agenda || 'Не указана'}`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    attendees: [
      { email: ownerEmail }, 
      { email: data.email }
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Calendar API Error: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Event created:', result);
};

declare global {
  const google: any;
}