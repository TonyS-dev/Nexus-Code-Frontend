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
    events: events.map(e => ({
      title: e.type,
      start: e.start_date,
      end: e.end_date,
      color: e.status === 'approved' ? '#27ae60' : '#e67e22'
    }))
  }).render();
}