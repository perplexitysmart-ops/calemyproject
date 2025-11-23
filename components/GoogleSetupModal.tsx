import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

interface GoogleSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleSetupModal: React.FC<GoogleSetupModalProps> = ({ isOpen, onClose }) => {
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        <h3 className="text-xl font-bold text-white mb-4">Настройка Google Календаря</h3>
        
        <p className="text-slate-300 text-sm mb-4">
          Чтобы Google разрешил этому сайту создавать события, вам нужно добавить 
          <span className="text-indigo-400 font-semibold"> текущий адрес </span> 
          в белый список.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Скопируйте этот адрес:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono truncate select-all">
                {origin}
              </div>
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  copied 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {copied ? <CheckCircleIcon className="w-4 h-4" /> : 'Копировать'}
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-400 border border-slate-800">
            <p className="mb-2 font-semibold text-slate-300">Куда вставить:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Откройте Google Cloud Console.</li>
              <li>Найдите раздел <strong>Authorized JavaScript origins</strong>.</li>
              <li>Вставьте скопированный адрес в поле URI.</li>
              <li>Нажмите <strong>Save</strong>.</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-medium transition-colors"
        >
          Готово, я добавил
        </button>
      </div>
    </div>
  );
};

export default GoogleSetupModal;