import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';

const SUBJECTS = ['DBMS', 'Computer Networks', 'Operating Systems', 'Algorithms', 'React/JS', 'Node.js', 'MongoDB', 'AI/ML', 'Math', 'Other'];
const STATUSES = [
  { id: 'pending', label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { id: 'in-progress', label: 'In Progress', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  { id: 'submitted', label: 'Submitted', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { id: 'graded', label: 'Graded', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
];

function statusMeta(id) { return STATUSES.find((s) => s.id === id) || STATUSES[0]; }

function timeLeft(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  if (diff < 0) return { label: 'Deadline guzar gayi!', urgent: true, passed: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days === 0 && hours < 6) return { label: `${hours}h bacha!`, urgent: true };
  if (days === 0) return { label: `Aaj ${hours}h mein`, urgent: true };
  if (days === 1) return { label: 'Kal deadline', urgent: true };
  if (days <= 3) return { label: `${days} din bacha`, urgent: false };
  return { label: `${days} din`, urgent: false };
}

export default function AssignmentTracker() {
  const assignments = useAuraStore((s) => s.assignments ?? []);
  const setAssignments = useAuraStore((s) => s.setAssignments);

  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', subject: 'DBMS', dueDate: '', description: '', status: 'pending', marks: '' });

  function addAssignment() {
    if (!form.title.trim()) return;
    setAssignments([{ id: Date.now().toString(), ...form, createdAt: new Date().toISOString() }, ...assignments]);
    setForm({ title: '', subject: 'DBMS', dueDate: '', description: '', status: 'pending', marks: '' });
    setAdding(false);
  }

  function updateStatus(id, status) {
    setAssignments(assignments.map((a) => a.id === id ? { ...a, status } : a));
  }

  function remove(id) { setAssignments(assignments.filter((a) => a.id !== id)); }

  const sorted = useMemo(() => {
    let list = assignments;
    if (filter !== 'all') list = list.filter((a) => a.status === filter);
    return [...list].sort((a, b) => {
      if (!a.dueDate) return 1; if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [assignments, filter]);

  const pending = assignments.filter((a) => a.status === 'pending' || a.status === 'in-progress').length;
  const overdue = assignments.filter((a) => a.dueDate && new Date(a.dueDate) < new Date() && a.status !== 'submitted' && a.status !== 'graded').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Assignment Tracker</h2>
          <p className="text-xs text-slate-400">Deadlines track karo — koi submission miss mat karo</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:scale-105 transition">
          + Add Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className={`rounded-xl border px-4 py-2 ${pending > 0 ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/10 bg-black/30'}`}>
          <span className="font-mono text-lg font-black text-amber-400">{pending}</span>
          <span className="ml-2 text-xs text-slate-400">Pending</span>
        </div>
        {overdue > 0 && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 animate-pulse">
            <span className="font-mono text-lg font-black text-rose-400">{overdue}</span>
            <span className="ml-2 text-xs text-rose-300">Overdue!</span>
          </div>
        )}
        <div className="rounded-xl border border-mint/20 bg-mint/10 px-4 py-2">
          <span className="font-mono text-lg font-black text-mint">{assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length}</span>
          <span className="ml-2 text-xs text-slate-400">Done</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[{ id: 'all', label: 'All' }, ...STATUSES].map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${filter === s.id ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-slate-500 hover:text-white'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Assignment list */}
      <div className="space-y-3">
        <AnimatePresence>
          {sorted.map((a) => {
            const st = statusMeta(a.status);
            const tl = timeLeft(a.dueDate);
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`group rounded-2xl border p-4 transition ${tl?.passed ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/[0.07] bg-black/30 hover:border-white/15'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                      <span className="text-[10px] text-slate-500">{a.subject}</span>
                      {tl && (
                        <span className={`text-[10px] font-bold ${tl.urgent ? 'text-rose-400' : 'text-slate-500'}`}>
                          ⏰ {tl.label}
                        </span>
                      )}
                      {a.marks && <span className="text-[10px] text-violet-300">{a.marks}</span>}
                    </div>
                    <h3 className="text-sm font-bold text-white">{a.title}</h3>
                    {a.description && <p className="mt-1 text-xs text-slate-400 line-clamp-2">{a.description}</p>}
                  </div>
                  <button onClick={() => remove(a.id)} className="hidden group-hover:flex text-slate-600 hover:text-rose-400 transition text-lg leading-none flex-shrink-0">×</button>
                </div>

                {/* Status buttons */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button key={s.id} onClick={() => updateStatus(a.id, s.id)}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${a.status === s.id ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
                      style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-2xl mb-2">📚</p>
          <p className="text-sm text-slate-500">Koi assignment nahi — "Add Assignment" dabao</p>
        </div>
      )}

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setAdding(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0b12] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-black text-white">New Assignment</h3>
                <button onClick={() => setAdding(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Assignment title (e.g. DBMS Lab File — ER Diagram)"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-rose-400" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Due Date</label>
                  <input type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-rose-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Marks (optional)</label>
                  <input value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })}
                    placeholder="e.g. 20 marks"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-rose-400" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 mb-1 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none">
                    {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} placeholder="Assignment ke baare mein (optional) — topic, requirements..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-rose-400 resize-none" />

              <div className="flex gap-2 justify-end">
                <button onClick={() => setAdding(false)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400">Cancel</button>
                <button onClick={addAssignment} disabled={!form.title.trim()}
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
                  Add Assignment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
