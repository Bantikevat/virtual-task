import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuraStore } from '../store/useAuraStore';

const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#fb7185', '#38bdf8', '#e8c872'];
const NODE_W = 140;
const NODE_H = 44;

function uid() { return Math.random().toString(36).slice(2, 9); }

const DEFAULT_MAP = {
  id: 'root',
  title: 'AURA Mind Map',
  nodes: [
    { id: uid(), label: 'Main Topic', x: 400, y: 260, color: '#e8c872', parent: null, isRoot: true },
  ],
};

export default function MindMap() {
  const maps = useAuraStore((s) => s.mindMaps ?? [DEFAULT_MAP]);
  const setMaps = useAuraStore((s) => s.setMindMaps);
  const [activeMapId, setActiveMapId] = useState(maps[0]?.id);

  const activeMap = maps.find((m) => m.id === activeMapId) ?? maps[0];
  const nodes = activeMap?.nodes ?? [];

  function updateMap(newNodes) {
    setMaps(maps.map((m) => m.id === activeMap.id ? { ...m, nodes: newNodes } : m));
  }

  const svgRef = useRef(null);
  const dragging = useRef(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [addingChild, setAddingChild] = useState(null);
  const [newLabel, setNewLabel] = useState('');
  const [newMapName, setNewMapName] = useState('');
  const [creatingMap, setCreatingMap] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 900, h: 600 });

  // Drag node
  const onMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    setSelected(id);
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const node = nodes.find((n) => n.id === id);
    dragging.current = { id, ox: svgP.x - node.x, oy: svgP.y - node.y };
  }, [nodes]);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const { id, ox, oy } = dragging.current;
    updateMap(nodes.map((n) => n.id === id ? { ...n, x: svgP.x - ox, y: svgP.y - oy } : n));
  }, [nodes, updateMap]);

  const onMouseUp = useCallback(() => { dragging.current = null; }, []);

  function addChild(parentId) {
    if (!newLabel.trim()) return;
    const parent = nodes.find((n) => n.id === parentId);
    const childCount = nodes.filter((n) => n.parent === parentId).length;
    const angle = (childCount * 60 - 90) * (Math.PI / 180);
    const dist = 200;
    const colorIdx = nodes.length % COLORS.length;
    const newNode = {
      id: uid(),
      label: newLabel.trim(),
      x: parent.x + Math.cos(angle) * dist,
      y: parent.y + Math.sin(angle) * dist,
      color: COLORS[colorIdx],
      parent: parentId,
      isRoot: false,
    };
    updateMap([...nodes, newNode]);
    setNewLabel('');
    setAddingChild(null);
  }

  function deleteNode(id) {
    const toDelete = new Set();
    function collect(nid) {
      toDelete.add(nid);
      nodes.filter((n) => n.parent === nid).forEach((n) => collect(n.id));
    }
    collect(id);
    updateMap(nodes.filter((n) => !toDelete.has(n.id)));
    setSelected(null);
  }

  function startEdit(node) {
    setEditing(node.id);
    setEditLabel(node.label);
  }

  function saveEdit() {
    if (!editLabel.trim()) return;
    updateMap(nodes.map((n) => n.id === editing ? { ...n, label: editLabel.trim() } : n));
    setEditing(null);
  }

  function changeColor(id, color) {
    updateMap(nodes.map((n) => n.id === id ? { ...n, color } : n));
  }

  function addMap() {
    if (!newMapName.trim()) return;
    const newMap = {
      id: uid(),
      title: newMapName.trim(),
      nodes: [{ id: uid(), label: newMapName.trim(), x: 400, y: 260, color: '#e8c872', parent: null, isRoot: true }],
    };
    setMaps([...maps, newMap]);
    setActiveMapId(newMap.id);
    setNewMapName('');
    setCreatingMap(false);
  }

  function deleteMap(id) {
    if (maps.length <= 1) return;
    const remaining = maps.filter((m) => m.id !== id);
    setMaps(remaining);
    setActiveMapId(remaining[0].id);
  }

  const selectedNode = nodes.find((n) => n.id === selected);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-black text-white">Mind Map</h2>
          <p className="text-xs text-slate-400">Topics drag karo, click karke badhao, double-click se edit</p>
        </div>
        <button onClick={() => setCreatingMap(true)}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2 text-xs font-black text-white hover:scale-105 transition">
          + New Map
        </button>
      </div>

      {/* Map tabs */}
      <div className="flex flex-wrap gap-2">
        {maps.map((m) => (
          <div key={m.id} className="flex items-center gap-1">
            <button onClick={() => setActiveMapId(m.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${activeMapId === m.id ? 'border-violet-400/50 bg-violet-500/20 text-violet-300' : 'border-white/10 text-slate-500 hover:text-white'}`}>
              {m.title}
            </button>
            {maps.length > 1 && (
              <button onClick={() => deleteMap(m.id)} className="text-slate-700 hover:text-rose-400 text-sm transition">×</button>
            )}
          </div>
        ))}
        {creatingMap && (
          <div className="flex items-center gap-1.5">
            <input value={newMapName} onChange={(e) => setNewMapName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMap()}
              placeholder="Map name..."
              autoFocus
              className="rounded-xl border border-violet-400/50 bg-black/40 px-3 py-1.5 text-xs text-white outline-none w-32" />
            <button onClick={addMap} className="rounded-lg bg-violet-500 px-2 py-1.5 text-xs font-black text-white">Add</button>
            <button onClick={() => setCreatingMap(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
          </div>
        )}
      </div>

      {/* SVG canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080810]" style={{ height: 500 }}>
        <svg
          ref={svgRef}
          width="100%" height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onClick={() => { setSelected(null); setAddingChild(null); }}
          className="cursor-default"
        >
          {/* Grid dots */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="0.8" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          {nodes.filter((n) => n.parent).map((n) => {
            const parent = nodes.find((p) => p.id === n.parent);
            if (!parent) return null;
            const x1 = parent.x + NODE_W / 2, y1 = parent.y + NODE_H / 2;
            const x2 = n.x + NODE_W / 2, y2 = n.y + NODE_H / 2;
            const cx = (x1 + x2) / 2;
            return (
              <path key={n.id + '-edge'}
                d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                stroke={n.color + '60'} strokeWidth="2" fill="none" />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseDown={(e) => onMouseDown(e, node.id)}
              onDoubleClick={(e) => { e.stopPropagation(); startEdit(node); }}
              onClick={(e) => { e.stopPropagation(); setSelected(node.id); setAddingChild(null); }}
              style={{ cursor: 'grab' }}>
              {/* Glow */}
              {selected === node.id && (
                <rect x="-4" y="-4" width={NODE_W + 8} height={NODE_H + 8} rx="14"
                  fill="none" stroke={node.color} strokeWidth="2" opacity="0.5" />
              )}
              {/* Box */}
              <rect width={NODE_W} height={NODE_H} rx="10"
                fill={node.isRoot ? node.color + '30' : '#0e0e1a'}
                stroke={node.color}
                strokeWidth={node.isRoot ? 2 : 1.5}
              />
              {/* Label */}
              {editing === node.id ? (
                <foreignObject x="6" y="8" width={NODE_W - 12} height={NODE_H - 16}>
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null); }}
                    onBlur={saveEdit}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: 11, fontWeight: 600, width: '100%' }}
                  />
                </foreignObject>
              ) : (
                <text x={NODE_W / 2} y={NODE_H / 2 + 4} textAnchor="middle"
                  fill={node.isRoot ? node.color : '#f8fafc'} fontSize="11" fontWeight={node.isRoot ? '800' : '600'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {node.label.length > 16 ? node.label.slice(0, 15) + '…' : node.label}
                </text>
              )}
              {/* + button */}
              {selected === node.id && (
                <g onClick={(e) => { e.stopPropagation(); setAddingChild(node.id); setNewLabel(''); }}>
                  <circle cx={NODE_W + 10} cy={NODE_H / 2} r="10" fill={node.color} opacity="0.9" />
                  <text x={NODE_W + 10} y={NODE_H / 2 + 4} textAnchor="middle" fill="#000" fontSize="14" fontWeight="900"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>+</text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Tips */}
        <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] text-slate-600">
          <span>Drag = move</span>
          <span>Click = select</span>
          <span>Double-click = edit</span>
          <span>+ = add child</span>
        </div>
      </div>

      {/* Selected node controls */}
      {selectedNode && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/40 px-4 py-3">
          <span className="text-xs font-bold text-white">"{selectedNode.label}"</span>
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button key={c} onClick={() => changeColor(selected, c)}
                className={`h-4 w-4 rounded-full transition ${selectedNode.color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-black' : 'opacity-50 hover:opacity-100'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <button onClick={() => startEdit(selectedNode)}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-400 hover:text-white transition">Edit</button>
          {!selectedNode.isRoot && (
            <button onClick={() => deleteNode(selected)}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/20 transition">
              Delete
            </button>
          )}
        </div>
      )}

      {/* Add child input */}
      {addingChild && (
        <div className="flex items-center gap-2 rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3">
          <span className="text-xs text-mint font-bold">Child node:</span>
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addChild(addingChild); if (e.key === 'Escape') setAddingChild(null); }}
            placeholder="Label likho... (Enter = add)"
            autoFocus
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-mint" />
          <button onClick={() => addChild(addingChild)} className="rounded-xl bg-mint px-3 py-1.5 text-xs font-black text-slate-950">Add</button>
          <button onClick={() => setAddingChild(null)} className="text-slate-500 hover:text-white text-sm">✕</button>
        </div>
      )}
    </div>
  );
}
