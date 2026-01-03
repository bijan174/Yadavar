
import React, { useState } from 'react';
import { Folder, Note } from '../types';
import { Plus, FolderPlus, Folder as FolderIcon, ChevronLeft, Trash2, X, Edit2 } from 'lucide-react';

interface NotesProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const Notes: React.FC<NotesProps> = ({ folders, setFolders, notes, setNotes }) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showFolderModal, setShowFolderModal] = useState<{show: boolean, folder?: Folder}>({show: false});
  const [newFolderName, setNewFolderName] = useState('');

  const currentFolder = folders.find(f => f.id === activeFolderId);
  const folderNotes = notes.filter(n => n.folderId === activeFolderId);

  const saveFolder = () => {
    if (!newFolderName.trim()) return;
    if (showFolderModal.folder) {
      const folderId = showFolderModal.folder.id;
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newFolderName } : f));
    } else {
      const newFolder: Folder = { id: Math.random().toString(36).substr(2, 9), name: newFolderName };
      setFolders(prev => [...prev, newFolder]);
    }
    setNewFolderName('');
    setShowFolderModal({show: false});
  };

  const addNote = () => {
    if (!activeFolderId) return;
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      folderId: activeFolderId,
      content: '',
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
    setEditingNote(newNote);
  };

  const updateNote = (content: string) => {
    if (!editingNote) return;
    const updated = { ...editingNote, content, updatedAt: new Date().toISOString() };
    setEditingNote(updated);
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  const deleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('آیا از حذف این یادداشت اطمینان دارید؟')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (editingNote?.id === id) setEditingNote(null);
    }
  };

  const deleteFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('حذف پوشه تمام یادداشت‌های آن را نیز پاک می‌کند. ادامه می‌دهید؟')) {
      setFolders(prev => prev.filter(f => f.id !== id));
      setNotes(prev => prev.filter(n => n.folderId !== id));
      if (activeFolderId === id) setActiveFolderId(null);
    }
  };

  const openEditFolder = (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewFolderName(folder.name);
    setShowFolderModal({ show: true, folder });
  };

  const getNoteTitle = (content: string) => {
    if (!content.trim()) return "یادداشت جدید";
    const words = content.trim().split(/\s+/);
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  };

  return (
    <div className="space-y-6 min-h-screen">
      {!activeFolderId ? (
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              پوشه‌ها
            </h2>
            <div className="flex gap-2">
              <button onClick={() => { setNewFolderName(''); setShowFolderModal({show: true}); }} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400">
                <FolderPlus size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {folders.length === 0 ? (
              <div className="col-span-2 p-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl text-center">
                <p className="text-sm text-slate-500">پوشه‌ای وجود ندارد. یکی بساز!</p>
              </div>
            ) : (
              folders.map(folder => (
                <div key={folder.id} onClick={() => setActiveFolderId(folder.id)} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl group relative transition-all active:scale-95 shadow-xl overflow-hidden">
                  <FolderIcon size={32} className="text-blue-500 mb-3" fill="currentColor" fillOpacity={0.1} />
                  <h4 className="font-bold text-slate-100 truncate">{folder.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{notes.filter(n => n.folderId === folder.id).length} یادداشت</p>
                  
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => openEditFolder(folder, e)} className="p-2 text-blue-400 bg-blue-500/10 rounded-xl hover:bg-blue-500/20">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={(e) => deleteFolder(folder.id, e)} className="p-2 text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section className="animate-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveFolderId(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold">{currentFolder?.name}</h2>
                <p className="text-[10px] text-slate-500">{folderNotes.length} یادداشت</p>
              </div>
            </div>
            <button onClick={addNote} className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Plus size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {folderNotes.length === 0 ? (
              <div className="col-span-2 p-12 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl text-center">
                <p className="text-sm text-slate-500">یادداشتی در این پوشه نیست.</p>
              </div>
            ) : (
              folderNotes.map(note => (
                <div key={note.id} onClick={() => setEditingNote(note)} className="aspect-square p-4 bg-slate-900 border border-slate-800 rounded-3xl relative transition-all active:scale-95 shadow-lg group overflow-hidden">
                  <div className="text-xs font-bold text-slate-200 leading-relaxed">
                    {getNoteTitle(note.content)}
                  </div>
                  <div className="absolute bottom-2 right-2 left-2 flex justify-between items-center border-t border-slate-800 pt-2">
                    <span className="text-[8px] font-bold text-slate-600">
                      {new Date(note.updatedAt).toLocaleDateString('fa-IR')}
                    </span>
                    <button onClick={(e) => deleteNote(note.id, e)} className="p-2 text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/5 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {editingNote && (
        <div className="fixed inset-0 z-[60] bg-slate-950 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setEditingNote(null)} className="p-2 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
              <X size={24} />
            </button>
            <div className="text-center">
               <h3 className="font-bold text-slate-200">{currentFolder?.name}</h3>
               <p className="text-[10px] text-slate-500">ویرایش یادداشت</p>
            </div>
            <button onClick={() => deleteNote(editingNote.id)} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500">
              <Trash2 size={24} />
            </button>
          </div>
          <textarea autoFocus value={editingNote.content} onChange={(e) => updateNote(e.target.value)} className="flex-1 bg-transparent text-lg text-slate-100 leading-loose outline-none resize-none placeholder:text-slate-700" placeholder="نوشتن یادداشت را شروع کنید..." />
          <div className="mt-4 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-600 font-bold">
            <span>آخرین تغییر: {new Date(editingNote.updatedAt).toLocaleTimeString('fa-IR')}</span>
            <span>{editingNote.content.length} کاراکتر</span>
          </div>
        </div>
      )}

      {showFolderModal.show && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">{showFolderModal.folder ? 'ویرایش پوشه' : 'پوشه جدید'}</h3>
            <input autoFocus value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-slate-100 mb-6" placeholder="نام پوشه..." onKeyDown={(e) => e.key === 'Enter' && saveFolder()} />
            <div className="flex gap-3">
              <button onClick={() => setShowFolderModal({show: false})} className="flex-1 py-3 font-bold text-slate-400 bg-slate-800 rounded-2xl">انصراف</button>
              <button onClick={saveFolder} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
