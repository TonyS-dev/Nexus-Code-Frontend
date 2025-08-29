// src/components/Calendar.js
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export function renderCalendar(container, events = []) {
  new Calendar(container, {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    height: 'auto',
    allDayDefault: true, // All events are all-day by default
    displayEventTime: false, // Don't display time for events
    events: events.map(e => ({
      title: e.type.charAt(0).toUpperCase() + e.type.slice(1), // Capitalize first letter
      start: e.start_date.split('T')[0], // Extract only the date part
      end: e.end_date ? e.end_date.split('T')[0] : e.start_date.split('T')[0],
      allDay: true, // Mark as all-day event
      color: e.status === 'approved' ? '#27ae60' : e.status === 'pending' ? '#f39c12' : e.status === 'rejected' ? '#e74c3c' : '#95a5a6'
    }))
  }).render();
}