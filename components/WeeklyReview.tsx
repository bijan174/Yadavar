
import React from 'react';
import { Habit, FixedEvent } from '../types';
import { getCompletionsThisWeek, isEndOfWeek, getTodayISO } from '../utils/dateHelpers';
import { WEEK_DAYS, EVENT_TYPE_LABELS } from '../constants';
import { parseISO, subDays } from 'date-fns';
import { CheckCircle2, XCircle, ChevronLeft, Calendar } from 'lucide-react';

interface WeeklyReviewProps {
  habits: Habit[];
  events: FixedEvent[];
  onToggleHabit: (id: string) => void;
  onToggleEvent: (id: string) => void;
}

const WeeklyReview: React.FC<WeeklyReviewProps> = ({ habits, events, onToggleHabit, onToggleEvent }) => {
  const isFriday = isEndOfWeek();
  const todayStr = getTodayISO();

  // Saturday-Friday mapping in Farsi
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sun
  const diffToSat = (currentDay + 1) % 7;
  const startOfPersianWeek = subDays(today, diffToSat);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfPersianWeek);
    d.setDate(startOfPersianWeek.getDate() + i);
    return d;
  });

  const incompleteHabits = habits.filter(h => getCompletionsThisWeek(h.completions) < h.weeklyGoal);
  const missedEvents = events.filter(e => {
    const d = parseISO(e.dateTime);
    return d < today && !e.isDone;
  });

  const completedHabitsToday = habits.filter(h => h.completions.includes(todayStr));
  const completedEvents = events.filter(e => e.isDone);
  const totalCompletedCount = completedHabitsToday.length + completedEvents.length;
  const showCompletedSection = totalCompletedCount > 5;

  return (
    <div className="space-y-6">
      {/* Matrix View */}
      <section>
        <h2 className="text-lg font-bold mb-4">نمای هفته (ماتریکس)</h2>
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="sticky right-0 bg-white dark:bg-slate-950 px-2 py-3 text-[10px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 text-right min-w-[80px]">فعالیت</th>
                {WEEK_DAYS.map((day, i) => (
                  <th key={day} className="px-2 py-3 text-[10px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    {day[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map(h => (
                <tr key={h.id}>
                  <td className="sticky right-0 bg-white dark:bg-slate-950 text-right py-3 text-xs font-bold border-b border-slate-50 dark:border-slate-900 truncate max-w-[100px]">{h.name}</td>
                  {daysOfWeek.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isDone = h.completions.includes(dateStr);
                    return (
                      <td key={i} className="py-3 border-b border-slate-50 dark:border-slate-900">
                        <div className={`mx-auto w-5 h-5 rounded-md flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700'}`}>
                          {isDone && <CheckCircle2 size={12} strokeWidth={3} />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Completed Items Section (Transferred from Dashboard) */}
      {showCompletedSection && (
        <section className="animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
              موارد تکمیل شده (امروز)
            </h2>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              {totalCompletedCount}
            </span>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
            {completedHabitsToday.map(h => (
              <div key={h.id} onClick={() => onToggleHabit(h.id)} className="p-4 rounded-3xl flex items-center justify-between border bg-emerald-950/10 border-emerald-900/30 cursor-pointer shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="text-emerald-500">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 line-through opacity-50">{h.name}</h4>
                    <p className="text-[9px] text-slate-500">تکمیل شده در امروز</p>
                  </div>
                </div>
              </div>
            ))}
            {completedEvents.map(ev => (
              <div key={ev.id} className="p-4 rounded-3xl border bg-indigo-950/10 border-indigo-900/30 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-1 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-400 line-through opacity-50">{ev.name}</h4>
                      <p className="text-[9px] text-slate-500">{EVENT_TYPE_LABELS[ev.type]}</p>
                    </div>
                  </div>
                  <button onClick={() => onToggleEvent(ev.id)} className="p-2 rounded-xl border bg-emerald-500/20 border-emerald-500/40 text-emerald-500">
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Friday Review Summary */}
      {isFriday && (
        <section className="bg-orange-50 dark:bg-orange-950/20 p-5 rounded-3xl border border-orange-100 dark:border-orange-900/40">
          <div className="flex items-center gap-2 mb-4 text-orange-700 dark:text-orange-400">
             <ChevronLeft size={20} />
             <h3 className="font-bold">بررسی پایان هفته (جمعه)</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-orange-600 mb-2">عادت‌های ناقص:</p>
              {incompleteHabits.length === 0 ? (
                <p className="text-xs text-emerald-600">عالی بود! همه عادت‌ها رو انجام دادی.</p>
              ) : (
                <ul className="space-y-2">
                  {incompleteHabits.map(h => (
                    <li key={h.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <XCircle size={14} className="text-red-400" />
                      {h.name} ({h.weeklyGoal - getCompletionsThisWeek(h.completions)} بار انجام نشده)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {missedEvents.length > 0 && (
              <div>
                <p className="text-xs font-bold text-orange-600 mb-2">رویدادهای فراموش شده:</p>
                <ul className="space-y-2">
                  {missedEvents.map(e => (
                    <li key={e.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <XCircle size={14} className="text-red-400" />
                      {e.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
          <p className="text-[10px] text-blue-500 font-bold mb-1">عادت‌های فعال</p>
          <p className="text-2xl font-bold">{habits.length}</p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
          <p className="text-[10px] text-emerald-500 font-bold mb-1">انجام شده کل</p>
          <p className="text-2xl font-bold">
            {habits.reduce((acc, h) => acc + h.completions.length, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReview;
