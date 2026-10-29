import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Universe from './pages/Universe';
import CommandHub from './pages/CommandHub';
import CareerWorld from './pages/CareerWorld';
import StudyWorld from './pages/StudyWorld';
import ProjectWorld from './pages/ProjectWorld';
import LifeWorld from './pages/LifeWorld';
import KnowledgeWorld from './pages/KnowledgeWorld';
import AgentFactory from './pages/AgentFactory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/hub" replace /> },
      { path: 'hub', element: <CommandHub /> },
      { path: 'universe', element: <Universe /> },
      { path: 'career', element: <CareerWorld /> },
      { path: 'study', element: <StudyWorld /> },
      { path: 'projects', element: <ProjectWorld /> },
      { path: 'life', element: <LifeWorld /> },
      { path: 'knowledge', element: <KnowledgeWorld /> },
      { path: 'agents', element: <AgentFactory /> },
    ],
  },
]);

export default router;
