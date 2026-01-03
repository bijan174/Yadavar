
import { format, isSameDay, parseISO, startOfWeek, addDays, isWithinInterval, endOfWeek, differenceInSeconds } from 'date-fns';

export const getTodayISO = () => new Date().toISOString().split('T')[0];

export const isToday = (dateStr: string) => {
  return isSameDay(parseISO(dateStr), new Date());
};

export const getRemainingTime = (targetDate: string) => {
  const diff = differenceInSeconds(parseISO(targetDate), new Date());
  if (diff <= 0) return 'زمان شروع فرا رسیده';
  
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getCompletionsThisWeek = (completions: string[]) => {
  // Simple week calculation (last 7 days for MVP, or aligned with Sat-Fri)
  const now = new Date();
  const day = now.getDay();
  // Saturday is start of week in Iran
  const diff = (day + 1) % 7; 
  const startOfPersianWeek = new Date(now);
  startOfPersianWeek.setDate(now.getDate() - diff);
  startOfPersianWeek.setHours(0,0,0,0);

  const endOfPersianWeek = new Date(startOfPersianWeek);
  endOfPersianWeek.setDate(startOfPersianWeek.getDate() + 6);
  endOfPersianWeek.setHours(23,59,59,999);

  return completions.filter(c => {
    const d = parseISO(c);
    return d >= startOfPersianWeek && d <= endOfPersianWeek;
  }).length;
};

export const isEndOfWeek = () => {
  const day = new Date().getDay();
  return day === 5; // 5 is Friday in JS getDay()
};
