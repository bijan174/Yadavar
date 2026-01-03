
import React, { useState, useEffect } from 'react';
import { Habit, FixedEvent, View, Folder, Note, FinanceAccount, Transaction, Loan } from './types';
import Dashboard from './components/Dashboard';
import WeeklyReview from './components/WeeklyReview';
import Notes from './components/Notes';
import Finance from './components/Finance';
import Settings from './components/Settings';
import { LayoutDashboard, BarChart3, NotebookPen, Wallet, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View | 'settings'>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<FixedEvent[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const saved = {
      habits: localStorage.getItem('habits'),
      events: localStorage.getItem('events'),
      folders: localStorage.getItem('folders'),
      notes: localStorage.getItem('notes'),
      accounts: localStorage.getItem('accounts'),
      transactions: localStorage.getItem('transactions'),
      loans: localStorage.getItem('loans'),
    };

    if (saved.habits) setHabits(JSON.parse(saved.habits));
    if (saved.events) setEvents(JSON.parse(saved.events));
    if (saved.folders) setFolders(JSON.parse(saved.folders));
    if (saved.notes) setNotes(JSON.parse(saved.notes));
    if (saved.accounts) setAccounts(JSON.parse(saved.accounts));
    if (saved.transactions) setTransactions(JSON.parse(saved.transactions));
    if (saved.loans) setLoans(JSON.parse(saved.loans));
  }, []);

  useEffect(() => localStorage.setItem('habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('folders', JSON.stringify(folders)), [folders]);
  useEffect(() => localStorage.setItem('notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('accounts', JSON.stringify(accounts)), [accounts]);
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('loans', JSON.stringify(loans)), [loans]);

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const alreadyDone = h.completions.includes(today);
        return {
          ...h,
          completions: alreadyDone ? h.completions.filter(c => c !== today) : [...h.completions, today]
        };
      }
      return h;
    }));
  };

  const toggleEvent = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isDone: !e.isDone } : e));
  };

  const handleRestore = (allData: any) => {
    if (allData.habits) setHabits(allData.habits);
    if (allData.events) setEvents(allData.events);
    if (allData.folders) setFolders(allData.folders);
    if (allData.notes) setNotes(allData.notes);
    if (allData.accounts) setAccounts(allData.accounts);
    if (allData.transactions) setTransactions(allData.transactions);
    if (allData.loans) setLoans(allData.loans);
    alert('اطلاعات با موفقیت بازگردانی شد.');
    setView('dashboard');
  };

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden bg-slate-950 text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="w-8"></div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          یادآور من
        </h1>
        <button 
          onClick={() => setView(view === 'settings' ? 'dashboard' : 'settings')}
          className={`p-2 rounded-xl transition-all ${view === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <SettingsIcon size={20} />
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 animate-in fade-in duration-500">
        {view === 'dashboard' && (
          <Dashboard habits={habits} setHabits={setHabits} events={events} setEvents={setEvents} onToggleHabit={toggleHabit} onToggleEvent={toggleEvent} />
        )}
        {view === 'review' && (
          <WeeklyReview habits={habits} events={events} onToggleHabit={toggleHabit} onToggleEvent={toggleEvent} />
        )}
        {view === 'notes' && (
          <Notes folders={folders} setFolders={setFolders} notes={notes} setNotes={setNotes} />
        )}
        {view === 'finance' && (
          <Finance accounts={accounts} setAccounts={setAccounts} transactions={transactions} setTransactions={setTransactions} loans={loans} setLoans={setLoans} />
        )}
        {view === 'settings' && (
          <Settings 
            allData={{ habits, events, folders, notes, accounts, transactions, loans }}
            onRestore={handleRestore}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-4 py-3 flex justify-around items-center shadow-2xl">
        <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={20} />} label="داشبورد" />
        <NavButton active={view === 'finance'} onClick={() => setView('finance')} icon={<Wallet size={20} />} label="مالی" />
        <NavButton active={view === 'notes'} onClick={() => setView('notes')} icon={<NotebookPen size={20} />} label="یادداشت" />
        <NavButton active={view === 'review'} onClick={() => setView('review')} icon={<BarChart3 size={20} />} label="گزارش" />
      </nav>
    </div>
  );
};

interface NavButtonProps { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }
const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default App;
