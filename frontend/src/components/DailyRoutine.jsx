import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore } from '../store/useAuraStore';

const TYPES = [
  { id: 'work', label: 'Work', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.35)' },
  { id: 'study', label: 'Study', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.35)' },
  { id: 'personal', label: 'Personal', color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.35)' },
  { id: 'health', label: 'Health', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.35)' },
  { id: 'break', label: 'Break', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
];

const HOURS = Array.from({ length: 19 }, (_, i) => i + 5); // 5am – 11pm

function pad(n) { return String(n).padStart(2, '0'); }
function fmtHour(h) { return h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`; }

export default function DailyRoutine() {
  const blocks = useAuraStore((s) => s.routineBlocks ?? []);
  const setBlocks = useAuraStore((s) => s.setRoutineBlocks);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'work', startH: 9, startM: 0, endH: 10, endM: 0 });

  function addBlock() {
    if (!form.title.trim()) return;
    const start = form.startH * 60 + form.startM;
    const end = form.endH * 60 + form.endM;
    if (end <= start) return;
    setBlocks([...blocks, { id: Date.now().toString(), ...form, title: form.title.trim() }]);
    setAdding(false);
    setForm({ title: '', type: 'work', startH: 9, startM: 0, endH: 10, endM: 0 });
  }

  function remove(id) { setBlocks(blocks.filter((b) => b.id !== id)); }

  // Stats
  const typeMinutes = TYPES.reduce((acc, t) => {
    acc[t.id] = blocks.filter((b) => b.type === t.id).reduce((s, b) => s + (b.endH * 60 + b.endM) - (b.startH * 60 + b.startM), 0);
    return acc;
  }, {});

  const totalScheduled = Object.values(typeMinutes).reduce((a, v) => a + v, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Daily Routine Planner</h2>
          <p className="text-xs text-slate-400">Work · Study · Personal — ek din ka poora plan</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition"
        >
          + Add Block
        </button>
      </div>

      {/* Stats row */}
      {totalScheduled > 0 && (
        <div className="flex flex-wrap gap-2">
          {TYPES.filter((t) => typeMinutes[t.id] > 0).map((t) => (
            <div key={t.id} className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
              style={{ borderColor: t.border, backgroundColor: t.bg }}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
              <span className="text-xs font-bold" style={{ color: t.color }}>{t.label}</span>
              <span className="font-mono text-xs text-slate-400">{Math.floor(typeMinutes[t.id] / 60)}h {typeMinutes[t.id] % 60}m</span>
            </div>
          ))}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5">
            <span className="text-xs text-slate-500">Total:</span>
            <span className="font-mono text-xs font-bold text-white">{Math.floor(totalScheduled / 60)}h {totalScheduled % 60}m</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-2xl border border-white/[0.07] bg-black/30 overflow-hidden">
        {HOURS.map((hour) => {
          const hourBlocks = blocks.filter((b) => b.startH === hour || (b.startH < hour && b.endH > hour));
          const startingBlocks = blocks.filter((b) => b.startH === hour);
          return (
            <div key={hour} className="flex border-b border-white/[0.04] last:border-b-0">
              {/* Hour label */}
              <div className="w-16 flex-shrink-0 border-r border-white/[0.04] px-3 py-3">
                <span className={`font-mono text-[10px] font-bold ${hour % 2 === 0 ? 'text-slate-400' : 'text-slate-700'}`}>
                  {fmtHour(hour)}
                </span>
              </div>
              {/* Blocks starting this hour */}
              <div className="flex flex-1 flex-wrap gap-1.5 px-3 py-2 min-h-[40px]">
                {startingBlocks.map((b) => {
                  const type = TYPES.find((t) => t.id === b.type) || TYPES[0];
                  const duration = (b.endH * 60 + b.endM) - (b.startH * 60 + b.startM);
                  return (
                    <div
                      key={b.id}
                      className="group flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs"
                      style={{ borderColor: type.border, backgroundColor: type.bg }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }} />
                      <span className="font-medium" style={{ color: type.color }}>{b.title}</span>
                      <span className="text-slate-500">{pad(b.startH)}:{pad(b.startM)}–{pad(b.endH)}:{pad(b.endM)}</span>
                      <span className="text-slate-600">{duration}m</span>
                      <button onClick={() => remove(b.id)} className="hidden group-hover:inline text-slate-600 hover:text-rose-400 transition ml-1">×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {blocks.length === 0 && (
        <p className="text-center text-sm text-slate-500 py-2">Koi block nahi — "Add Block" se apna din plan karo</p>
      )}

      {/* Add block form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-4"
          >
            <p className="text-sm font-bold text-amber-300">New Time Block</p>

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && addBlock()}
              placeholder="Kya karna hai? (e.g. Byteflow kaam, DBMS padhai)"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-400"
            />

            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm({ ...form, type: t.id })}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${form.type === t.id ? 'ring-2' : 'opacity-60 hover:opacity-100'}`}
                  style={{ borderColor: t.border, backgroundColor: t.bg, color: t.color, ringColor: t.color }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-400 text-xs">Start:</span>
              <select value={form.startH} onChange={(e) => setForm({ ...form, startH: +e.target.value })}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white text-xs outline-none">
                {HOURS.map((h) => <option key={h} value={h}>{pad(h)}:00</option>)}
              </select>
              <select value={form.startM} onChange={(e) => setForm({ ...form, startM: +e.target.value })}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white text-xs outline-none">
                {[0, 15, 30, 45].map((m) => <option key={m} value={m}>:{pad(m)}</option>)}
              </select>

              <span className="text-slate-400 text-xs">End:</span>
              <select value={form.endH} onChange={(e) => setForm({ ...form, endH: +e.target.value })}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white text-xs outline-none">
                {HOURS.map((h) => <option key={h} value={h}>{pad(h)}:00</option>)}
              </select>
              <select value={form.endM} onChange={(e) => setForm({ ...form, endM: +e.target.value })}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white text-xs outline-none">
                {[0, 15, 30, 45].map((m) => <option key={m} value={m}>:{pad(m)}</option>)}
              </select>
            </div>

            {(form.endH * 60 + form.endM) <= (form.startH * 60 + form.startM) && (
              <p className="text-xs text-rose-400">End time, start time se baad hona chahiye</p>
            )}

            <div className="flex gap-2">
              <button onClick={addBlock} className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-400">Add Block</button>
              <button onClick={() => setAdding(false)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
