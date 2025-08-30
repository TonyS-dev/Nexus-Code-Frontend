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
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    eventDisplay: 'block',
    eventBackgroundColor: 'transparent',
    eventBorderColor: 'transparent',
    eventTextColor: '#fff',
    // Custom button styling
    buttonText: {
      today: 'Today',
      prev: '‹',
      next: '›'
    },
    // Custom CSS classes for buttons
    customButtons: {},
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
    },
    // Apply custom styles after render
    viewDidMount: function() {
      // Style the buttons to match your theme
      const buttons = container.querySelectorAll('.fc-button');
      buttons.forEach(button => {
        button.style.backgroundColor = '#6b46f3'; // Primary blue
        button.style.borderColor = '#EFE9E9FF';
        button.style.color = 'white';
        button.style.borderRadius = '0.5rem'; // rounded-lg
        button.style.fontWeight = '500';
        button.style.padding = '0.5rem 1rem';
        button.style.transition = 'all 0.2s';
        
        // Hover effects
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = '#6b46f3'; // Darker blue
          button.style.borderColor = '#967EFFFF';
        });
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = '#6b46f3';
          button.style.borderColor = '#E9E9EFFF';
        });
      });
      
      // Popover z-index to appear above everything
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const popover = node.querySelector?.('.fc-popover') || (node.classList?.contains('fc-popover') ? node : null);
              if (popover) {
                popover.style.zIndex = '9999';
                popover.style.position = 'fixed';
              }
            }
          });
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
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