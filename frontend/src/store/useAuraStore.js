import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { schedule } from '../lib/srs';

// ============================================
// AURA World Definitions
// ============================================
export const WORLDS = [
  {
    id: 'hub',
    name: 'Command Hub',
    subtitle: 'Your mission control center',
    description: 'Current priorities, pending approvals, agent activity, and quick access to every workspace.',
    icon: '⬡',
    color: '#e8c872',
    glowColor: 'rgba(232,200,114,0.12)',
    path: '/hub',
    position: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'career',
    name: 'Career World',
    subtitle: 'Professional development & opportunities',
    description: 'Job discovery, skill matching, application pipeline, interview prep and follow-up tracking.',
    icon: '◈',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.12)',
    path: '/career',
    position: { x: -4, y: 1, z: -1 },
  },
  {
    id: 'study',
    name: 'Study World',
    subtitle: 'Adaptive learning environment',
    description: 'Subject rooms, concept maps, interactive labs, practice questions and knowledge-to-reality mapping.',
    icon: '◉',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.12)',
    path: '/study',
    position: { x: 3, y: 2, z: 0.5 },
  },
  {
    id: 'project',
    name: 'Project World',
    subtitle: 'Development & creation workspace',
    description: 'Project structures, milestones, dependencies, agent assignments, code links and build status.',
    icon: '⬢',
    color: '#34d399',
    glowColor: 'rgba(52,211,153,0.12)',
    path: '/projects',
    position: { x: -2, y: -2, z: 1 },
  },
  {
    id: 'life',
    name: 'Personal Life',
    subtitle: 'Daily rhythm & personal goals',
    description: 'Calendar, routines, task lists, habits, reminders, weekly reflection and workload planning.',
    icon: '◎',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.12)',
    path: '/life',
    position: { x: 4, y: -1, z: -0.5 },
  },
  {
    id: 'knowledge',
    name: 'Knowledge Observatory',
    subtitle: 'Your personal knowledge graph',
    description: 'Explore concept relationships, trace sources, connect theory to real applications, find knowledge gaps.',
    icon: '◇',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.12)',
    path: '/knowledge',
    position: { x: 0, y: 3, z: 1.5 },
  },
];

// ============================================
// Demo data for initial prototype
// ============================================
const demoTasks = [
  { id: '1', title: 'Refine AURA virtual universe navigation', worldId: 'project', priority: 'high', status: 'progress', due: 'Today · 11:30', position: { x: -3, y: 0.4, z: 0.1 } },
  { id: '2', title: 'Research M.Tech entrance exam syllabus', worldId: 'study', priority: 'high', status: 'ready', due: 'Today · 14:00', position: { x: -1.2, y: 1.2, z: -0.3 } },
  { id: '3', title: 'Update resume with latest project', worldId: 'career', priority: 'medium', status: 'progress', due: 'Tomorrow', position: { x: 0.65, y: -0.4, z: 0.4 } },
  { id: '4', title: 'Review database normalization notes', worldId: 'study', priority: 'medium', status: 'ready', due: 'Oct 25', position: { x: 2.5, y: 1, z: -0.2 } },
  { id: '5', title: 'Morning exercise routine setup', worldId: 'life', priority: 'low', status: 'ready', due: 'Oct 26', position: { x: 3.25, y: -0.8, z: 0.1 } },
  { id: '6', title: 'Apply to 3 frontend dev positions', worldId: 'career', priority: 'high', status: 'ready', due: 'Oct 27', position: { x: -2, y: -1, z: 0.3 } },
  { id: '7', title: 'Build AURA agent factory prototype', worldId: 'project', priority: 'high', status: 'backlog', due: 'Oct 30', position: { x: 1.5, y: 0.5, z: -0.4 } },
  { id: '8', title: 'Practice SQL queries — joins & subqueries', worldId: 'study', priority: 'medium', status: 'ready', due: 'Oct 25', position: { x: -0.5, y: 2, z: 0.2 } },
];

const demoGoals = [
  { id: 'g1', title: 'Land a full-stack developer role', worldId: 'career', progress: 35, deadline: '2027-03-01' },
  { id: 'g2', title: 'Complete DBMS course with 90%+', worldId: 'study', progress: 42, deadline: '2027-01-15' },
  { id: 'g3', title: 'Ship AURA v1.0', worldId: 'project', progress: 15, deadline: '2027-06-01' },
  { id: 'g4', title: 'Establish daily exercise habit', worldId: 'life', progress: 20, deadline: '2027-02-01' },
];

const demoAgents = [
  { id: 'a1', name: 'CareerPilot', status: 'active', worldId: 'career', description: 'Job discovery and application tracking', lastRun: '2 hours ago' },
  { id: 'a2', name: 'StudyMate', status: 'idle', worldId: 'study', description: 'Adaptive learning and revision scheduling', lastRun: '1 day ago' },
  { id: 'a3', name: 'Guardian', status: 'active', worldId: 'hub', description: 'Permission enforcement and audit logging', lastRun: 'Always on' },
];

