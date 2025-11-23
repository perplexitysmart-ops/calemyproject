import React from 'react';
import { ClockIcon } from './Icons';

interface TimeSlotsProps {
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedTime, onSelect }) => {
  // Mock time slots in 24h format
  const slots = [
    "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:30",
    "16:30", "17:30"
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((time) => (
        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`
            group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200
            ${selectedTime === time
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-700/50'
            }
          `}
        >
          <ClockIcon className={`w-4 h-4 ${selectedTime === time ? 'text-indigo-200' : 'text-slate-500 group-hover:text-indigo-400'}`} />
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeSlots;