import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';

const SUBJECTS = ['General', 'DBMS', 'Computer Networks', 'Operating Systems', 'Algorithms', 'React/JS', 'Node.js', 'MongoDB', 'AI/ML', 'Math'];
const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#fb7185', '#38bdf8', '#e8c872'];

export default function StudyNotes() {
  const notes = useAuraStore((s) => s.studyNotes ?? []);
  const setNotes = useAuraStore((s) => s.setStudyNotes);

  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subject: 'General', content: '', color: COLORS[0] });

  const filtered = useMemo(() =>
    notes
      .filter((n) => filterSubject === 'All' || n.subject === filterSubject)
      .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [notes, filterSubject, search]
  );

  function openNew() {
    setForm({ title: '', subject: 'General', content: '', color: COLORS[0] });
    setEditing('new');
  }

  function openEdit(note) {
    setForm({ title: note.title, subject: note.subject, content: note.content, color: note.color || COLORS[0] });
    setEditing(note.id);
  }

  function save() {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    if (editing === 'new') {
      setNotes([{ id: Date.now().toString(), ...form, createdAt: now, updatedAt: now }, ...notes]);
    } else {
      setNotes(notes.map((n) => n.id === editing ? { ...n, ...form, updatedAt: now } : n));
    }
    setEditing(null);
  }

  function remove(id) {
    if (!window.confirm('Ye note delete ho jayega — pakka?')) return;
    setNotes(notes.filter((n) => n.id !== id));
  }

  function wordCount(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  const subjectsUsed = [...new Set(notes.map((n) => n.subject))];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Study Notes</h2>
          <p className="text-xs text-slate-400">Subject-wise notes — yahin likho, yahin rahenge</p>
        </div>
        <button onClick={openNew}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:scale-105 transition">
          + New Note
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..."
          className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400" />
        <div className="flex flex-wrap gap-1.5">
          {['All', ...subjectsUsed].map((s) => (
            <button key={s} onClick={() => setFilterSubject(s)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${filterSubject === s ? 'border-sky-400/50 bg-sky-500/20 text-sky-300' : 'border-white/10 text-slate-500 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {notes.length > 0 && (
        <div className="flex gap-4 text-xs text-slate-500">
          <span>{notes.length} notes</span>
          <span>{subjectsUsed.length} subjects</span>
          <span>{notes.reduce((a, n) => a + wordCount(n.content), 0).toLocaleString()} words total</span>
        </div>
      )}

      {/* Notes grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map((note) => (
            <motion.div key={note.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-black/40 p-4 cursor-pointer hover:border-white/20 transition"
              style={{ borderTopColor: note.color + '60', borderTopWidth: 2 }}
              onClick={() => openEdit(note)}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="rounded-lg px-2 py-0.5 text-[10px] font-black" style={{ backgroundColor: (note.color || COLORS[0]) + '20', color: note.color || COLORS[0] }}>
                  {note.subject}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-2">{note.title}</h3>
              {note.content && (
                <p className="flex-1 text-[11px] text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-line">{note.content}</p>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2">
                <span className="text-[10px] text-slate-600">
                  {new Date(note.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  {' · '}{wordCount(note.content)}w
                </span>
                <button onClick={(e) => { e.stopPropagation(); remove(note.id); }}
                  className="hidden group-hover:inline-block text-slate-600 hover:text-rose-400 text-lg leading-none transition">×</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-2xl mb-2">📝</p>
          <p className="text-sm text-slate-500">{search ? 'Koi note nahi mila' : 'Pehla note likho — "New Note" dabao'}</p>
        </div>
      )}

      {/* Editor modal */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm pt-10"
            onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0a0b12] p-6 shadow-2xl mb-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-black text-white">{editing === 'new' ? 'New Note' : 'Edit Note'}</h3>
                <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              {/* Subject + color */}
              <div className="mb-3 flex flex-wrap gap-2 items-center">
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400">
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <div className="flex gap-1.5">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`h-5 w-5 rounded-full transition ${form.color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-black' : 'opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Note ka title (e.g. DBMS — 3NF Normalization Notes)"
                className="mb-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-sky-400" />

              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={14} placeholder={`Yahan apne notes likho...\n\n• Bullet points\n• Definitions\n• Examples\n• Important formulas\n\nKuch bhi — yeh sirf tumhara hai.`}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-700 outline-none focus:border-sky-400 resize-y leading-relaxed" />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-600">{wordCount(form.content)} words</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/10">Cancel</button>
                  <button onClick={save} disabled={!form.title.trim()}
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
                    {editing === 'new' ? 'Save Note' : 'Update'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
