import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuraStore, WORLDS } from '../store/useAuraStore';
import RealityLab from '../components/RealityLab';
import ImagineMode from '../components/ImagineMode';
import ExamCompressor from '../components/ExamCompressor';
import IndexingMission from '../components/IndexingMission';
import StudyBossArena from '../components/StudyBossArena';
import CyberFocusLounge from '../components/CyberFocusLounge';
import StudyGamerHeader from '../components/StudyGamerHeader';
import NeuroMemoryLock from '../components/NeuroMemoryLock';
import ConceptForge from '../components/ConceptForge';
import Flashcards from '../components/Flashcards';
import AttendanceTracker from '../components/AttendanceTracker';
import MarksCalculator from '../components/MarksCalculator';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const demoSubjects = [
  {
    id: 's1',
    name: 'Database Management Systems',
    code: 'CS401',
    progress: 42,
    topics: 12,
    completed: 5,
    color: '#a78bfa',
    nextRevision: 'Tomorrow',
  },
  {
    id: 's2',
    name: 'Computer Networks',
    code: 'CS402',
    progress: 28,
    topics: 15,
    completed: 4,
    color: '#60a5fa',
    nextRevision: 'Oct 26',
  },
  {
    id: 's3',
    name: 'Operating Systems',
    code: 'CS403',
    progress: 55,
    topics: 10,
    completed: 6,
    color: '#34d399',
    nextRevision: 'Oct 27',
  },
  {
    id: 's4',
    name: 'Machine Learning',
    code: 'CS501',
    progress: 15,
    topics: 18,
    completed: 3,
    color: '#f472b6',
    nextRevision: 'Oct 28',
  },
];

const demoTopics = [
  { id: 't1', name: 'ER Model & Diagrams', subject: 'DBMS', difficulty: 'Medium', mastery: 80, status: 'mastered' },
  { id: 't2', name: 'Normalization (1NF-BCNF)', subject: 'DBMS', difficulty: 'Hard', mastery: 45, status: 'learning' },
  { id: 't3', name: 'SQL Joins & Subqueries', subject: 'DBMS', difficulty: 'Medium', mastery: 60, status: 'learning' },
  { id: 't4', name: 'Transaction Management', subject: 'DBMS', difficulty: 'Hard', mastery: 20, status: 'new' },
  { id: 't5', name: 'TCP/IP Protocol Stack', subject: 'CN', difficulty: 'Medium', mastery: 50, status: 'learning' },
  { id: 't6', name: 'Process Scheduling', subject: 'OS', difficulty: 'Medium', mastery: 75, status: 'mastered' },
];

const masteryColors = {
  mastered: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', label: 'Mastered' },
  learning: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', label: 'Learning' },
  new: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', label: 'New' },
};