export const initialCareerProfile = {
  // ── Pre-filled from portfolio: https://portfolio-phi-puce-jpqqeoeu48.vercel.app/ ──
  fullName: 'Banti Kevat',
  email: 'bantikevat199@gmail.com',
  phone: '+91-6264466512',
  location: 'Ujjain, Madhya Pradesh, India',
  city: 'Ujjain',
  state: 'Madhya Pradesh',
  country: 'India',
  linkedin: 'https://linkedin.com/in/bantikevat',
  github: 'https://github.com/Bantikevat',
  portfolio: 'https://portfolio-phi-puce-jpqqeoeu48.vercel.app/',
  resumeName: 'Banti_Kevat_FullStack_Resume.pdf',
  currentCompany: 'Byteflow Tech',
  currentTitle: 'MERN Stack & WordPress Developer',
  experienceYears: '2',
  degree: 'M.Tech',
  university: 'Sam Global University',
  education: 'M.Tech in Artificial Intelligence & Machine Learning — Sam Global University (pursuing)',
  skills: 'React.js, Next.js, Node.js, Express.js, MongoDB, Tailwind CSS, Socket.io, JWT, RBAC, Nginx, AWS, MySQL, AI Agents, WordPress, Framer Motion, HTML5, CSS3, Bootstrap, RESTful APIs, Mongoose, Git & GitHub, Linux, Render, Netlify, Prompt Engineering',
  summary: 'Full Stack Developer with 2+ years of professional experience building and deploying production-grade web applications using React.js, Next.js, Node.js, Express.js and MongoDB. Experienced in REST APIs, authentication, Role-Based Access Control, ERP systems, inventory management, performance optimization and production deployment. Currently pursuing M.Tech in AI & ML while writing technical blogs on IT Info Hubs.',
  // Fields to fill in yourself: dob, gender, address, pincode, currentCtc, expectedCtc, noticePeriod, graduationYear, percentage, whyJoin
  dob: '', gender: '', address: '', pincode: '',
  currentCtc: '', expectedCtc: '', noticePeriod: '',
  graduationYear: '', percentage: '', whyJoin: '',
};

