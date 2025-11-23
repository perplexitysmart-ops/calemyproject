import React, { useState, useCallback } from 'react';
import { EngagementType, BookingData } from '../types';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import { generateAgenda } from '../services/geminiService';
import { SparklesIcon, ArrowLeftIcon, CalendarIcon } from './Icons';

interface BookingFormProps {
  type: EngagementType;
  onSubmit: (data: BookingData) => void;
  onBack: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ type, onSubmit, onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [generatedAgenda, setGeneratedAgenda] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getTitle = () => {
    switch (type) {
      case EngagementType.HIRE: return "Пригласить в команду";
      case EngagementType.COLLABORATE: return "Участвовать в проекте";
      case EngagementType.OUTSOURCE: return "Отдать проект на аутсорсинг";
      default: return "Записаться на звонок";
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case EngagementType.HIRE: return "Расскажите о вакансии и требованиях...";
      case EngagementType.COLLABORATE: return "Опишите идею партнерства...";
      case EngagementType.OUTSOURCE: return "Кратко опишите масштаб проекта...";
      default: return "Детали...";
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    const agenda = await generateAgenda(description, type);
    setGeneratedAgenda(agenda);
    setIsAnalyzing(false);
  }, [description, type]);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      date,
      timeSlot,
      description,
      agenda: generatedAgenda
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium group"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Назад к вариантам
      </button>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-wider uppercase border border-indigo-500/20">
                    {step === 1 ? 'Шаг 1 из 2' : 'Шаг 2 из 2'}
                 </span>
            </div>
          <h2 className="text-3xl font-bold text-white">{getTitle()}</h2>
          <p className="text-slate-400 mt-2">Выберите удобное время для обсуждения.</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar / Summary */}
          <div className="w-full md:w-1/3 p-8 bg-slate-950/50 border-r border-slate-800/50">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Детали встречи</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                   <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Дата</p>
                  <p className="font-medium text-white">
                    {date ? date.toLocaleDateString('ru-RU', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Выберите дату'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Время</p>
                  <p className="font-medium text-white">
                    {timeSlot || 'Выберите время'}
                  </p>
                </div>
              </div>
            </div>

             {step === 2 && (
                <div className="mt-8 pt-8 border-t border-slate-800 animate-fade-in">
                     <h4 className="text-indigo-400 font-medium text-sm mb-2 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" /> AI Повестка
                     </h4>
                     <div className="text-sm text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800/60">
                         {generatedAgenda ? (
                             <ul className="space-y-2 list-disc list-inside opacity-90">
                                {generatedAgenda.split('\n').map((item, idx) => (
                                    <li key={idx} className="leading-relaxed">{item.replace(/^[•-]\s*/, '')}</li>
                                ))}
                             </ul>
                         ) : (
                            <span className="italic text-slate-500">Повестка генерируется...</span>
                         )}
                     </div>
                </div>
             )}
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 p-8">
            {step === 1 ? (
              <div className="space-y-8 animate-slide-up">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Выберите дату</h3>
                  <Calendar selectedDate={date} onSelect={setDate} />
                </div>
                
                <div>
                   <h3 className="text-lg font-medium text-white mb-4">Доступные слоты</h3>
                   <TimeSlots selectedTime={timeSlot} onSelect={setTimeSlot} />
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    disabled={!date || !timeSlot}
                    onClick={() => setStep(2)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                  >
                    Продолжить
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">ФИО</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none placeholder-slate-600"
                            placeholder="Иван Иванов"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none placeholder-slate-600"
                            placeholder="ivan@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Описание / Контекст</label>
                  <div className="relative">
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none placeholder-slate-600 resize-none"
                        placeholder={getPlaceholder()}
                      />
                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={!description || isAnalyzing}
                        className="absolute bottom-3 right-3 flex items-center gap-2 text-xs font-medium bg-slate-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <SparklesIcon className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        {isAnalyzing ? 'Анализ...' : 'Создать повестку'}
                      </button>
                  </div>
                  <p className="text-xs text-slate-500">Нажмите "Создать повестку", чтобы AI подготовил план встречи на основе вашего описания.</p>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-slate-800">
                   <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    disabled={!name || !email || !description}
                    className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    Подтвердить запись
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;