import { motion } from 'framer-motion';

const STUDY_RANKS = [
  { level: 1, title: 'Novice Cadet', icon: '🌱', minXp: 0, maxXp: 200 },
  { level: 2, title: 'Cyber Learner', icon: '⚡', minXp: 200, maxXp: 500 },
  { level: 3, title: 'Code Alchemist', icon: '🔮', minXp: 500, maxXp: 900 },
  { level: 4, title: 'Logic Slayer', icon: '🗡️', minXp: 900, maxXp: 1400 },
  { level: 5, title: 'Grandmaster Scholar', icon: '👑', minXp: 1400, maxXp: 2000 },
];

export default function StudyGamerHeader({ xp, gems, streak, activeTab, setActiveTab }) {
  // Find current rank
  let currentRank = STUDY_RANKS[0];
  for (const r of STUDY_RANKS) {
    if (xp >= r.minXp) currentRank = r;
  }
  const nextRank = STUDY_RANKS.find((r) => r.level === currentRank.level + 1) || currentRank;
  const rankXpSpan = nextRank.maxXp - currentRank.minXp;
  const currentRankProgress = Math.min(100, Math.max(0, ((xp - currentRank.minXp) / rankXpSpan) * 100));

  const TABS = [
    { id: 'forge', label: 'Concept Forge', icon: '🔥', badge: 'DEEP LEARN' },
    { id: 'memory', label: '500x Memory Lock', icon: '🧠', badge: 'LIFE-TIME LOCK' },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', badge: 'SPACED REP' },
    { id: 'arena', label: 'Boss Battle', icon: '⚔️', badge: 'FUN GAME' },
    { id: 'focus', label: 'Lo-Fi Lounge', icon: '🎧', badge: 'POMODORO' },
    { id: 'exam', label: 'Exam Compressor', icon: '📅', badge: 'AI PLAN' },
    { id: 'imagine', label: 'Imagine 3D', icon: '🧊', badge: 'ALGORITHMS' },
    { id: 'reality', label: 'Reality Lab', icon: '🧪', badge: 'SCENARIO' },
    { id: 'subjects', label: 'Subject Rooms', icon: '📚', badge: 'SYLLABUS' },
    { id: 'attendance', label: 'Attendance', icon: '📋', badge: '75% RULE' },
    { id: 'marks', label: 'Marks & SGPA', icon: '🏆', badge: 'CALCULATOR' },
    { id: 'pdf', label: 'PDF Notes', icon: '📄', badge: 'VIEWER' },
    { id: 'notes', label: 'Study Notes', icon: '📝', badge: 'WRITE' },
    { id: 'assignments', label: 'Assignments', icon: '📚', badge: 'DEADLINES' },
    { id: 'ai-doubt', label: 'AI Doubt Solver', icon: '🤖', badge: 'GEMINI' },
  ];

  return (
    <div className="mb-8">
      {/* GAMIFICATION STATS BAR */}
      <div className="grid gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-violet-950/40 via-[#0d1222] to-amber-950/20 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] sm:grid-cols-[1.2fr_auto_auto]">
        {/* Level and XP progress */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/20 to-purple-600/20 text-2xl shadow-[0_0_20px_rgba(232,200,114,0.3)]">
            {currentRank.icon}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-black text-slate-950 shadow-md">
              {currentRank.level}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white tracking-wide">
                Level {currentRank.level} · {currentRank.title}
              </span>
              <span className="font-mono text-gold font-bold">
                {xp} / {nextRank.maxXp} XP
              </span>
            </div>
            {/* XP Bar */}
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${currentRankProgress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <span className="text-2xl">💎</span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Cyber Gems</p>
            <p className="font-mono text-base font-black text-cyan-400">{gems}</p>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Study Streak</p>
            <p className="font-mono text-base font-black text-solar">{streak} Days Active</p>
          </div>
        </div>
      </div>

      {/* QUICK MODE NAVIGATION TABS */}
      <div className="mt-6 flex flex-wrap gap-2.5 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all active:scale-95 ${
                active
                  ? 'border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(232,200,114,0.25)]'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  active
                    ? 'bg-gold text-slate-950'
                    : 'bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-white'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
