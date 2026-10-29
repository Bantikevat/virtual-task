import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';

const REQUIRED_PCT = 75;

function pct(present, total) {
  if (!total) return 0;
  return Math.round((present / total) * 100);
}

function bunksAllowed(present, total) {
  // How many more classes can be bunked while staying above REQUIRED_PCT
  // (present + 0) / (total + x) >= REQUIRED_PCT/100  →  x <= present*100/REQUIRED_PCT - total
  const max = Math.floor((present * 100) / REQUIRED_PCT - total);
  return max < 0 ? 0 : max;
}

function classesNeeded(present, total) {
  // Already below — how many consecutive classes needed to reach REQUIRED_PCT
  // (present + x) / (total + x) >= 0.75  →  x >= (0.75*total - present) / 0.25
  const gap = Math.ceil((REQUIRED_PCT / 100 * total - present) / (1 - REQUIRED_PCT / 100));
  return gap <= 0 ? 0 : gap;
}

const colors = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#fb7185', '#38bdf8'];

export default function AttendanceTracker() {
  const subjects = useAuraStore((s) => s.attendanceSubjects ?? []);
  const setSubjects = useAuraStore((s) => s.setAttendanceSubjects);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  function addSubject() {
    if (!newName.trim()) return;
    const sub = {
      id: Date.now().toString(),
      name: newName.trim(),
      code: newCode.trim(),
      present: 0,
      total: 0,
      color: colors[subjects.length % colors.length],
    };
    setSubjects([...subjects, sub]);
    setNewName(''); setNewCode(''); setAdding(false);
  }

  function mark(id, attended) {
    setSubjects(subjects.map((s) =>
      s.id !== id ? s : { ...s, present: s.present + (attended ? 1 : 0), total: s.total + 1 }
    ));
  }

  function remove(id) {
    setSubjects(subjects.filter((s) => s.id !== id));
  }

  const overallPct = subjects.length
    ? pct(subjects.reduce((a, s) => a + s.present, 0), subjects.reduce((a, s) => a + s.total, 0))
    : 0;
  const danger = subjects.filter((s) => s.total > 0 && pct(s.present, s.total) < REQUIRED_PCT);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Attendance Tracker</h2>
          <p className="text-xs text-slate-400">75% minimum — Indian college rule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`rounded-xl border px-4 py-2 text-center ${overallPct < REQUIRED_PCT ? 'border-rose-500/40 bg-rose-500/10' : 'border-mint/30 bg-mint/10'}`}>
            <p className={`font-mono text-xl font-black ${overallPct < REQUIRED_PCT ? 'text-rose-400' : 'text-mint'}`}>{overallPct}%</p>
            <p className="text-[10px] text-slate-400">Overall</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 transition"
          >
            + Add Subject
          </button>
        </div>
      </div>

      {/* Danger Alert */}
      {danger.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          ⚠️ <b>{danger.length} subject{danger.length > 1 ? 's' : ''} below 75%:</b>{' '}
          {danger.map((s) => s.name).join(', ')} — attend immediately!
        </div>
      )}

      {/* Subject cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {subjects.map((sub) => {
            const p = pct(sub.present, sub.total);
            const safe = p >= REQUIRED_PCT;
            const bunkable = safe ? bunksAllowed(sub.present, sub.total) : 0;
            const needed = !safe && sub.total > 0 ? classesNeeded(sub.present, sub.total) : 0;
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative rounded-2xl border border-white/[0.07] bg-black/40 p-4"
              >
                <button
                  onClick={() => remove(sub.id)}
                  className="absolute right-3 top-3 hidden text-slate-600 hover:text-rose-400 group-hover:flex text-lg leading-none"
                >×</button>

                <div className="flex items-start gap-2 mb-3">
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color }} />
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{sub.name}</p>
                    {sub.code && <p className="text-[10px] text-slate-500">{sub.code}</p>}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3 h-1.5 rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(p, 100)}%`, backgroundColor: safe ? sub.color : '#fb7185' }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400">{sub.present}/{sub.total} classes</span>
                  <span className={`font-mono font-black ${safe ? 'text-mint' : 'text-rose-400'}`}>{p}%</span>
                </div>

                {sub.total > 0 && (
                  <p className={`text-[11px] mb-3 ${safe ? 'text-slate-400' : 'text-rose-400'}`}>
                    {safe
                      ? bunkable > 0 ? `✓ ${bunkable} more bunk${bunkable > 1 ? 's' : ''} allowed` : '⚡ On the edge — attend all'
                      : `⚠ Attend ${needed} more to reach 75%`}
                  </p>
                )}

                {/* Mark attendance buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => mark(sub.id, true)}
                    className="flex-1 rounded-xl border border-mint/30 bg-mint/10 py-2 text-[11px] font-black text-mint hover:bg-mint/20 transition"
                  >
                    ✓ Present
                  </button>
                  <button
                    onClick={() => mark(sub.id, false)}
                    className="flex-1 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2 text-[11px] font-black text-rose-400 hover:bg-rose-500/20 transition"
                  >
                    ✗ Absent
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {subjects.length === 0 && !adding && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-sm text-slate-400">Koi subject nahi — "Add Subject" dabao</p>
          </div>
        )}
      </div>

      {/* Add subject form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4"
          >
            <p className="text-xs font-bold text-violet-300 mb-3">New Subject</p>
            <div className="flex gap-2 flex-wrap">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                placeholder="Subject name (e.g. DBMS)"
                className="flex-1 min-w-[160px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400"
              />
              <input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                placeholder="Code (e.g. CS401)"
                className="w-28 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400"
              />
              <button onClick={addSubject} className="rounded-xl bg-violet-500 px-4 py-2 text-xs font-black text-white hover:bg-violet-400">Add</button>
              <button onClick={() => setAdding(false)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/10">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
