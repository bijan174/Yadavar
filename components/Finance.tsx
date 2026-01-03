
import React, { useState, useMemo } from 'react';
import { FinanceAccount, Transaction, Loan, AccountType, TransactionType } from '../types';
import { Plus, TrendingUp, TrendingDown, RefreshCcw, Landmark, Coins, ReceiptText, CalendarClock, Trash2, ArrowUpRight, ArrowDownLeft, Wallet, Edit2, FilePieChart, Filter, X } from 'lucide-react';

const FinanceModal: React.FC<{ title: string; onClose: () => void; children?: React.ReactNode; fullScreen?: boolean }> = ({ title, onClose, children, fullScreen }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className={`bg-slate-900 border border-slate-800 w-full ${fullScreen ? 'h-[90vh]' : 'max-w-sm'} rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col`}>
      <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4">
        <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scroll">
        {children}
      </div>
      {!fullScreen && (
        <button onClick={onClose} className="w-full mt-6 text-[11px] font-bold text-slate-500 py-2 hover:text-slate-300 transition-colors">انصراف و بستن</button>
      )}
    </div>
  </div>
);

const AccountForm = ({ account, onSave }: { account?: FinanceAccount, onSave: (acc: FinanceAccount) => void }) => {
  const [name, setName] = useState(account?.name || '');
  const [type, setType] = useState<AccountType>(account?.type || 'Bank');
  const [balance, setBalance] = useState(account?.balance || 0);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">نام حساب یا بانک</label>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-blue-500 transition-colors" placeholder="مثلاً: بانک ملت یا کیف پول" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">نوع دارایی</label>
        <select value={type} onChange={e => setType(e.target.value as AccountType)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-blue-500 transition-colors">
          <option value="Bank">بانک</option>
          <option value="Gold">طلا / سکه / اپلیکیشن طلا</option>
          <option value="Fund">صندوق سرمایه‌گذاری (بورس)</option>
          <option value="Cash">نقد / کیف پول شخصی</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">موجودی فعلی (تومان)</label>
        <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-blue-500 transition-colors" placeholder="مبلغ را به تومان وارد کنید" />
      </div>
      <button onClick={() => onSave({id: account?.id || Math.random().toString(), name, type, balance})} className="w-full bg-blue-600 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all mt-2">ذخیره حساب</button>
    </div>
  );
};

