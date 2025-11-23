import React, { useState, useEffect } from 'react';
import { EngagementType, ViewState, BookingData, EngagementOption } from './types';
import BookingForm from './components/BookingForm';
import { BriefcaseIcon, UsersIcon, RocketIcon, CheckCircleIcon, CalendarIcon } from './components/Icons';
import { downloadICS } from './utils/icsGenerator';
import { initializeGoogleCalendar, createCalendarEvent } from './services/googleCalendar';
import GoogleSetupModal from './components/GoogleSetupModal';

// !!! ВАЖНО: Email владельца для получения приглашений
const OWNER_EMAIL = "perplexity.smart@gmail.com"; 

const OPTIONS: EngagementOption[] = [
  {
    id: EngagementType.HIRE,
    title: "Пригласить в команду",
    description: "Найдите таланты и пригласите специалистов в свою команду.",
    iconName: 'Briefcase',
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: EngagementType.COLLABORATE,
    title: "Участвовать в общем проекте",
    description: "Станьте партнером в совместном предприятии или open-source инициативе.",
    iconName: 'Users',
    gradient: "from-violet-500 to-fuchsia-500"
  },
  {
    id: EngagementType.OUTSOURCE,
    title: "Отдать проект на аутсорсинг",
    description: "Наймите наше агентство для разработки и запуска вашего продукта.",
    iconName: 'Rocket',
    gradient: "from-orange-500 to-amber-500"
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [selectedType, setSelectedType] = useState<EngagementType | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Initialize Google Calendar Service on mount
  useEffect(() => {
    const timer = setTimeout(() => {
        initializeGoogleCalendar();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOptionClick = (type: EngagementType) => {
    setSelectedType(type);
    setView('BOOKING');
  };

  const handleBookingSubmit = (data: BookingData) => {
    setBookingData(data);
    setView('SUCCESS');
    console.log("Booking Data:", data);
  };

  const handleAddToGoogleCalendar = async () => {
    if (!bookingData) return;
    setIsGoogleLoading(true);
    try {
        const success = await createCalendarEvent(bookingData, OWNER_EMAIL);
        if (success) {
            alert('Событие успешно добавлено в ваш Google Календарь!');
        }
    } catch (error: any) {
        console.error(error);
        // If it's an auth error, show the setup modal to help the user
        if (error.error === 'idpiframe_initialization_failed' || error.error === 'invalid_request' || error.type === 'token_failed') {
             setIsSetupModalOpen(true);
        } else {
             const errorMessage = error.error || error.message || 'Неизвестная ошибка';
             alert(`Не удалось создать событие: ${errorMessage}\nПопробуйте скачать .ics файл.`);
        }
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const renderIcon = (name: string, className: string) => {
      if (name === 'Briefcase') return <BriefcaseIcon className={className} />;
      if (name === 'Users') return <UsersIcon className={className} />;
      return <RocketIcon className={className} />;
  }

  // Функция для формирования mailto ссылки (отправка данных владельцу)
  const getMailtoLink = () => {
    if (!bookingData) return '#';
    const subject = encodeURIComponent(`Новая встреча: ${bookingData.name}`);
    const body = encodeURIComponent(
      `Имя: ${bookingData.name}\nEmail: ${bookingData.email}\nДата: ${bookingData.date?.toLocaleDateString('ru-RU')}\nВремя: ${bookingData.timeSlot}\n\nОписание:\n${bookingData.description}\n\nПовестка (AI):\n${bookingData.agenda}`
    );
    return `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500/30">
       <GoogleSetupModal isOpen={isSetupModalOpen} onClose={() => setIsSetupModalOpen(false)} />

       {/* Abstract Background Shapes */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-3xl" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-3xl" />
          <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-violet-900/10 blur-3xl" />
       </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Logo/Header */}
        <header className="flex justify-center mb-16">
           <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Связь и Сотрудничество
              </h1>
              <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
                Выберите способ взаимодействия. Мы упростили процесс, чтобы вы могли быстро связаться с нужным человеком.
              </p>
           </div>
        </header>

        {view === 'LANDING' && (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in">
            {OPTIONS.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="group relative bg-slate-900 rounded-3xl p-1 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 text-left flex flex-col h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />
                
                <div className="relative h-full bg-slate-950/50 rounded-[22px] p-8 overflow-hidden">
                    {/* Icon Circle */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-slate-700/50 group-hover:border-indigo-500/30">
                        {renderIcon(option.iconName, "w-8 h-8 text-indigo-400 group-hover:text-white transition-colors")}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                        {option.title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-8">
                        {option.description}
                    </p>

                    <div className="mt-auto flex items-center text-indigo-400 font-semibold group-hover:text-indigo-300">
                        Начать
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
              </button>
            ))}
          </main>
        )}

        {view === 'BOOKING' && selectedType && (
          <BookingForm
            type={selectedType}
            onSubmit={handleBookingSubmit}
            onBack={() => setView('LANDING')}
          />
        )}

        {view === 'SUCCESS' && bookingData && (
            <div className="max-w-xl mx-auto text-center animate-slide-up bg-slate-900/80 p-12 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                    <CheckCircleIcon className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Заявка принята!</h2>
                <p className="text-slate-300 mb-8 text-lg">
                    Спасибо, <span className="text-white font-semibold">{bookingData.name}</span>. 
                    Мы подготовили данные о встрече на <span className="text-white font-semibold">{bookingData.date?.toLocaleDateString('ru-RU')}</span> в <span className="text-white font-semibold">{bookingData.timeSlot}</span>.
                </p>
                
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left mb-8">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Предлагаемая повестка (AI)</h3>
                    <div className="text-sm text-slate-300 space-y-2">
                         {bookingData.agenda?.split('\n').map((line, i)