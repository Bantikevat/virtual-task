import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRADE_SCALE = [
  { min: 90, grade: 'O', points: 10, label: 'Outstanding' },
  { min: 80, grade: 'A+', points: 9, label: 'Excellent' },
  { min: 70, grade: 'A', points: 8, label: 'Very Good' },
  { min: 60, grade: 'B+', points: 7, label: 'Good' },
  { min: 55, grade: 'B', points: 6, label: 'Above Average' },
  { min: 50, grade: 'C', points: 5, label: 'Average' },
  { min: 45, grade: 'D', points: 4, label: 'Pass' },
  { min: 0, grade: 'F', points: 0, label: 'Fail' },
];

function getGrade(marks) {
  for (const g of GRADE_SCALE) if (marks >= g.min) return g;
  return GRADE_SCALE[GRADE_SCALE.length - 1];
}

const EMPTY_SUB = { name: '', credits: '4', marks: '' };

export default function MarksCalculator() {
  const [subjects, setSubjects] = useState([
    { id: '1', name: 'DBMS', credits: '4', marks: '' },
    { id: '2', name: 'Computer Networks', credits: '4', marks: '' },
    { id: '3', name: 'OS', credits: '4', marks: '' },
  ]);
  const [newSub, setNewSub] = useState({ ...EMPTY_SUB });
  const [adding, setAdding] = useState(false);
  const [outOf, setOutOf] = useState('100');

  function update(id, field, value) {
    setSubjects((prev) => prev.map((s) => s.id !== id ? s : { ...s, [field]: value }));
  }

  function addSubject() {
    if (!newSub.name.trim()) return;
    setSubjects((prev) => [...prev, { ...newSub, id: Date.now().toString() }]);
    setNewSub({ ...EMPTY_SUB });
    setAdding(false);
  }

  function remove(id) { setSubjects((prev) => prev.filter((s) => s.id !== id)); }

  const maxMarks = parseFloat(outOf) || 100;

  const filledSubjects = subjects.filter((s) => s.marks !== '' && !isNaN(parseFloat(s.marks)));
  const totalCredits = filledSubjects.reduce((a, s) => a + parseFloat(s.credits || 4), 0);
  const weightedPoints = filledSubjects.reduce((a, s) => {
    const pct = (parseFloat(s.marks) / maxMarks) * 100;
    const g = getGrade(pct);
    return a + g.points * parseFloat(s.credits || 4);
  }, 0);
  const sgpa = totalCredits ? (weightedPoints / totalCredits).toFixed(2) : null;
  const cgpa = sgpa ? (parseFloat(sgpa) * 0.92).toFixed(2) : null; // approx conversion

  const sgpaColor = !sgpa ? '#94a3b8'
    : sgpa >= 9 ? '#34d399'
    : sgpa >= 7 ? '#60a5fa'
    : sgpa >= 5 ? '#fbbf24'
    : '#fb7185';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Marks & SGPA Calculator</h2>
          <p className="text-xs text-slate-400">Enter marks — auto-calculates grade points &amp; SGPA</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Out of</span>
          <input
            value={outOf}
            onChange={(e) => setOutOf(e.target.value)}
            className="w-16 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* SGPA card */}
      {sgpa && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-r from-black/60 to-black/40 p-5 flex items-center gap-6"
        >
          <div className="text-center">
            <p className="font-mono text-4xl font-black" style={{ color: sgpaColor }}>{sgpa}</p>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-0.5">SGPA</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <p className="font-mono text-2xl font-black text-slate-300">~{cgpa}</p>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-0.5">CGPA (approx)</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex-1">
            <p className="text-xs text-slate-400">{filledSubjects.length} subjects · {totalCredits} total credits</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(parseFloat(sgpa) / 10) * 100}%`, backgroundColor: sgpaColor }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Subject rows */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px_70px_32px] gap-2 px-4 py-2 bg-white/[0.03] text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>Subject</span><span className="text-center">Credits</span><span className="text-center">Marks</span><span className="text-center">Grade</span><span />
        </div>

        {subjects.map((sub, i) => {
          const pct = sub.marks !== '' ? (parseFloat(sub.marks) / maxMarks) * 100 : null;
          const g = pct !== null ? getGrade(pct) : null;
          const gradeColor = g
            ? g.grade === 'F' ? '#fb7185'
            : g.points >= 8 ? '#34d399'
            : g.points >= 6 ? '#60a5fa'
            : '#fbbf24'
            : '#94a3b8';

          return (
            <div key={sub.id} className={`grid grid-cols-[1fr_80px_80px_70px_32px] gap-2 px-4 py-2.5 items-center ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
              <input
                value={sub.name}
                onChange={(e) => update(sub.id, 'name', e.target.value)}
                placeholder="Subject name"
                className="bg-transparent text-sm text-white outline-none placeholder:text-slate-600 w-full"
              />
              <input
                value={sub.credits}
                onChange={(e) => update(sub.id, 'credits', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-center text-xs text-white outline-none focus:border-cyan-400"
              />
              <input
                value={sub.marks}
                onChange={(e) => update(sub.id, 'marks', e.target.value)}
                placeholder="—"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-center text-xs text-white outline-none focus:border-cyan-400"
              />
              <div className="text-center">
                {g ? (
                  <span className="font-mono text-sm font-black" style={{ color: gradeColor }}>{g.grade}</span>
                ) : (
                  <span className="text-slate-600 text-xs">—</span>
                )}
              </div>
              <button onClick={() => remove(sub.id)} className="text-slate-700 hover:text-rose-400 text-lg leading-none transition">×</button>
            </div>
          );
        })}
      </div>

      {/* Grade scale reference */}
      <details className="rounded-xl border border-white/[0.07] bg-black/20">
        <summary className="cursor-pointer px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-300">Grade Scale Reference ▾</summary>
        <div className="grid grid-cols-4 gap-1.5 px-4 pb-3 pt-1">
          {GRADE_SCALE.map((g) => (
            <div key={g.grade} className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1.5 text-center">
              <p className="font-mono text-sm font-black text-white">{g.grade}</p>
              <p className="text-[9px] text-slate-500">{g.min}%+ · {g.points}pts</p>
            </div>
          ))}
        </div>
      </details>

      {/* Add subject */}
      <div className="flex items-center gap-2">
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="rounded-xl border border-dashed border-white/20 px-4 py-2 text-xs text-slate-400 hover:border-cyan-400 hover:text-cyan-300 transition"
          >
            + Add Subject
          </button>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 flex-wrap w-full">
              <input
                value={newSub.name}
                onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                placeholder="Subject name"
                className="flex-1 min-w-[140px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              />
              <input
                value={newSub.credits}
                onChange={(e) => setNewSub({ ...newSub, credits: e.target.value })}
                placeholder="Credits"
                className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              />
              <button onClick={addSubject} className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-black text-slate-950">Add</button>
              <button onClick={() => setAdding(false)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400">Cancel</button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
