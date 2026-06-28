import type { PortalDefinition } from '../shared/types';
import ModeratorPortalPage from './pages/ModeratorPortalPage';

const portal: PortalDefinition = {
  id: 'moderator',
  name: 'Moderator Portal',
  routePrefix: '/moderator',
  summary: 'Oversee moderation, compliance, and quality checks.',
  allowedRoles: ['moderator'],
  component: ModeratorPortalPage
};

export default portal;
