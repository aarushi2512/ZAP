// src/components/focus/FocusMode.tsx
import React, { useEffect } from 'react';
import { useFocusSession } from '../../hooks/useFocusSession';

export default function FocusMode({ onXPEarned }: { onXPEarned: () => void }) {
  const { timer, isActive, start, pause, reset } = useFocusSession(onXPEarned);

  useEffect(() => {
    if (isActive) document.body.classList.add('zap-focus-mode');
    return () => document.body.classList.remove('zap-focus-mode');
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#faf9f6]">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-gray-800 mb-2">⚡ Focus Mode</h1>
        <p className="text-gray-400 mb-12">Stay present. Stay productive.</p>
        
        <div className="font-mono text-8xl text-teal-600 mb-12 tracking-wider">
          {timer}
        </div>
        
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <button 
              onClick={start} 
              className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm"
            >
              Start Session
            </button>
          ) : (
            <button 
              onClick={pause} 
              className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white rounded-xl text-lg font-medium transition-colors duration-200"
            >
              Pause
            </button>
          )}
          <button 
            onClick={reset} 
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-lg font-medium transition-colors duration-200"
          >
            Reset
          </button>
        </div>
        
        <p className="mt-8 text-gray-400 text-sm">
          Complete the session to earn <span className="text-teal-600 font-medium">XP</span> ⭐
        </p>
      </div>
    </div>
  );
}