export default function StudyWorld() {
  const world = WORLDS.find((w) => w.id === 'study');
  const allTasks = useAuraStore((s) => s.tasks);
  const tasks = allTasks.filter((task) => task.worldId === 'study' && task.status !== 'done');
  const [activeSubject, setActiveSubject] = useState(null);

  // Active view tab: 'memory' | 'arena' | 'focus' | 'exam' | 'imagine' | 'reality' | 'subjects'
  const [activeTab, setActiveTab] = useState('memory');

  // When another tab (e.g. Exam Compressor) asks to open a concept's world, jump to the Imagine tab.
  const pendingImagine = useAuraStore((s) => s.pendingImagineTopic);
  useEffect(() => { if (pendingImagine) setActiveTab('imagine'); }, [pendingImagine]);

  // Gamification state with localStorage persistence
  const [xp, setXp] = useState(() => {
    try {
      return Number(localStorage.getItem('aura-study-xp')) || 240;
    } catch {
      return 240;
    }
  });

  const [gems, setGems] = useState(() => {
    try {
      return Number(localStorage.getItem('aura-study-gems')) || 65;
    } catch {
      return 65;
    }
  });

  const [streak] = useState(5);

  function gainXp(amount) {
    setXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('aura-study-xp', String(next));
      } catch { /* ignore */ }
      return next;
    });

    setGems((prev) => {
      const nextGems = prev + Math.max(5, Math.floor(amount / 5));
      try {
        localStorage.setItem('aura-study-gems', String(nextGems));
      } catch { /* ignore */ }
      return nextGems;
    });
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="pb-16">
      {/* Header with Title and Mode */}
      <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-[0_0_20px_rgba(167,139,250,0.25)]"
            style={{ backgroundColor: world.color + '22', color: world.color }}
          >
            {world.icon}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
              {world.name} <span className="text-sm font-bold text-gold">· Cyber Campus</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              500X Permanent Memory Lock, Boss Battles & Lo-Fi Pomodoro
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gamification Progress Bar & Mode Tabs */}
      <motion.div variants={fadeUp}>
        <StudyGamerHeader
          xp={xp}
          gems={gems}
          streak={streak}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </motion.div>

      {/* CONCEPT FORGE — 5-stage deep learning */}
      {activeTab === 'forge' && (
        <motion.div variants={fadeUp} key="tab-forge">
          <ConceptForge onXp={gainXp} />
        </motion.div>
      )}

      {/* TAB 0: 500X NEURO MEMORY LOCK */}
      {activeTab === 'memory' && (
        <motion.div variants={fadeUp} key="tab-memory">
          <NeuroMemoryLock onGainXp={gainXp} />
        </motion.div>
      )}

      {/* TAB: FLASHCARDS (SPACED REPETITION) */}
      {activeTab === 'flashcards' && (
        <motion.div variants={fadeUp} key="tab-flashcards">
          <Flashcards onGainXp={gainXp} />
        </motion.div>
      )}

      {/* TAB 1: BOSS BATTLE (GAMIFIED ARENA) */}
      {activeTab === 'arena' && (
        <motion.div variants={fadeUp} key="tab-arena">
          <StudyBossArena onGainXp={gainXp} />
        </motion.div>
      )}

      {/* TAB 2: CYBER FOCUS LOUNGE (POMODORO & AMBIENT LO-FI) */}
      {activeTab === 'focus' && (
        <motion.div variants={fadeUp} key="tab-focus">
          <CyberFocusLounge onGainXp={gainXp} />
        </motion.div>
      )}

      {/* TAB 3: EXAM COMPRESSOR (AI & TIMETABLE) */}
      {activeTab === 'exam' && (
        <motion.div variants={fadeUp} key="tab-exam">
          <ExamCompressor />
        </motion.div>
      )}

      {/* TAB 4: IMAGINE 3D (ALGORITHM VISUALIZER) */}
      {activeTab === 'imagine' && (
        <motion.div variants={fadeUp} key="tab-imagine" id="imagine-mode">
          <ImagineMode />
        </motion.div>
      )}

      {/* TAB 5: REALITY LAB (PRACTICAL SCENARIOS) */}
      {activeTab === 'reality' && (
        <motion.div variants={fadeUp} key="tab-reality" className="space-y-6">
          <RealityLab />
          <IndexingMission />
        </motion.div>
      )}

      {/* TAB 6: SUBJECT ROOMS & SYLLABUS */}
      {activeTab === 'subjects' && (
        <motion.div variants={fadeUp} key="tab-subjects">
          {/* Study stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="stat-card">
              <p className="stat-label">Subjects</p>
              <p className="stat-value text-aurora">{demoSubjects.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Topics mastered</p>
              <p className="stat-value text-mint">{demoTopics.filter((t) => t.status === 'mastered').length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Learning</p>
              <p className="stat-value text-solar">{demoTopics.filter((t) => t.status === 'learning').length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Due for revision</p>
              <p className="stat-value text-rose">3</p>
            </div>
          </div>

          {/* Subjects grid */}
          <section className="mb-8">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Subject rooms</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {demoSubjects.map((subject) => (
                <motion.button
                  key={subject.id}
                  className="glass-card rounded-2xl p-5 text-left transition hover:scale-[1.01]"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSubject(activeSubject === subject.id ? null : subject.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[10px] tracking-wider" style={{ color: subject.color }}>
                        {subject.code}
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold text-white">
                        {subject.name}
                      </h3>
                    </div>
                    <span
                      className="font-display text-xl font-bold"
                      style={{ color: subject.color }}
                    >
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: subject.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                    <span>{subject.completed}/{subject.topics} topics</span>
                    <span>Next revision: {subject.nextRevision}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Topic map */}
          <section className="mb-8">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Topic map</h2>
            <div className="space-y-2">
              {demoTopics.map((topic) => {
                const m = masteryColors[topic.status];
                return (
                  <motion.div
                    key={topic.id}
                    className="glass-card flex items-center gap-4 rounded-xl p-4"
                    whileHover={{ x: 4 }}
                  >
                    {/* Mastery ring */}
                    <div className="relative h-11 w-11 flex-shrink-0">
                      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                        <circle
                          cx="20" cy="20" r="16"
                          fill="none"
                          stroke={m.text}
                          strokeWidth="3"
                          strokeDasharray={`${(topic.mastery / 100) * 100.5} 100.5`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: m.text }}>
                        {topic.mastery}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">{topic.name}</h3>
                      <p className="text-[11px] text-slate-500">{topic.subject} · {topic.difficulty}</p>
                    </div>

                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                      style={{ backgroundColor: m.bg, color: m.text }}
                    >
                      {m.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </motion.div>
      )}

      {/* TAB: ATTENDANCE TRACKER */}
      {activeTab === 'attendance' && (
        <motion.div variants={fadeUp} key="tab-attendance">
          <AttendanceTracker />
        </motion.div>
      )}

      {/* TAB: MARKS & SGPA CALCULATOR */}
      {activeTab === 'marks' && (
        <motion.div variants={fadeUp} key="tab-marks">
          <MarksCalculator />
        </motion.div>
      )}

      {/* Study tasks */}
      {tasks.length > 0 && (
        <motion.section variants={fadeUp} className="mt-8 border-t border-white/[0.08] pt-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Active Study Tasks</h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 text-sm">
                <span className={`status-dot ${task.status === 'progress' ? 'active' : 'pending'}`} />
                <span className="flex-1 text-slate-300">{task.title}</span>
                <span className="text-xs text-slate-500">{task.due}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
