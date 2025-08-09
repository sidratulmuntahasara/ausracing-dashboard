'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  
  const events = [
    { date: new Date(2025, 7, 7), title: 'Team Meeting', color: 'bg-purple-500' },
    { date: new Date(2025, 7, 8), title: 'Lunch with Alex', color: 'bg-blue-500' },
    { date: new Date(2025, 7, 15), title: 'Project Deadline', color: 'bg-red-500' },
  ];

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayEvents = events.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
      
      return (
        <div className="mt-1">
          {dayEvents.map((event, index) => (
            <div 
              key={index} 
              className={`${event.color} w-2 h-2 rounded-full mx-auto mb-1`} 
              title={event.title}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3">
        <Calendar 
          onChange={(value) => {
            if (value instanceof Date) {
              setDate(value);
            }
          }} 
          value={date}
          className="border-gray-700 rounded-lg p-4 text-black"
          tileClassName={({ date, view }) => 
            view === 'month' && date.toDateString() === new Date().toDateString() 
              ? 'bg-purple-500' 
              : ''
          }
          tileContent={tileContent}
        />
      </div>
      
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-semibold mb-4">
          Events on {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <div className="space-y-3">
          {events
            .filter(event => event.date.toDateString() === date.toDateString())
            .map((event, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <div className={`${event.color} w-3 h-3 rounded-full mr-3`}></div>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
          {events.filter(event => event.date.toDateString() === date.toDateString()).length === 0 && (
            <p className="text-gray-400">No events scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;