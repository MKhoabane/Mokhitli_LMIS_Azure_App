import type { PortalDefinition } from '../shared/types';
import AssessorPortalPage from './pages/AssessorPortalPage';

const portal: PortalDefinition = {
  id: 'assessor',
  name: 'Assessor Portal',
  routePrefix: '/assessor',
  summary: 'Review evidence, assessments, and marking workflows.',
  allowedRoles: ['assessor'],
  component: AssessorPortalPage
};

export default portal;
