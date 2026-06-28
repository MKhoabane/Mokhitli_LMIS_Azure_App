import type { PortalDefinition } from '../shared/types';
import LearnerPortalPage from './pages/LearnerPortalPage';

const portal: PortalDefinition = {
  id: 'learner',
  name: 'Learner Portal',
  routePrefix: '/learner',
  summary: 'Track learner progress, schedules, and evidence.',
  allowedRoles: ['learner'],
  component: LearnerPortalPage
};

export default portal;
