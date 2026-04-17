import { useEffect, useMemo, useState } from 'react';

function getRemainingMs(targetDate) {
  if (!targetDate) return 0;
  const target = new Date(targetDate).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.max(0, target - Date.now());
}

function formatTimeLeft(remainingMs) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

export function useCountdown(targetDate) {
  const initialRemaining = useMemo(() => getRemainingMs(targetDate), [targetDate]);
  const [remainingMs, setRemainingMs] = useState(initialRemaining);

  useEffect(() => {
    setRemainingMs(getRemainingMs(targetDate));
    if (!targetDate) return undefined;

    const timer = window.setInterval(() => {
      setRemainingMs(getRemainingMs(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const isExpired = remainingMs <= 0;
  const timeLeft = isExpired ? '0m 00s' : formatTimeLeft(remainingMs);

  return { timeLeft, isExpired, remainingMs };
}

export function formatCountdown(remainingMs) {
  return formatTimeLeft(remainingMs);
}