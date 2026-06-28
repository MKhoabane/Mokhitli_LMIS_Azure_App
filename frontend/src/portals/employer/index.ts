import type { PortalDefinition } from '../shared/types';
import EmployerPortalPage from './pages/EmployerPortalPage';

const portal: PortalDefinition = {
  id: 'employer',
  name: 'Employer Portal',
  routePrefix: '/employer',
  summary: 'Coordinate workplace learning and stakeholder updates.',
  allowedRoles: ['employer'],
  component: EmployerPortalPage
};

export default portal;
