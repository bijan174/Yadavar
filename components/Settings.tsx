
import React from 'react';
import { Download, Upload, ShieldCheck, Database, FileText, Wallet, Notebook, BarChart2 } from 'lucide-react';
import { CATEGORY_LABELS, EVENT_TYPE_LABELS } from '../constants';
import { getCompletionsThisWeek } from '../utils/dateHelpers';

interface SettingsProps {
  allData: any;
  onRestore: (data: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ allData, onRestore }) => {
  
  const exportJSON = (data: any, fileName: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (window.confirm('آیا مطمئن هستید؟ داده‌های جدید با داده‌های فعلی در بخش مربوطه جایگزین خواهند شد.')) {
          onRestore(json);
        }
      } catch (err) {
        alert('خطا در خواندن فایل. لطفاً از صحت فایل بکاپ مطمئن شوید.');
      }
    };
    reader.readAsText(file);
  };

  const exportHabitsText = () => {
    let text = `گزارش برنامه‌ریزی - تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n`;
    text += `==========================================\n\n`;
    text += `🔹 عادت‌های هفتگی:\n`;
    allData.habits.forEach((h: any) => {
      text += `- ${h.name} (${CATEGORY_LABELS[h.category]}): ${getCompletionsThisWeek(h.completions)} از ${h.weeklyGoal} مرتبه\n`;
    });
    text += `\n🔹 رویدادهای ثابت:\n`;
    allData.events.forEach((e: any) => {
      text += `- [${e.isDone ? '✔' : ' '}] ${e.name} (${EVENT_TYPE_LABELS[e.type]}) - ${e.dateTime.replace('T', ' ')}\n`;
    });
    downloadText(text, 'habits_report');
  };

  const exportNotesText = () => {
    let text = `تمام یادداشت‌های من - تاریخ استخراج: ${new Date().toLocaleDateString('fa-IR')}\n`;
    text += `==========================================\n\n`;
    allData.folders.forEach((folder: any) => {
      const fNotes = allData.notes.filter((n: any) => n.folderId === folder.id);
      text += `📂 پوشه: ${folder.name}\n`;
      fNotes.forEach((n: any, idx: number) => {
        text += `--- یادداشت ${idx + 1} (${new Date(n.updatedAt).toLocaleDateString('fa-IR')}) ---\n`;
        text += `${n.content}\n\n`;
      });
      text += `\n`;
    });
    downloadText(text, 'notes_archive');
  };

  const exportFinanceText = () => {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
    const totalBalance = allData.accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
    
    let text = `گزارش مالی من - تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n`;
    text += `==========================================\n\n`;
    text += `💰 موجودی کل: ${formatCurrency(totalBalance)}\n\n`;
    text += `🏦 حساب‌ها:\n`;
    allData.accounts.forEach((a: any) => text += `- ${a.name}: ${formatCurrency(a.balance)}\n`);
    text += `\n🧾 آخرین تراکنش‌ها:\n`;
    allData.transactions.slice(-20).reverse().forEach((t: any) => {
      text += `- [${t.date}] ${t.category}: ${t.type === 'Income' ? '+' : '-'}${formatCurrency(t.amount)}\n`;
    });
    downloadText(text, 'finance_report');
  };

  const downloadText = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* بکاپ کلی */}
      <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">پشتیبان‌گیری کل سیستم</h2>
            <p className="text-[10px] text-slate-500">تمامی داده‌ها در یک فایل واحد</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => exportJSON(allData, 'backup_full')} className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all group">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-emerald-500" />
              <span className="text-sm font-bold">دانلود فایل بکاپ کامل (JSON)</span>
            </div>
            <Download size={16} className="text-slate-600" />
          </button>
          <div className="relative">
            <input type="file" accept=".json" onChange={handleImportJSON} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all group">
              <div className="flex items-center gap-3">
                <Upload size={20} className="text-blue-500" />
                <span className="text-sm font-bold">بازگردانی اطلاعات (از فایل JSON)</span>
              </div>
              <ShieldCheck size={16} className="text-slate-600" />
            </div>
          </div>
        </div>
      </section>

      {/* بخش‌های تفکیکی */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mr-4">پشتیبان‌گیری موضوعی</h3>
        
        {/* عادت‌ها و زمان‌بندی */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <BarChart2 size={18} />
            <h4 className="text-sm font-bold">عادت‌ها و زمان‌بندی</h4>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportJSON({habits: allData.habits, events: allData.events}, 'backup_habits')} className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
              <Database size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold">بکاپ JSON</span>
            </button>
            <button onClick={exportHabitsText} className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
              <FileText size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold">گزارش متنی</span>
            </button>
          </div>
        </div>

        {/* یادداشت‌ها */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Notebook size={18} />
            <h4 className="text-sm font-bold">دفترچه یادداشت</h4>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportJSON({folders: allData.folders, notes: allData.notes}, 'backup_notes')} className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
              <Database size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold">بکاپ JSON</span>
            </button>
            <button onClick={exportNotesText} className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
              <FileText size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold">آرشیو متنی</span>
            </button>
          </div>
        </div>

        {/* مالی */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Wallet size={18} />
            <h4 className="text-sm font-bold">مدیریت مالی</h4>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportJSON({accounts: allData.accounts, transactions: allData.transactions, loans: allData.loans}, 'backup_finance')} className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
              <Database size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold">بکاپ JSON</span>
            </button>
            <button onClick={exportFinanceText} className="flex-1 flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-xl hover:bg-slate-750 transition-colors">
              <FileText size={16} className="text-slate-400" />
              <span className="text-[10px] font-bold">گزارش مالی</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Safe & Private Data Management</p>
      </div>
    </div>
  );
};

export default Settings;
