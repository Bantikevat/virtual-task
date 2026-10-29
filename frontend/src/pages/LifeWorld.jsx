import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore, WORLDS } from '../store/useAuraStore';
import { sfx } from '../lib/audioFx';
import { ASSISTANT_URL } from '../lib/assistant';
import DailyRoutine from '../components/DailyRoutine';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning Physical Workout', streak: 6, target: 30, completed: 19, icon: '🏋️', color: '#fbbf24' },
  { id: 'h2', name: 'Deep Coding / Study Session (90m)', streak: 8, target: 30, completed: 24, icon: '💻', color: '#a78bfa' },
  { id: 'h3', name: 'Hydration Protocol (3L Water)', streak: 12, target: 30, completed: 28, icon: '💧', color: '#60a5fa' },
  { id: 'h4', name: 'Zero Doomscrolling / Social Media', streak: 4, target: 30, completed: 14, icon: '🛡️', color: '#f472b6' },
  { id: 'h5', name: 'Night Reflection & Brain Dump', streak: 5, target: 30, completed: 17, icon: '🌙', color: '#34d399' },
];

export default function LifeWorld() {
  const world = WORLDS.find((w) => w.id === 'life');
  const allTasks = useAuraStore((s) => s.tasks);
  const tasks = allTasks.filter((task) => task.worldId === 'life' && task.status !== 'done');
  const addTask = useAuraStore((s) => s.addTask);

  // Gamification state
  const [energyLevel, setEnergyLevel] = useState(85);
  const [mentalFocus, setMentalFocus] = useState(90);

  // Habits with localStorage
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('aura-life-habits');
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  const [todayCompletedHabits, setTodayCompletedHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('aura-today-habits');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Water Hydration Fuel Tank (8 Glasses)
  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      return Number(localStorage.getItem('aura-water-glasses')) || 4;
    } catch {
      return 4;
    }
  });

  // AI Life Coach state
  const [selectedMood, setSelectedMood] = useState('Beast Mode');
  const [userNote, setUserNote] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [coachPlan, setCoachPlan] = useState(null);
  const [coachError, setCoachError] = useState('');

  // Brain Dump state
  const [brainDumpText, setBrainDumpText] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [dissolved, setDissolved] = useState(false);

  // New habit modal
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  function toggleHabit(id) {
    const isDone = todayCompletedHabits[id];
    const nextState = { ...todayCompletedHabits, [id]: !isDone };
    setTodayCompletedHabits(nextState);
    localStorage.setItem('aura-today-habits', JSON.stringify(nextState));

    if (!isDone) {
      sfx.playSuccess();
      // Increase streak
      const updated = habits.map((h) =>
        h.id === id ? { ...h, streak: h.streak + 1, completed: h.completed + 1 } : h
      );
      setHabits(updated);
      localStorage.setItem('aura-life-habits', JSON.stringify(updated));
    } else {
      sfx.playBleep();
    }
  }

  function addWaterGlass() {
    const next = Math.min(8, waterGlasses + 1);
    setWaterGlasses(next);
    localStorage.setItem('aura-water-glasses', String(next));
    sfx.playBleep(true);
  }

  function resetWater() {
    setWaterGlasses(0);
    localStorage.setItem('aura-water-glasses', '0');
    sfx.playBleep();
  }

  function addNewHabit() {
    if (!newHabitName.trim()) return;
    const newH = {
      id: 'h_' + Date.now(),
      name: newHabitName.trim(),
      streak: 1,
      target: 30,
      completed: 1,
      icon: '⚡',
      color: '#e8c872',
    };
    const updated = [...habits, newH];
    setHabits(updated);
    localStorage.setItem('aura-life-habits', JSON.stringify(updated));
    setNewHabitName('');
    setShowAddHabit(false);
    sfx.playSuccess();
  }

  // AI Life Coach trigger
  async function askLifeCoach() {
    setIsOptimizing(true);
    setCoachError('');
    setCoachPlan(null);
    sfx.playLaser();

    try {
      const res = await fetch(`${ASSISTANT_URL}/life-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energy: energyLevel,
          mood: selectedMood,
          note: userNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'AI Life Coach error');
      setCoachPlan(data);
      sfx.playLevelUp();
    } catch (e) {
      setCoachError(e.message || 'Assistant server offline. Start with npm run assistant');
      sfx.playFail();
    } finally {
      setIsOptimizing(false);
    }
  }

  // Brain Dump Dissolver
  function handleDissolve() {
    if (!brainDumpText.trim()) return;
    setIsDissolving(true);
    sfx.playLaser();
    setTimeout(() => {
      setBrainDumpText('');
      setIsDissolving(false);
      setDissolved(true);
      sfx.playSuccess();
      setTimeout(() => setDissolved(false), 3500);
    }, 900);
  }

  const completedCount = Object.values(todayCompletedHabits).filter(Boolean).length;
  const habitCompletionPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-7 pb-16">
      {/* 1. TOP SCI-FI LIFE BIO-COMMAND BAR */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#140e06] to-cyan-950/20 p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.12)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-black text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              HUMAN PERFORMANCE & LIFE OPERATING SYSTEM
            </div>
            <h1 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">
              Personal Bio-Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Energy telemetry, habit algorithms, AI routine optimizer & mental decompression chamber.
            </p>
          </div>

          {/* Quick Life Stats */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-2.5 text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Habits Today</p>
              <p className="font-mono text-base font-black text-amber-300">
                {completedCount}/{habits.length} ({habitCompletionPercent}%)
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-2.5 text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Hydration</p>
              <p className="font-mono text-base font-black text-cyan-400">
                {waterGlasses * 0.375}L / 3.0L
              </p>
            </div>
          </div>
        </div>

        {/* LIVE BIOMETRIC BATTERY METERS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Physical Energy Battery */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">⚡ Physical Energy</span>
              <span className="font-mono font-bold text-white">{energyLevel}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="mt-2 w-full accent-amber-400 cursor-pointer"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              {energyLevel >= 80 ? '🔥 Peak Energy · Tackle hardest tasks now' : energyLevel >= 50 ? '⚖️ Moderate Flow · Good for study' : '💤 Low Energy · Rest/Recharge advised'}
            </p>
          </div>

          {/* Mental Focus Battery */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400">🧠 Mental Bandwidth</span>
              <span className="font-mono font-bold text-white">{mentalFocus}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={mentalFocus}
              onChange={(e) => setMentalFocus(Number(e.target.value))}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              {mentalFocus >= 75 ? '🎯 Laser Locked · Zero distraction state' : '☕ Mild Fog · Take a 5m walk'}
            </p>
          </div>

          {/* Burnout Prevention Shield */}
          <div className="rounded-2xl border border-mint/20 bg-mint/[0.04] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-mint">🛡️ Burnout Shield</span>
              <span className="font-mono font-bold text-mint">MAX OPTIMAL</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-200">
              Circadian Peak: <b className="text-white">10:00 AM – 2:00 PM</b>
            </p>
            <p className="text-[10px] text-slate-400">
              Deep sleep recovery: 7.8 hrs recommended
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. MAIN WORKSPACE: HABIT MATRIX & AI LIFE COACH */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT COLUMN: INTERACTIVE HABIT TRACKER & HYDRATION TANK */}
        <div className="space-y-6">
          {/* HABIT TRACKER */}
          <motion.section variants={fadeUp} className="glass-strong rounded-3xl border border-white/[0.08] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h2 className="font-display text-lg font-black text-white">Daily Habit Engines</h2>
                <p className="text-xs text-slate-400">Click to check off today's habits and extend your streak!</p>
              </div>
              <button
                onClick={() => setShowAddHabit((v) => !v)}
                className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20"
              >
                + Add Habit
              </button>
            </div>

            {/* Add Habit input form */}
            {showAddHabit && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="New habit name (e.g. 15m Meditation, Read 10 Pages)..."
                  className="field flex-1 text-xs bg-black/60 border-white/10"
                />
                <button
                  onClick={addNewHabit}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950"
                >
                  Save
                </button>
              </div>
            )}

            {/* Habits List */}
            <div className="mt-4 space-y-3">
              {habits.map((habit) => {
                const isCompletedToday = !!todayCompletedHabits[habit.id];
                return (
                  <motion.div
                    key={habit.id}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                      isCompletedToday
                        ? 'border-mint/50 bg-mint/[0.08] shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold transition-all ${
                          isCompletedToday
                            ? 'bg-mint text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                            : 'border border-white/20 bg-white/5 text-transparent hover:border-white/40'
                        }`}
                      >
                        ✓
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{habit.icon}</span>
                          <h3
                            className={`text-sm font-bold ${
                              isCompletedToday ? 'text-white line-through opacity-80' : 'text-white'
                            }`}
                          >
                            {habit.name}
                          </h3>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {habit.completed}/{habit.target} days active · 30-Day Protocol
                        </p>
                      </div>
                    </div>

                    {/* Streak flame badge */}
                    <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-black text-amber-300">
                      <span>🔥</span>
                      <span>{habit.streak} DAYS</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* 8-GLASS HYDRATION TANK */}
          <motion.section variants={fadeUp} className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-[#07131e] to-black p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <span>💧</span> 8-Glass Cyber Hydration Fuel Tank
                </h3>
                <p className="text-[11px] text-slate-400">Click a water glass to hydrate your brain cells!</p>
              </div>
              <button onClick={resetWater} className="text-[10px] text-slate-500 hover:text-white">
                Reset
              </button>
            </div>

            {/* Water Drops Grid */}
            <div className="mt-4 flex flex-wrap gap-2.5 justify-between">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glassNum) => {
                const isFilled = glassNum <= waterGlasses;
                return (
                  <button
                    key={glassNum}
                    onClick={() => {
                      setWaterGlasses(glassNum);
                      localStorage.setItem('aura-water-glasses', String(glassNum));
                      sfx.playBleep(true);
                    }}
                    className={`flex flex-col items-center justify-center h-14 w-12 rounded-2xl border transition-all ${
                      isFilled
                        ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105'
                        : 'border-white/10 bg-white/[0.02] text-slate-600 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl">💧</span>
                    <span className="font-mono text-[9px] font-bold mt-1">250ml</span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* RIGHT COLUMN: AI LIFE COACH & BRAIN DUMP CHAMBER */}
        <div className="space-y-6">
          {/* AI LIFE COACH & ROUTINE OPTIMIZER */}
          <motion.section variants={fadeUp} className="glass-strong rounded-3xl border border-amber-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="flex items-center gap-2 font-mono text-xs font-black text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                AI LIFE PERFORMANCE COACH
              </span>
              <span className="text-[10px] font-mono text-slate-500">POWERED BY GEMINI</span>
            </div>

            <p className="mt-3 text-xs text-slate-300">
              Apna current state chuno, AI Coach aapko turant ek sharp high-energy daily battle plan dega:
            </p>

            {/* Mood selector buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['Beast Mode', 'Moderate Flow', 'Low Energy / Tired', 'Stressed / Overwhelmed'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMood(m);
                    sfx.playBleep();
                  }}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    selectedMood === m
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Optional: Aaj kaisa lag raha hai? (e.g. Raat ko neend kam aayi, ya exam ka stress hai)..."
              className="mt-3 field w-full text-xs bg-black/50 border-white/10 resize-none"
            />

            <button
              onClick={askLifeCoach}
              disabled={isOptimizing}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] disabled:opacity-40 transition hover:scale-[1.01]"
            >
              {isOptimizing ? 'AI Life Coach Analyzing…' : '⚡ Generate Performance Action Plan'}
            </button>
            {coachError && <p className="mt-2 text-xs text-rose-400">{coachError}</p>}

            {/* AI COACH GENERATED PROTOCOL */}
            <AnimatePresence>
              {coachPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 space-y-3 rounded-2xl border border-amber-500/30 bg-black/60 p-4"
                >
                  <p className="font-display text-xs font-black italic text-amber-300">
                    "{coachPlan.quote}"
                  </p>

                  <div className="rounded-xl bg-white/[0.03] p-3 text-xs">
                    <p className="font-bold text-mint">🚀 IMMEDIATE 10-MINUTE FIX:</p>
                    <p className="mt-1 text-slate-200">{coachPlan.immediateFix}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-cyan-400">📅 RECOMMENDED BLOCKS:</p>
                    {coachPlan.recommendedBlocks?.map((b, i) => (
                      <div key={i} className="rounded-lg bg-white/[0.02] p-2 flex justify-between gap-2">
                        <span className="font-mono font-bold text-amber-400">{b.time}</span>
                        <span className="text-slate-200 font-medium">{b.activity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 text-xs">
                    <p className="font-bold text-purple-300">🧠 DOPAMINE & MOTIVATION HACK:</p>
                    <p className="mt-1 text-slate-200">{coachPlan.dopamineHack}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* BRAIN DUMP & STRESS DISSOLVER CHAMBER */}
          <motion.section variants={fadeUp} className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-[#100718] to-black p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <span>🧘</span> Brain Dump & Stress Dissolver
              </h3>
              <span className="text-[10px] text-purple-400 font-mono font-bold">NIGHT PROTOCOL</span>
            </div>

            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Dimaag me koi tension, chinta ya overthinking chal rahi hai? Yahan likho aur <b>"Dissolve"</b> dabao — text disappear ho jayega aur mind clear ho jayega.
            </p>

            <textarea
              rows={3}
              value={brainDumpText}
              onChange={(e) => setBrainDumpText(e.target.value)}
              placeholder="Write anything cluttering your mind here..."
              className={`mt-3 field w-full text-xs bg-black/60 border-white/10 resize-none transition-all duration-700 ${
                isDissolving ? 'blur-md opacity-0 scale-95' : 'opacity-100'
              }`}
            />

            <button
              onClick={handleDissolve}
              disabled={isDissolving || !brainDumpText.trim()}
              className="mt-3 w-full rounded-xl border border-purple-500/40 bg-purple-500/20 py-2.5 text-xs font-black text-purple-200 transition hover:bg-purple-500/30 disabled:opacity-40"
            >
              {isDissolving ? '✨ Vaporizing Stress Particles…' : '🌪️ Dissolve & Clear My Mind'}
            </button>

            {dissolved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 rounded-xl border border-mint/30 bg-mint/10 p-3 text-center text-xs font-bold text-mint"
              >
                ✓ Mental Decompression Complete. Mind is now peaceful & crystal clear.
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>

      {/* Daily Routine Planner */}
      <motion.section variants={fadeUp} className="mt-8 rounded-3xl border border-amber-500/20 bg-black/30 p-6">
        <DailyRoutine />
      </motion.section>
    </motion.div>
  );
}
