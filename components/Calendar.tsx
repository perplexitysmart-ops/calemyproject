import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  // Helper to get day index where Monday is 0 and Sunday is 6
  const getMondayBasedDay = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const startDayOfMonth = (date: Date) => getMondayBasedDay(new Date(date.getFullYear(), date.getMonth(), 1));

  const generateDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const startDay = startDayOfMonth(currentMonth);

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < today;

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => onSelect(date)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all duration-200
            ${isSelected 
              ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30' 
              : isPast 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }
          `}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    // Don't allow going back before current month
    if (newDate.getMonth() < today.getMonth() && newDate.getFullYear() <= today.getFullYear()) return;
    setCurrentMonth(newDate);
  };

  // Capitalize first letter of month
  const monthName = currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          {formattedMonth}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wide">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {generateDays()}
      </div>
    </div>
  );
};

export default Calendar;