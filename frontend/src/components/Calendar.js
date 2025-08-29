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
      right: ''
    },
    height: 'auto',
    allDayDefault: true,
    displayEventTime: false,
    dayMaxEvents: 3, // Limit events shown per day
    moreLinkClick: 'popover', // Show popover for extra events
    eventDisplay: 'block',
    eventBackgroundColor: 'transparent',
    eventBorderColor: 'transparent',
    eventTextColor: '#fff',
    dayCellClassNames: function(info) {
      return 'hover:bg-gray-50 cursor-pointer transition-colors';
    },
    events: events.map(e => ({
      title: e.type.charAt(0).toUpperCase() + e.type.slice(1),
      start: e.start_date.split('T')[0],
      end: e.end_date ? e.end_date.split('T')[0] : e.start_date.split('T')[0],
      allDay: true,
      backgroundColor: getEventColor(e.status),
      borderColor: getEventColor(e.status),
      textColor: '#ffffff',
      extendedProps: {
        status: e.status,
        type: e.type
      }
    })),
    eventContent: function(arg) {
      return {
        html: `<div class="px-1 py-0.5 text-xs font-medium rounded truncate" style="background-color: ${getEventColor(arg.event.extendedProps.status)};">
                 ${arg.event.title}
               </div>`
      };
    }
  }).render();
}

function getEventColor(status) {
  const colors = {
    'approved': '#10b981',
    'pending': '#f59e0b',   
    'rejected': '#ef4444',  
    'cancelled': '#6b7280'  
  };
  return colors[status?.toLowerCase()] || '#6b7280';
}