const TransactionForm = ({ transaction, accounts, onSave }: { transaction?: Transaction, accounts: FinanceAccount[], onSave: (t: Transaction) => void }) => {
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [accId, setAccId] = useState(transaction?.accountId || accounts[0]?.id || '');
  const [toAccId, setToAccId] = useState(transaction?.toAccountId || '');
  const [type, setType] = useState<TransactionType>(transaction?.type || 'Expense');
  const [category, setCategory] = useState(transaction?.category || '');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">نوع تراکنش</label>
        <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-indigo-500 transition-colors">
          <option value="Expense">برداشت / هزینه</option>
          <option value="Income">واریز / درآمد</option>
          <option value="Transfer">انتقال بین حساب‌ها</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">{type === 'Transfer' ? 'حساب مبدأ' : 'انتخاب حساب'}</label>
        <select value={accId} onChange={e => setAccId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100">
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (موجودی: {new Intl.NumberFormat('fa-IR').format(a.balance)})</option>)}
        </select>
      </div>
      {type === 'Transfer' && (
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">حساب مقصد</label>
          <select value={toAccId} onChange={e => setToAccId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100">
            <option value="">انتخاب حساب مقصد...</option>
            {accounts.filter(a => a.id !== accId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">بابت / دسته‌بندی</label>
        <input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-indigo-500" placeholder="مثلاً: خرید طلا، اجاره، حقوق" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">مبلغ (تومان)</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-indigo-500" placeholder="مبلغ تراکنش" />
      </div>
      <button onClick={() => onSave({id: transaction?.id || Math.random().toString(), accountId: accId, toAccountId: toAccId, amount, type, category, date: transaction?.date || new Date().toLocaleDateString('fa-IR')})} className="w-full bg-indigo-600 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all mt-2">ثبت نهایی تراکنش</button>
    </div>
  );
};

const AdvancedReport = ({ transactions, accounts }: { transactions: Transaction[], accounts: FinanceAccount[] }) => {
  const [filterType, setFilterType] = useState<TransactionType | 'All'>('All');
  const [filterAcc, setFilterAcc] = useState<string>('All');
  const [filterCat, setFilterCat] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats);
  }, [transactions]);

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filterType === 'All' || t.type === filterType;
      const accMatch = filterAcc === 'All' || t.accountId === filterAcc || t.toAccountId === filterAcc;
      const catMatch = filterCat === 'All' || t.category === filterCat;
      return typeMatch && accMatch && catMatch;
    });
  }, [transactions, filterType, filterAcc, filterCat]);

  const totalFiltered = filteredData.reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div className="grid grid-cols-1 gap-3 p-1">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 mr-1"><Filter size={10}/> نوع تراکنش</label>
          <div className="flex gap-1 overflow-x-auto pb-1 custom-scroll">
            {['All', 'Income', 'Expense', 'Transfer'].map(t => (
              <button key={t} onClick={() => setFilterType(t as any)} className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[10px] font-bold transition-all border ${filterType === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                {t === 'All' ? 'همه' : t === 'Income' ? 'واریز' : t === 'Expense' ? 'برداشت' : 'انتقال'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-500 mr-1">حساب</label>
            <select value={filterAcc} onChange={e => setFilterAcc(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-[10px] text-slate-200 outline-none">
              <option value="All">همه حساب‌ها</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-500 mr-1">دسته‌بندی</label>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-[10px] text-slate-200 outline-none">
              <option value="All">همه دسته‌ها</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
        <div>
          <p className="text-[9px] font-bold text-slate-500 mb-1">جمع مبلغ فیلتر شده</p>
          <p className="text-sm font-black text-indigo-400">{formatCurrency(totalFiltered)}</p>
        </div>
        <div className="text-left">
          <p className="text-[9px] font-bold text-slate-500 mb-1">تعداد موارد</p>
          <p className="text-sm font-black text-slate-300">{filteredData.length}</p>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto custom-scroll pr-1">
        {filteredData.length === 0 ? (
          <p className="text-center py-10 text-slate-600 italic">موردی با این فیلترها یافت نشد.</p>
        ) : (
          filteredData.slice().reverse().map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : t.type === 'Transfer' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {t.type === 'Income' ? <ArrowDownLeft size={10} /> : t.type === 'Transfer' ? <RefreshCcw size={10}/> : <ArrowUpRight size={10} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-300 text-[10px]">{t.category}</h4>
                  <p className="text-[8px] text-slate-500">{t.date}</p>
                </div>
              </div>
              <p className={`font-black text-[10px] ${t.type === 'Income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                {t.type === 'Expense' ? '-' : t.type === 'Income' ? '+' : ''}{formatCurrency(t.amount)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const LoanForm = ({ loan, onSave }: { loan?: Loan, onSave: (l: Loan) => void }) => {
  const [name, setName] = useState(loan?.name || '');
  const [monthly, setMonthly] = useState(loan?.monthlyInstallment || 0);
  const [total, setTotal] = useState(loan?.totalInstallments || 12);
  const [paid, setPaid] = useState(loan?.paidInstallments || 0);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">نام وام یا تسهیلات</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-amber-500" placeholder="مثلاً: وام مسکن" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">مبلغ هر قسط (تومان)</label>
        <input type="number" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100 focus:border-amber-500" placeholder="مبلغ قسط ماهیانه" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">تعداد کل اقساط</label>
          <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 mr-1">اقساط پرداخت شده</label>
          <input type="number" value={paid} onChange={e => setPaid(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none text-xs text-slate-100" />
        </div>
      </div>
      <button onClick={() => onSave({id: loan?.id || Math.random().toString(), name, monthlyInstallment: monthly, totalInstallments: total, paidInstallments: paid, totalAmount: monthly * total})} className="w-full bg-amber-600 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-amber-600/20 active:scale-95 transition-all mt-2">ذخیره اطلاعات وام</button>
    </div>
  );
};

interface FinanceProps {
  accounts: FinanceAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<FinanceAccount[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

const Finance: React.FC<FinanceProps> = ({ accounts, setAccounts, transactions, setTransactions, loans, setLoans }) => {
  const [editingAccount, setEditingAccount] = useState<FinanceAccount | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [showAdvancedReport, setShowAdvancedReport] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const deleteAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('آیا از حذف این حساب اطمینان دارید؟ تمامی تراکنش‌های مربوطه نیز حذف خواهند شد.')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
      setTransactions(prev => prev.filter(t => t.accountId !== id && t.toAccountId !== id));
    }
  };

  const deleteTransaction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('آیا این تراکنش حذف شود؟')) {
      setTransactions(prev => prev.filter(trans => trans.id !== id));
    }
  };

  const deleteLoan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('آیا این وام حذف شود؟')) {
      setLoans(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleAccountSave = (acc: FinanceAccount) => {
    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
    } else {
      setAccounts(prev => [...prev, acc]);
    }
    setEditingAccount(null);
    setShowAddAccount(false);
  };

  const handleTransactionSave = (t: Transaction) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(item => item.id === t.id ? t : item));
    } else {
      setTransactions(prev => [...prev, t]);
      setAccounts(prev => prev.map(a => {
        if(a.id === t.accountId) {
          return {...a, balance: t.type === 'Income' ? a.balance + t.amount : a.balance - t.amount};
        }
        if(t.type === 'Transfer' && a.id === t.toAccountId) {
          return {...a, balance: a.balance + t.amount};
        }
        return a;
      }));
    }
    setEditingTransaction(null);
    setShowAddTransaction(false);
  };

  const handleLoanSave = (l: Loan) => {
    if (editingLoan) {
      setLoans(prev => prev.map(item => item.id === l.id ? l : item));
    } else {
      setLoans(prev => [...prev, l]);
    }
    setEditingLoan(null);
    setShowAddLoan(false);
  };

  return (
    <div className="space-y-6 text-[11px] leading-tight pb-10">
      <section className="grid grid-cols-2 gap-3">
        <div className="col-span-2 p-5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-lg shadow-indigo-600/20 relative overflow-hidden group">
          <button onClick={() => setShowAdvancedReport(true)} className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-1.5 border border-white/10">
            <FilePieChart size={14} className="text-white" />
            <span className="text-[10px] font-bold text-white">گزارش هوشمند</span>
          </button>
          <p className="text-[10px] text-indigo-100 font-bold opacity-80 mb-1">کل موجودی و دارایی</p>
          <p className="text-xl font-black text-white">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-1.5 text-emerald-500 mb-1 font-bold">
            <TrendingUp size={12} />
            <span>درآمد (ماه)</span>
          </div>
          <p className="font-bold text-slate-200">{formatCurrency(monthlyIncome)}</p>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-1.5 text-rose-500 mb-1 font-bold">
            <TrendingDown size={12} />
            <span>مخارج (ماه)</span>
          </div>
          <p className="font-bold text-slate-200">{formatCurrency(monthlyExpense)}</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold flex items-center gap-1.5 text-slate-300">
            <Landmark size={14} className="text-blue-400" />
            حساب‌ها و دارایی‌ها
          </h3>
          <button onClick={() => setShowAddAccount(true)} className="p-1.5 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 active:scale-90 transition-transform">
            <Plus size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scroll pr-1">
          {accounts.length === 0 ? (
            <div className="col-span-2 p-6 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl text-center text-slate-600">حسابی تعریف نشده است.</div>
          ) : (
            accounts.map(acc => (
              <div key={acc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl relative group overflow-hidden hover:border-blue-500/50 transition-colors">
                <div className="absolute top-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingAccount(acc)} className="p-2 text-blue-400 bg-blue-400/10 rounded-xl hover:bg-blue-400/20"><Edit2 size={12} /></button>
                  <button onClick={(e) => deleteAccount(acc.id, e)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20"><Trash2 size={12} /></button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                   <div className={`p-1.5 rounded-lg ${acc.type === 'Gold' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>{acc.type === 'Gold' ? <Coins size={12}/> : <Wallet size={12}/>}</div>
                   <span className="font-bold text-slate-300 truncate text-[10px]">{acc.name}</span>
                </div>
                <p className="text-slate-100 font-black">{formatCurrency(acc.balance)}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold flex items-center gap-1.5 text-slate-300">
            <ReceiptText size={14} className="text-indigo-400" />
            تراکنش‌های اخیر
          </h3>
          <button onClick={() => setShowAddTransaction(true)} className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-600/20 active:scale-90 transition-transform">
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scroll pr-1">
          {transactions.length === 0 ? (
            <p className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl text-center text-slate-600 italic">لیست تراکنش‌ها خالی است.</p>
          ) : (
            transactions.slice().reverse().map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : t.type === 'Transfer' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {t.type === 'Income' ? <ArrowDownLeft size={12} /> : t.type === 'Transfer' ? <RefreshCcw size={12}/> : <ArrowUpRight size={12} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{t.category}</h4>
                    <p className="text-[9px] text-slate-500 mt-1">{t.date}</p>
                  </div>
                </div>
                <div className="text-left flex items-center gap-3">
                   <p className={`font-black ${t.type === 'Income' ? 'text-emerald-400' : 'text-slate-300'}`}>{t.type === 'Expense' ? '-' : t.type === 'Income' ? '+' : ''}{formatCurrency(t.amount)}</p>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setEditingTransaction(t)} className="p-2 text-blue-400 bg-blue-400/10 rounded-xl"><Edit2 size={12}/></button>
                     <button onClick={(e) => deleteTransaction(t.id, e)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl"><Trash2 size={12}/></button>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold flex items-center gap-1.5 text-slate-300">
            <CalendarClock size={14} className="text-amber-400" />
            وام‌ها و اقساط
          </h3>
          <button onClick={() => setShowAddLoan(true)} className="p-1.5 bg-amber-600 text-white rounded-lg shadow-lg shadow-amber-600/20 active:scale-90 transition-transform">
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {loans.length === 0 ? (
            <p className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl text-center text-slate-600">قسط فعالی ثبت نشده است.</p>
          ) : (
            loans.map(loan => {
               const progress = (loan.paidInstallments / loan.totalInstallments) * 100;
               return (
                <div key={loan.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl group relative overflow-hidden hover:border-amber-500/30 transition-colors">
                  <div className="absolute top-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingLoan(loan)} className="p-2 text-blue-400 bg-blue-400/10 rounded-xl hover:bg-blue-400/20"><Edit2 size={12} /></button>
                    <button onClick={(e) => deleteLoan(loan.id, e)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20"><Trash2 size={12} /></button>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-200">{loan.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">مبلغ قسط: {formatCurrency(loan.monthlyInstallment)}</p>
                    </div>
                    <span className="bg-amber-950/30 text-amber-400 px-2 py-0.5 rounded-lg font-bold border border-amber-900/20 text-[10px]">{loan.paidInstallments} از {loan.totalInstallments}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-amber-500 h-full transition-all duration-700 ease-out shadow-lg" style={{width: `${progress}%`}}></div>
                  </div>
                </div>
               );
            })
          )}
        </div>
      </section>

      {(showAddAccount || editingAccount) && (
        <FinanceModal title={editingAccount ? "ویرایش حساب" : "افزودن حساب جدید"} onClose={() => { setShowAddAccount(false); setEditingAccount(null); }}>
          <AccountForm account={editingAccount || undefined} onSave={handleAccountSave} />
        </FinanceModal>
      )}

      {(showAddTransaction || editingTransaction) && (
        <FinanceModal title={editingTransaction ? "ویرایش تراکنش" : "ثبت تراکنش جدید"} onClose={() => { setShowAddTransaction(false); setEditingTransaction(null); }}>
          <TransactionForm transaction={editingTransaction || undefined} accounts={accounts} onSave={handleTransactionSave} />
        </FinanceModal>
      )}

      {(showAddLoan || editingLoan) && (
        <FinanceModal title={editingLoan ? "ویرایش اطلاعات وام" : "ثبت وام جدید"} onClose={() => { setShowAddLoan(false); setEditingLoan(null); }}>
           <LoanForm loan={editingLoan || undefined} onSave={handleLoanSave} />
        </FinanceModal>
      )}

      {showAdvancedReport && (
        <FinanceModal title="گزارش هوشمند و تحلیل تراکنش‌ها" onClose={() => setShowAdvancedReport(false)} fullScreen>
          <AdvancedReport transactions={transactions} accounts={accounts} />
        </FinanceModal>
      )}
    </div>
  );
};

export default Finance;
