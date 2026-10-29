import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuraStore, WORLDS } from '../store/useAuraStore';
import { loadAuth } from '../lib/auth';
import TaskCard from '../components/TaskCard';
import NewTaskModal from '../components/NewTaskModal';
import DailyCommand from '../components/DailyCommand';
import { sfx } from '../lib/audioFx';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CommandHub() {
  const navigate = useNavigate();
  const {
    tasks, goals, agents, getGreeting, getStats,
    selectTask, completeTask, addTask, selectedTaskId,
  } = useAuraStore();
  const authData = loadAuth();
  const [creating, setCreating] = useState(false);
  const [cyberTick, setCyberTick] = useState(0);

  // Live millisecond telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setCyberTick((t) => (t + 1) % 1000);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const stats = getStats();
  const openTasks = tasks.filter((t) => t.status !== 'done');
  const highPriority = openTasks.filter((t) => t.priority === 'high');
  const percent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6 pb-16">
      {/* TOP SCI-FI HUD BANNER */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-[#091122] to-purple-950/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)]"
      >
        {/* Background circuit lines effect */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-0.5 font-mono text-[10px] font-black tracking-widest text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                ORBIT FLIGHT STATUS: NOMINAL
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                DEFCON-1 · TELEMETRY: 99.8% · CYCLE #{1042 + cyberTick}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl font-black tracking-wide text-white sm:text-4xl lg:text-5xl">
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                {authData?.name || 'Commander'}
              </span>
              .
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
              {highPriority.length > 0
                ? `⚡ Mission Warning: ${highPriority.length} critical priority tasks require your immediate authorization.`
                : '🌌 All workspace systems stable. Ready for high-velocity creation.'}
            </p>

            {/* Quick Sci-Fi Action Launchpad */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  sfx.playLaser();
                  navigate('/study');
                }}
                className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-black text-amber-300 transition hover:bg-amber-500/25 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              >
                <span>🧠</span> 500x Memory Engraver
              </button>

              <button
                onClick={() => {
                  sfx.playSuccess();
                  navigate('/study');
                }}
                className="flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/15 px-3.5 py-2 text-xs font-black text-violet-300 transition hover:bg-violet-500/25 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
              >
                <span>⚔️</span> Cyber Boss Fight
              </button>

              <button
                onClick={() => {
                  sfx.playLaser();
                  navigate('/universe');
                }}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3.5 py-2 text-xs font-black text-cyan-300 transition hover:bg-cyan-500/25 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              >
                <span>🌌</span> 3D Spatial Radar
              </button>

              <button
                onClick={() => {
                  sfx.playBleep();
                  setCreating(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105 active:scale-95"
              >
                <span>+</span> Launch New Task
              </button>
            </div>
          </div>

          {/* QUANTUM REACTOR CORE WIDGET */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="relative flex h-28 w-28 items-center justify-center">
              {/* Outer spinning dash ring */}
              <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-cyan-400/40 [animation-duration:15s]" />
              {/* Progress SVG ring */}
              <svg className="h-full w-full -rotate-90">
                <circle cx="56" cy="56" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="6"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * percent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-black text-white">{percent}%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-400">REACTOR</span>
              </div>
            </div>
            <p className="mt-1 text-[10px] font-mono font-bold tracking-wider text-slate-400">
              {stats.done}/{stats.total} TASKS CHARGED
            </p>
          </div>
        </div>
      </motion.div>

      {/* DAILY COMMAND COCKPIT */}
      <motion.div variants={fadeUp}>
        <DailyCommand />
      </motion.div>

      {/* STATS TELEMETRY GRID */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="stat-card border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-black">
          <p className="stat-label">Productivity Flow</p>
          <p className="stat-value text-cyan-400 font-mono">{percent}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-mint"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div className="stat-card border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-black">
          <p className="stat-label">Active Missions</p>
          <p className="stat-value text-solar font-mono">{stats.open}</p>
          <p className="text-[11px] text-slate-400">{stats.done} completed today</p>
        </div>

        <div className="stat-card border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-black">
          <p className="stat-label">Milestone Orbiters</p>
          <p className="stat-value text-purple-400 font-mono">{goals.length}</p>
          <p className="text-[11px] text-slate-400">Across {new Set(goals.map((g) => g.worldId)).size} Worlds</p>
        </div>

        <div className="stat-card border-mint/20 bg-gradient-to-br from-mint/10 to-black">
          <p className="stat-label">Autonomous Agents</p>
          <p className="stat-value text-mint font-mono">
            {agents.filter((a) => a.status === 'active').length}
          </p>
          <p className="text-[11px] text-slate-400">All pilots standing by</p>
        </div>
      </motion.div>

      {/* MAIN TWO-COLUMN DISPATCH */}
      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        {/* Left Column: Worlds + Priority Lane */}
        <div className="space-y-6">
          {/* Quick World Portals */}
          <motion.section variants={fadeUp}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-black tracking-wide text-white">
                World Teleport Hub
              </h2>
              <button
                onClick={() => {
                  sfx.playLaser();
                  navigate('/universe');
                }}
                className="btn-ghost text-xs text-cyan-400 hover:text-cyan-300"
              >
                Open 3D Universe Radar →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3">
              {WORLDS.filter((w) => w.id !== 'hub').map((world) => {
                const worldTasks = tasks.filter((t) => t.worldId === world.id && t.status !== 'done');
                return (
                  <motion.button
                    key={world.id}
                    onClick={() => {
                      sfx.playBleep();
                      navigate(world.path);
                    }}
                    className="world-card group text-left border border-white/[0.08] hover:border-cyan-400/40"
                    style={{ '--world-glow': world.glowColor }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative z-10">
                      <div
                        className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl text-xl shadow-[0_0_15px_currentColor]"
                        style={{ backgroundColor: world.color + '22', color: world.color }}
                      >
                        {world.icon}
                      </div>
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-200">
                        {world.name}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {worldTasks.length} active {worldTasks.length === 1 ? 'task' : 'tasks'}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* Priority Task Lane */}
          <motion.section variants={fadeUp}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-black text-white">Priority Flight Lane</h2>
                <p className="text-xs text-slate-400">Tasks requiring immediate focus</p>
              </div>
              <button
                onClick={() => {
                  sfx.playBleep();
                  setCreating(true);
                }}
                className="btn-primary text-xs"
              >
                + New Task
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {openTasks.slice(0, 4).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  selected={task.id === selectedTaskId}
                  onSelect={(id) => {
                    sfx.playBleep();
                    selectTask(id);
                  }}
                  onComplete={(id) => {
                    sfx.playSuccess();
                    completeTask(id);
                  }}
                />
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Sidebar: Active Goals + Live Neural Agent Terminal */}
        <div className="space-y-6">
          {/* Active Goals with Neon Progress */}
          <motion.section variants={fadeUp} className="glass-strong rounded-3xl border border-white/[0.08] p-5 shadow-lg">
            <h2 className="font-display text-base font-black tracking-wide text-white">
              Target Trajectories
            </h2>
            <div className="mt-4 space-y-4">
              {goals.map((goal) => {
                const world = WORLDS.find((w) => w.id === goal.worldId);
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between text-xs">
                      <p className="font-medium text-white">{goal.title}</p>
                      <span className="font-mono font-bold" style={{ color: world?.color }}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/[0.08]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: world?.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* NEURAL AGENT LIVE DISPATCH TERMINAL */}
          <motion.section variants={fadeUp} className="rounded-3xl border border-cyan-500/25 bg-black/60 p-5 shadow-lg font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
              <span className="flex items-center gap-2 font-bold text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                NEURAL AGENT BUS
              </span>
              <span className="text-[10px] text-slate-500">SYS_V2.6</span>
            </div>

            {/* Live Terminal logs */}
            <div className="mt-3 space-y-2 text-[11px] leading-relaxed">
              <p className="text-slate-400">
                <span className="text-purple-400">[StudyMate]</span> Indexed DBMS & Algorithms. Memory Lock 100% active.
              </p>
              <p className="text-slate-400">
                <span className="text-rose-400">[CareerPilot]</span> FormPilot extension armed. Job vault calibrated.
              </p>
              <p className="text-slate-400">
                <span className="text-mint">[Guardian]</span> Auth sandbox verified · 0 security anomalies.
              </p>
              <p className="text-cyan-400 animate-pulse">
                &gt; AURA Core listening on port 5001_
              </p>
            </div>
          </motion.section>
        </div>
      </div>

      {/* New task modal */}
      {creating && <NewTaskModal onClose={() => setCreating(false)} onCreate={addTask} />}
    </motion.div>
  );
}