// ============================================
// Zustand Store — AURA State
// ============================================
export const useAuraStore = create(persist((set, get) => ({
  // Navigation
  currentWorld: 'hub',
  viewMode: '3d', // '3d' | 'panel'
  sidebarOpen: true,

  setCurrentWorld: (worldId) => set({ currentWorld: worldId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Tasks
  tasks: demoTasks,
  selectedTaskId: null,

  selectTask: (id) => set({ selectedTaskId: id }),
  addTask: (task) => set((s) => ({
    tasks: [
      {
        ...task,
        id: crypto.randomUUID(),
        status: 'ready',
        due: task.due || 'No deadline',
        position: {
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 3,
          z: 0,
        },
      },
      ...s.tasks,
    ],
  })),
  updateTask: (id, updates) => set((s) => ({
    tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  completeTask: (id) => set((s) => ({
    tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: 'done' } : t)),
  })),

  // Goals
  goals: demoGoals,

  // Agents
  agents: demoAgents,
  createAgent: ({ name, objective, worldId, tools }) => set((state) => ({
    agents: [{
      id: crypto.randomUUID(),
      name,
      objective,
      worldId,
      tools,
      status: 'paused',
      description: objective,
      lastRun: 'Not run yet',
      version: 1,
    }, ...state.agents],
  })),
  setAgentStatus: (id, status) => set((state) => ({
    agents: state.agents.map((agent) => agent.id === id ? { ...agent, status } : agent),
  })),

  // Career application assistant (local-first, review before submission)
  careerProfile: initialCareerProfile,
  applicationDrafts: [],
  saveCareerProfile: (profile) => set({ careerProfile: profile }),
  createApplicationDraft: ({ title, company, jobUrl }) => set((state) => ({
    applicationDrafts: [{
      id: crypto.randomUUID(), title, company, jobUrl,
      status: 'awaiting-review', createdAt: new Date().toISOString(),
    }, ...state.applicationDrafts],
  })),
  setApplicationStatus: (id, status) => set((state) => ({
    applicationDrafts: state.applicationDrafts.map((draft) => draft.id === id
      ? { ...draft, status, updatedAt: new Date().toISOString(), ...(status === 'applied' && !draft.appliedAt ? { appliedAt: new Date().toISOString() } : {}) }
      : draft),
  })),
  removeApplicationDraft: (id) => set((state) => ({
    applicationDrafts: state.applicationDrafts.filter((draft) => draft.id !== id),
  })),

  // Exam Compressor: { exam, date: 'YYYY-MM-DD', hours, topics: [{ id, name, weight 1-10, level 0-5, doneOn?, revDone? }] }
  examPlan: null,
  saveExamPlan: (plan) => set({ examPlan: plan }),
  updateExamTopic: (id, patch) => set((state) => ({
    examPlan: state.examPlan && { ...state.examPlan, topics: state.examPlan.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)) },
  })),
  clearExamPlan: () => set({ examPlan: null }),

  // Personal assistant memory: short notes about how the user works and what they prefer.
  assistantMemory: [],
  addAssistantMemory: (note) => set((state) => ({
    assistantMemory: state.assistantMemory.some((m) => m.note === note)
      ? state.assistantMemory
      : [...state.assistantMemory, { id: crypto.randomUUID(), note, createdAt: new Date().toISOString() }].slice(-40),
  })),
  removeAssistantMemory: (id) => set((state) => ({ assistantMemory: state.assistantMemory.filter((m) => m.id !== id) })),

  // Cross-tab bridge: ask the Concept Universe (Imagine) tab to open a topic. Transient (not persisted).
  pendingImagineTopic: null,
  requestImagine: (topic) => set({ pendingImagineTopic: topic }),
  clearPendingImagine: () => set({ pendingImagineTopic: null }),

  // Flashcards with spaced repetition (SM-2). Generated by AI, reviewed & scheduled locally.
  flashcards: [],
  addFlashcards: (cards, topic = '') => set((state) => ({
    flashcards: [
      ...cards.map((c) => ({
        id: crypto.randomUUID(), front: c.front, back: c.back, topic,
        ease: 2.5, interval: 0, reps: 0, due: null, createdAt: new Date().toISOString(),
      })),
      ...state.flashcards,
    ],
  })),
  reviewFlashcard: (id, quality) => set((state) => ({
    flashcards: state.flashcards.map((c) => (c.id === id ? schedule(c, quality) : c)),
  })),
  removeFlashcard: (id) => set((state) => ({ flashcards: state.flashcards.filter((c) => c.id !== id) })),
  clearFlashcards: () => set({ flashcards: [] }),

  // AURA Reality Learning Engine records
  learningRecords: [],
  recordLearning: (record) => set((state) => ({
    learningRecords: [{ id: crypto.randomUUID(), completedAt: new Date().toISOString(), ...record }, ...state.learningRecords],
  })),

  // Attendance Tracker — Indian 75% rule per subject
  attendanceSubjects: [],
  setAttendanceSubjects: (subjects) => set({ attendanceSubjects: subjects }),

  // Daily Routine Planner
  routineBlocks: [],
  setRoutineBlocks: (blocks) => set({ routineBlocks: blocks }),

  // Dev Notes — code snippets, ideas, API tricks
  devNotes: [],
  setDevNotes: (notes) => set({ devNotes: notes }),

  // Cloud sync: snapshot the user's data out, and merge a snapshot back in.
  exportSnapshot: () => {
    const s = get();
    return {
      tasks: s.tasks, goals: s.goals, agents: s.agents,
      careerProfile: s.careerProfile, applicationDrafts: s.applicationDrafts,
      assistantMemory: s.assistantMemory, examPlan: s.examPlan,
      flashcards: s.flashcards, learningRecords: s.learningRecords, viewMode: s.viewMode,
    };
  },
  importSnapshot: (data) => set((state) => ({
    tasks: Array.isArray(data?.tasks) ? data.tasks : state.tasks,
    goals: Array.isArray(data?.goals) ? data.goals : state.goals,
    agents: Array.isArray(data?.agents) ? data.agents : state.agents,
    careerProfile: data?.careerProfile ? { ...state.careerProfile, ...data.careerProfile } : state.careerProfile,
    applicationDrafts: Array.isArray(data?.applicationDrafts) ? data.applicationDrafts : state.applicationDrafts,
    assistantMemory: Array.isArray(data?.assistantMemory) ? data.assistantMemory : state.assistantMemory,
    examPlan: data?.examPlan ?? state.examPlan,
    flashcards: Array.isArray(data?.flashcards) ? data.flashcards : state.flashcards,
    learningRecords: Array.isArray(data?.learningRecords) ? data.learningRecords : state.learningRecords,
  })),

  // Time
  getGreeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  },

  getFormattedDate: () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  },

  getFormattedTime: () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  },

  // Stats
  getStats: () => {
    const tasks = get().tasks;
    const open = tasks.filter((t) => t.status !== 'done');
    const done = tasks.length - open.length;
    const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'done');
    return { total: tasks.length, open: open.length, done, highPriority: highPriority.length };
  },

  getTasksByWorld: (worldId) => {
    return get().tasks.filter((t) => t.worldId === worldId && t.status !== 'done');
  },
}), {
  name: 'aura-workspace',
  partialize: (state) => ({
    tasks: state.tasks,
    goals: state.goals,
    agents: state.agents,
    careerProfile: state.careerProfile,
    applicationDrafts: state.applicationDrafts,
    assistantMemory: state.assistantMemory,
    examPlan: state.examPlan,
    flashcards: state.flashcards,
    learningRecords: state.learningRecords,
    viewMode: state.viewMode,
  }),
  // Migrate: if profile is empty (older install), fill it with portfolio defaults.
  migrate: (persisted) => {
    if (!persisted.careerProfile?.fullName && !persisted.careerProfile?.email) {
      persisted.careerProfile = { ...initialCareerProfile, ...persisted.careerProfile };
    }
    return persisted;
  },
  version: 2,
}));
