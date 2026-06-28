import type { PortalDefinition } from '../shared/types';
import AdminPortalPage from './pages/AdminPortalPage';

const portal: PortalDefinition = {
  id: 'admin',
  name: 'Admin Portal',
  routePrefix: '/admin',
  summary: 'Monitor enterprise operations, delivery, and platform status.',
  allowedRoles: ['admin'],
  component: AdminPortalPage
};

export default portal;
