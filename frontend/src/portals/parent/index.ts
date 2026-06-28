import type { PortalDefinition } from '../shared/types';
import ParentPortalPage from './pages/ParentPortalPage';

const portal: PortalDefinition = {
  id: 'parent',
  name: 'Parent Portal',
  routePrefix: '/parent',
  summary: 'Stay informed on learner attendance and milestones.',
  allowedRoles: ['parent'],
  component: ParentPortalPage
};

export default portal;
