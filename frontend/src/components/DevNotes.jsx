import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';

const TAG_OPTIONS = [
  { id: 'snippet', label: 'Code Snippet', color: '#60a5fa' },
  { id: 'idea', label: 'Idea', color: '#fbbf24' },
  { id: 'api', label: 'API / Trick', color: '#34d399' },
  { id: 'bug', label: 'Bug Fix', color: '#fb7185' },
  { id: 'resource', label: 'Resource', color: '#a78bfa' },
  { id: 'note', label: 'General', color: '#94a3b8' },
];

function tagMeta(id) { return TAG_OPTIONS.find((t) => t.id === id) || TAG_OPTIONS[5]; }

export default function DevNotes() {
  const notes = useAuraStore((s) => s.devNotes ?? []);
  const setNotes = useAuraStore((s) => s.setDevNotes);

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [editing, setEditing] = useState(null); // null = closed, 'new' = new, id = editing
  const [form, setForm] = useState({ title: '', content: '', tag: 'snippet', pinned: false });

  const filtered = useMemo(() => {
    return notes
      .filter((n) => activeTag === 'all' || n.tag === activeTag)
      .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notes, activeTag, search]);

  function openNew() {
    setForm({ title: '', content: '', tag: 'snippet', pinned: false });
    setEditing('new');
  }

  function openEdit(note) {
    setForm({ title: note.title, content: note.content, tag: note.tag, pinned: note.pinned });
    setEditing(note.id);
  }

  function save() {
    if (!form.title.trim()) return;
    if (editing === 'new') {
      setNotes([{ id: Date.now().toString(), ...form, createdAt: new Date().toISOString() }, ...notes]);
    } else {
      setNotes(notes.map((n) => n.id === editing ? { ...n, ...form } : n));
    }
    setEditing(null);
  }

  function remove(id) { setNotes(notes.filter((n) => n.id !== id)); }

  function togglePin(id) {
    setNotes(notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Dev Notes</h2>
          <p className="text-xs text-slate-400">Code snippets, ideas, API tricks — developer ki zaroorat</p>
        </div>
        <button
          onClick={openNew}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition"
        >
          + New Note
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTag('all')}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${activeTag === 'all' ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-slate-500 hover:text-white'}`}
          >All</button>
          {TAG_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTag(t.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${activeTag === t.id ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
              style={activeTag === t.id ? { borderColor: t.color + '60', backgroundColor: t.color + '20', color: t.color } : { borderColor: 'rgba(255,255,255,0.08)', color: t.color }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Notes grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map((note) => {
            const tag = tagMeta(note.tag);
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative flex flex-col rounded-2xl border bg-black/40 p-4 cursor-pointer hover:border-white/20 transition ${note.pinned ? 'border-amber-500/30' : 'border-white/[0.07]'}`}
                onClick={() => openEdit(note)}
              >
                {note.pinned && (
                  <span className="absolute right-3 top-3 text-xs text-amber-400" title="Pinned">📌</span>
                )}
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className="mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide flex-shrink-0"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >{tag.label}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug mb-2">{note.title}</h3>
                {note.content && (
                  <pre className="flex-1 overflow-hidden text-[11px] text-slate-400 font-mono whitespace-pre-wrap line-clamp-4 leading-relaxed">
                    {note.content}
                  </pre>
                )}
                <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2">
                  <span className="text-[10px] text-slate-600">
                    {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <div className="hidden gap-1.5 group-hover:flex" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => togglePin(note.id)} title={note.pinned ? 'Unpin' : 'Pin'}
                      className="rounded-lg p-1 text-slate-500 hover:text-amber-400 transition text-xs">📌</button>
                    <button onClick={() => remove(note.id)}
                      className="rounded-lg p-1 text-slate-600 hover:text-rose-400 transition text-sm">×</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-600 py-4">
          {search ? `"${search}" ke liye koi note nahi mila` : 'Koi note nahi — "New Note" se shuru karo'}
        </p>
      )}

      {/* Note editor modal */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0c0d14] p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-black text-white">
                  {editing === 'new' ? 'New Dev Note' : 'Edit Note'}
                </h3>
                <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              {/* Tag picker */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setForm({ ...form, tag: t.id })}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${form.tag === t.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                    style={{ borderColor: t.color + '50', backgroundColor: form.tag === t.id ? t.color + '25' : 'transparent', color: t.color }}
                  >{t.label}</button>
                ))}
              </div>

              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title (e.g. MongoDB aggregation pipeline trick)"
                className="mb-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-cyan-400"
              />

              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                placeholder={`Code, notes, ya koi bhi cheez likho...\n\n// Example:\nconst result = await Model.aggregate([\n  { $match: { status: 'active' } },\n  { $group: { _id: '$userId', count: { $sum: 1 } } }\n]);`}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-xs text-slate-200 placeholder:text-slate-700 outline-none focus:border-cyan-400 resize-y"
              />

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                    className="rounded" />
                  <span className="text-xs text-slate-400">Pin this note</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/10">Cancel</button>
                  <button onClick={save} disabled={!form.title.trim()}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
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
