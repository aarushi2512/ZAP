import { useState, useEffect, useRef } from 'react';

const POMODORO_DURATION = 25 * 60; // 25 minutes

export function useFocusSession(onComplete: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_DURATION);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            onComplete(); // logs XP
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isActive]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => { setIsActive(false); setSecondsLeft(POMODORO_DURATION); };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return { timer: `${minutes}:${seconds}`, isActive, start, pause, reset };
}