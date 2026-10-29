import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useAuraStore, WORLDS } from '../store/useAuraStore';
import DevNotes from '../components/DevNotes';

const seedNodes = [
  { id: 'dbms', label: 'DBMS', type: 'Subject', links: ['sql', 'normalization', 'aura'] },
  { id: 'sql', label: 'SQL', type: 'Concept', links: ['dbms', 'normalization'] },
  { id: 'normalization', label: 'Normalization', type: 'Concept', links: ['dbms', 'sql'] },
  { id: 'react', label: 'React', type: 'Skill', links: ['aura', 'career'] },
  { id: 'aura', label: 'AURA', type: 'Project', links: ['react', 'dbms', 'career'] },
  { id: 'career', label: 'Career goals', type: 'Goal', links: ['react', 'aura'] },
];

export default function KnowledgeWorld() {
  const world = WORLDS.find((item) => item.id === 'knowledge');
  const tasks = useAuraStore((state) => state.tasks);
  const [selectedId, setSelectedId] = useState('aura');
  const selected = seedNodes.find((node) => node.id === selectedId);
  const relatedTasks = useMemo(() => tasks.filter((task) => task.status !== 'done').slice(0, 4), [tasks]);

  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    <header className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ backgroundColor: `${world.color}18`, color: world.color }}>{world.icon}</div><div><h1 className="font-display text-2xl font-bold">Knowledge Observatory</h1><p className="text-sm text-slate-400">Trace ideas, projects and evidence in one place.</p></div></header>
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <section className="glass-strong min-h-[420px] rounded-2xl p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-display text-lg font-semibold">Concept map</h2><p className="mt-1 text-xs text-slate-500">Select a node to inspect its verified links.</p></div><span className="rounded-full bg-ice/10 px-3 py-1 text-xs text-ice">{seedNodes.length} nodes</span></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{seedNodes.map((node) => <button key={node.id} onClick={() => setSelectedId(node.id)} className={`rounded-2xl border p-5 text-left transition ${selectedId === node.id ? 'border-ice/60 bg-ice/10' : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05]'}`}><p className="font-display font-semibold text-white">{node.label}</p><p className="mt-1 text-[11px] text-slate-500">{node.type}</p><p className="mt-4 text-xs text-ice">{node.links.length} connections</p></button>)}</div></section>
      <aside className="space-y-6"><section className="glass-strong rounded-2xl p-5"><p className="section-label">Selected node</p><h2 className="mt-2 font-display text-xl font-semibold">{selected.label}</h2><p className="mt-1 text-xs text-slate-500">{selected.type}</p><div className="mt-5"><p className="text-xs text-slate-400">Connected to</p><div className="mt-2 flex flex-wrap gap-2">{selected.links.map((linkId) => <button key={linkId} onClick={() => setSelectedId(linkId)} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-ice">{seedNodes.find((node) => node.id === linkId)?.label}</button>)}</div></div></section><section className="glass-strong rounded-2xl p-5"><h2 className="font-display text-base font-semibold">Open work</h2><div className="mt-3 space-y-2">{relatedTasks.map((task) => <div key={task.id} className="rounded-lg bg-white/[0.03] p-3"><p className="text-sm text-slate-200">{task.title}</p><p className="mt-1 text-[10px] text-slate-500">{task.due}</p></div>)}</div></section></aside>
    </div>

    {/* Dev Notes */}
    <section className="rounded-3xl border border-cyan-500/20 bg-black/30 p-6">
      <DevNotes />
    </section>
  </motion.div>;
}
