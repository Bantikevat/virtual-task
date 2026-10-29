import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraStore, WORLDS } from '../../store/useAuraStore';

const worldIcons = {
  hub: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  career: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  ),
  study: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  life: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  knowledge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  ),
  universe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
};

export default function Sidebar() {
  const sidebarOpen = useAuraStore((s) => s.sidebarOpen);
  const toggleSidebar = useAuraStore((s) => s.toggleSidebar);
  const agents = useAuraStore((s) => s.agents);
  const location = useLocation();
  const activeAgents = agents.filter((a) => a.status === 'active');

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] bg-ink-deep/90 backdrop-blur-xl"
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ice/20 to-aurora/20 text-ice transition hover:from-ice/30 hover:to-aurora/30"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a10 10 0 0110 10" />
            <path d="M12 2a10 10 0 00-10 10" />
            <path d="M12 22a10 10 0 0010-10" />
            <path d="M12 22a10 10 0 01-10-10" />
          </svg>
        </button>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-baseline gap-2"
            >
              <span className="font-display text-lg font-bold tracking-wide text-white">AURA</span>
              <span className="font-mono text-[9px] tracking-widest text-ice/60">v1.0</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Universe link */}
      <div className="px-3 pb-2">
        <NavLink
          to="/universe"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
          }
        >
          {worldIcons.universe}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Virtual Universe
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      <div className="px-5">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* World links */}
      <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-3">
        {sidebarOpen && (
          <p className="section-label mb-2 px-4">Worlds</p>
        )}

        {WORLDS.map((world) => (
          <NavLink
            key={world.id}
            to={world.path}
            className={({ isActive }) =>
              `nav-link group ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
            }
          >
            <span style={{ color: location.pathname === world.path ? world.color : undefined }}>
              {worldIcons[world.id]}
            </span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-sm"
                >
                  {world.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {sidebarOpen && <div className="px-3 pb-3"><NavLink to="/agents" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="text-ice">✦</span><span className="text-sm">Agent Factory</span></NavLink></div>}

      {/* Agent status */}
      <div className="border-t border-white/[0.06] p-4">
        {sidebarOpen ? (
          <div className="space-y-2">
            <p className="section-label">Active agents</p>
            {activeAgents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="status-dot active" />
                <span>{agent.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {activeAgents.map((agent) => (
              <span key={agent.id} className="status-dot active" title={agent.name} />
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
