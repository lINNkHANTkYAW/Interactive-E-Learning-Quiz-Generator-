import React from 'react';
import { Type, Moon, Volume2 } from './ui/Icons';

interface Props {
  dyslexicMode: boolean;
  toggleDyslexicMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

export const AccessibilityControls: React.FC<Props> = ({
  dyslexicMode,
  toggleDyslexicMode,
  highContrast,
  toggleHighContrast,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <button
        onClick={toggleDyslexicMode}
        className={`p-3 rounded-full shadow-lg transition-all ${
          dyslexicMode ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        title="Toggle Dyslexia Friendly Font"
      >
        <Type size={20} />
      </button>
      <button
        onClick={toggleHighContrast}
        className={`p-3 rounded-full shadow-lg transition-all ${
          highContrast ? 'bg-yellow-400 text-black' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        title="Toggle High Contrast"
      >
        <Moon size={20} />
      </button>
    </div>
  );
};