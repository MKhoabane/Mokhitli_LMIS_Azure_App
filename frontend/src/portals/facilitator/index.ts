import type { PortalDefinition } from '../shared/types';
import FacilitatorPortalPage from './pages/FacilitatorPortalPage';

const portal: PortalDefinition = {
  id: 'facilitator',
  name: 'Facilitator Portal',
  routePrefix: '/facilitator',
  summary: 'Manage learning delivery, cohorts, and attendance.',
  allowedRoles: ['facilitator'],
  component: FacilitatorPortalPage
};

export default portal;
