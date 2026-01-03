
import React, { useState, useEffect } from 'react';
import { Habit, FixedEvent, HabitCategory, EventType } from '../types';
import { isToday, getRemainingTime, getCompletionsThisWeek, getTodayISO } from '../utils/dateHelpers';
import { EVENT_TYPE_LABELS, CATEGORY_LABELS } from '../constants';
import { Clock, ExternalLink, AlertCircle, CheckCircle2, Circle, Plus, Trash2, X, Link as LinkIcon, Calendar } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  events: FixedEvent[];
  setEvents: React.Dispatch<React.SetStateAction<FixedEvent[]>>;
  onToggleHabit: (id: string) => void;
  onToggleEvent: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, setHabits, events, setEvents, onToggleHabit, onToggleEvent }) => {
  const [timer, setTimer] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'habit' | 'event'>('habit');

  const [hName, setHName] = useState('');
  const [hGoal, setHGoal] = useState(3);
  const [hDuration, setHDuration] = useState(30);
  const [hCategory, setHCategory] = useState<HabitCategory>('Learning');

  const [eName, setEName] = useState('');
  const [eType, setEType] = useState<EventType>('Class');
  const [eDate, setEDate] = useState('');
  const [eTime, setETime] = useState('');
  const [eUrl, setEUrl] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = getTodayISO();
  const todayEvents = events.filter(e => isToday(e.dateTime.split('T')[0])).sort((a,b) => a.dateTime.localeCompare(b.dateTime));
  
  const redAlertHabits = habits.filter(h => {
    const done = getCompletionsThisWeek(h.completions);
    const dayOfWeek = new Date().getDay();
    const isLateWeek = dayOfWeek === 4 || dayOfWeek === 5;
    return isLateWeek && done < h.weeklyGoal;
  });

  const completedHabitsToday = habits.filter(h => h.completions.includes(todayStr));
  const completedEvents = events.filter(e => e.isDone);
  const totalCompletedCount = completedHabitsToday.length + completedEvents.length;
  const hideCompleted = totalCompletedCount > 5;

  const displayHabits = hideCompleted ? habits.filter(h => !h.completions.includes(todayStr)) : habits;
  const displayEvents = hideCompleted ? events.filter(e => !e.isDone) : events;

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: hName,
      weeklyGoal: hGoal,
      estimatedDuration: hDuration,
      category: hCategory,
      completions: []
    };
    setHabits(prev => [...prev, newHabit]);
    setShowAddModal(false);
    resetForms();
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: FixedEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name: eName,
      type: eType,
      dateTime: `${eDate}T${eTime}:00`,
      url: eUrl || undefined,
      isDone: false
    };
    setEvents(prev => [...prev, newEvent]);
    setShowAddModal(false);
    resetForms();
  };

  const resetForms = () => {
    setHName(''); setHGoal(3); setHDuration(30);
    setEName(''); setEUrl(''); setEDate(''); setETime('');
  };

  const deleteHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('آیا از حذف این عادت اطمینان دارید؟')) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const deleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('آیا از حذف این رویداد اطمینان دارید؟')) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            رویدادهای امروز
          </h2>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
            {todayEvents.length}
          </span>
        </div>
        
        <div className={`space-y-3 ${todayEvents.length > 2 ? 'max-h-[300px] overflow-y-auto pr-2 custom-scroll' : ''}`}>
          {todayEvents.length === 0 ? (
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-center">
              <p className="text-sm text-slate-500">امروز رویدادی نداری. وقتت آزاده!</p>
            </div>
          ) : (
            todayEvents.map(event => (
              <div key={event.id} className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl transition-all relative group">
                <button onClick={(e) => deleteEvent(event.id, e)} className="absolute top-2 left-2 p-2.5 text-rose-500 bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Trash2 size={16} />
                </button>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-500/10">
                      {EVENT_TYPE_LABELS[event.type]}
                    </span>
                    <h3 className="font-bold mt-2 text-slate-100">{event.name}</h3>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                      {event.dateTime.split('T')[1].substring(0, 5)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-orange-400">
                    <Clock size={14} />
                    <span className="text-xs font-mono font-bold">{getRemainingTime(event.dateTime)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {event.url && (
                      <a href={event.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                        <ExternalLink size={14} />
                        ورود
                      </a>
                    )}
                    <button onClick={() => onToggleEvent(event.id)} className={`p-1.5 rounded-xl border transition-colors ${event.isDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {redAlertHabits.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle size={20} fill="currentColor" className="text-slate-950" />
              <h2 className="text-lg font-bold">هشدار</h2>
            </div>
            <span className="text-[10px] font-bold text-amber-500/50 bg-amber-950/20 border border-amber-900/20 px-2 py-0.5 rounded-lg">
              {redAlertHabits.length}
            </span>
          </div>
          <div className={`space-y-2 ${redAlertHabits.length > 2 ? 'max-h-[220px] overflow-y-auto pr-2 custom-scroll' : ''}`}>
            {redAlertHabits.map(h => (
              <div key={h.id} className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-3xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-amber-400">{h.name}</h4>
                  <p className="text-[10px] text-amber-500/80 mt-1">
                    عقب ماندی! ({getCompletionsThisWeek(h.completions)} از {h.weeklyGoal})
                  </p>
                </div>
                <button onClick={() => onToggleHabit(h.id)} className="bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-xl shadow-amber-500/30 active:scale-90">
                  <CheckCircle2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            موارد ثبت شده
          </h2>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
            {displayHabits.length + displayEvents.length}
          </span>
        </div>
        
        <div className={`space-y-3 ${ (displayHabits.length + displayEvents.length) > 2 ? 'max-h-[240px] overflow-y-auto pr-2 custom-scroll' : ''}`}>
          {(displayHabits.length === 0 && displayEvents.length === 0) ? (
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-center">
              <p className="text-sm text-slate-500">
                {hideCompleted ? "موارد تکمیل شده به بخش گزارش منتقل شدند." : "هیچ موردی ثبت نشده است."}
              </p>
            </div>
          ) : (
            <>
              {displayHabits.map(h => {
                const isCompletedToday = h.completions.includes(todayStr);
                return (
                  <div key={h.id} onClick={() => onToggleHabit(h.id)} className={`p-4 rounded-3xl flex items-center justify-between border transition-all cursor-pointer group relative ${isCompletedToday ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-slate-900 border-slate-800 shadow-md'}`}>
                    <button onClick={(e) => deleteHabit(h.id, e)} className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 p-2 text-rose-500 bg-rose-500/10 rounded-xl transition-all z-10">
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className={`${isCompletedToday ? 'text-emerald-500' : 'text-slate-700'}`}>
                        {isCompletedToday ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                      </div>
                      <div>
                        <h4 className={`font-bold transition-all ${isCompletedToday ? 'text-emerald-400 line-through opacity-50' : 'text-slate-200'}`}>{h.name}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{CATEGORY_LABELS[h.category]}</span>
                          <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold"><Clock size={10} /> {h.estimatedDuration} دقیقه</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-2xl text-center">
                      <div className="text-[12px] font-black text-slate-200">{getCompletionsThisWeek(h.completions)}</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase">از {h.weeklyGoal}</div>
                    </div>
                  </div>
                );
              })}
              {displayEvents.map(ev => (
                <div key={ev.id} className={`p-4 rounded-3xl border transition-all relative group ${ev.isDone ? 'bg-indigo-950/10 border-indigo-900/30' : 'bg-slate-900 border-slate-800 shadow-md'}`}>
                  <button onClick={(e) => deleteEvent(ev.id, e)} className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 p-2 text-rose-500 bg-rose-500/10 rounded-xl transition-all z-10">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-1 rounded-xl ${ev.isDone ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className={`font-bold ${ev.isDone ? 'text-indigo-400 line-through opacity-50' : 'text-slate-200'}`}>{ev.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[9px] font-bold text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded-full border border-indigo-500/10">
                            {EVENT_TYPE_LABELS[ev.type]}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500">{ev.dateTime.split('T')[0].replace(/-/g, '/')}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => onToggleEvent(ev.id)} className={`p-2 rounded-xl border transition-colors ${ev.isDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      <button onClick={() => setShowAddModal(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 active:scale-90 transition-transform z-20">
        <Plus size={32} />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-800">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 left-6 p-2 text-slate-500 hover:text-slate-300">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-center">ایجاد مورد جدید</h3>
            <div className="flex bg-slate-800 p-1.5 rounded-2xl mb-6">
              <button onClick={() => setActiveTab('habit')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'habit' ? 'bg-slate-700 text-blue-400 shadow-lg' : 'text-slate-500'}`}>عادت شناور</button>
              <button onClick={() => setActiveTab('event')} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'event' ? 'bg-slate-700 text-blue-400 shadow-lg' : 'text-slate-500'}`}>رویداد ثابت</button>
            </div>

            {activeTab === 'habit' ? (
              <form onSubmit={handleAddHabit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">نام فعالیت</label>
                  <input required value={hName} onChange={e => setHName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-slate-200 text-sm" placeholder="مثلاً: مطالعه کتاب" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">دفعات در هفته</label>
                    <input required type="number" min="1" max="7" value={hGoal} onChange={e => setHGoal(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">مدت (دقیقه)</label>
                    <input required type="number" step="5" value={hDuration} onChange={e => setHDuration(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-slate-200 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">دسته‌بندی</label>
                  <select value={hCategory} onChange={e => setHCategory(e.target.value as HabitCategory)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-slate-200 text-sm">
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-xl shadow-blue-600/30 active:scale-95 transition-transform">ذخیره عادت</button>
              </form>
            ) : (
              <form onSubmit={handleAddEvent} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">نام رویداد</label>
                  <input required value={eName} onChange={e => setEName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-slate-200 text-sm" placeholder="مثلاً: وبینار تخصصی" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">نوع رویداد</label>
                  <select value={eType} onChange={e => setEType(e.target.value as EventType)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-slate-200 text-sm">
                    {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">تاریخ</label>
                    <input required type="date" value={eDate} onChange={e => setEDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1">زمان</label>
                    <input required type="time" value={eTime} onChange={e => setETime(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none text-slate-200 text-sm" />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 mr-1 flex items-center gap-1"><LinkIcon size={12}/> لینک ورود (اختیاری)</label>
                  <input type="url" value={eUrl} onChange={e => setEUrl(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-slate-200 text-sm" placeholder="https://..." />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-xl shadow-indigo-600/30 active:scale-95 transition-transform">ثبت رویداد</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
