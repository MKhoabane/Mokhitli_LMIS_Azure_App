import { useEffect, useState } from 'react';
import { portalRegistry } from './portals';
import PortalShell from './portals/shared/layouts/PortalShell';
import type { AuthSession, DashboardData } from './portals/shared/types';
import InvitationAcceptancePage from './pages/InvitationAcceptancePage';
import Login from './pages/Login';
import api from './services/api';

const DEFAULT_PORTAL_ID = portalRegistry[0]?.id || 'admin';
const AUTH_STORAGE_KEY = 'authSession';

function getPortalIdFromPath(pathname: string) {
  const matchedPortal = portalRegistry.find(
    (portal) => pathname === portal.routePrefix || pathname.startsWith(`${portal.routePrefix}/`)
  );

  return matchedPortal?.id || DEFAULT_PORTAL_ID;
}

function getStoredAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function getPortalRoute(portalId: string) {
  return portalRegistry.find((portal) => portal.id === portalId)?.routePrefix || '/';
}

function isPortalSubRoute(pathname: string, routePrefix: string) {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
}

function getAllowedPortals(role: string) {
  return portalRegistry.filter((portal) => portal.allowedRoles.includes(role));
}

function resolvePortalIdForRole(role: string, requestedPortalId?: string, preferredPortalId?: string) {
  const allowedPortals = getAllowedPortals(role);

  if (allowedPortals.length === 0) {
    return DEFAULT_PORTAL_ID;
  }

  if (requestedPortalId && allowedPortals.some((portal) => portal.id === requestedPortalId)) {
    return requestedPortalId;
  }

  if (preferredPortalId && allowedPortals.some((portal) => portal.id === preferredPortalId)) {
    return preferredPortalId;
  }

  return allowedPortals[0].id;
}

export default function App() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => getStoredAuthSession());
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [activePortalId, setActivePortalId] = useState(() => {
    const storedSession = getStoredAuthSession();
    if (window.location.pathname === '/' && storedSession) {
      return resolvePortalIdForRole(
        storedSession.user.role,
        storedSession.user.defaultPortal,
        storedSession.user.defaultPortal
      );
    }

    if (storedSession) {
      return resolvePortalIdForRole(
        storedSession.user.role,
        getPortalIdFromPath(window.location.pathname),
        storedSession.user.defaultPortal
      );
    }

    return getPortalIdFromPath(window.location.pathname);
  });

  useEffect(() => {
    if (!authSession) {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setDashboardData(null);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${authSession.token}`;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
    setDashboardLoading(true);

    api
      .get('/dashboard')
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch dashboard', error);
      })
      .finally(() => {
        setDashboardLoading(false);
      });
  }, [authSession]);

  const handleLogin = (session: AuthSession) => {
    const safePortalId = resolvePortalIdForRole(
      session.user.role,
      session.user.defaultPortal,
      session.user.defaultPortal
    );

    setAuthSession(session);
    setActivePortalId(safePortalId);
    window.history.replaceState({}, '', getPortalRoute(safePortalId));
  };

  const handleLogout = () => {
    delete api.defaults.headers.common.Authorization;
    setAuthSession(null);
    setDashboardData(null);
    setActivePortalId(DEFAULT_PORTAL_ID);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.history.replaceState({}, '', '/');
  };

  const availablePortals = authSession ? getAllowedPortals(authSession.user.role) : portalRegistry;
  const activePortal = availablePortals.find((portal) => portal.id === activePortalId) || availablePortals[0];

  useEffect(() => {
    const handlePopState = () => {
      const requestedPortalId = getPortalIdFromPath(window.location.pathname);

      if (!authSession) {
        setActivePortalId(requestedPortalId);
        return;
      }

      setActivePortalId(
        resolvePortalIdForRole(authSession.user.role, requestedPortalId, authSession.user.defaultPortal)
      );
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [authSession]);

  useEffect(() => {
    if (!authSession) {
      return;
    }

    setActivePortalId((currentPortalId) =>
      resolvePortalIdForRole(authSession.user.role, currentPortalId, authSession.user.defaultPortal)
    );
  }, [authSession]);

  useEffect(() => {
    if (!authSession || !activePortal) {
      return;
    }

    if (!isPortalSubRoute(window.location.pathname, activePortal.routePrefix)) {
      window.history.pushState({}, '', activePortal.routePrefix);
    }
  }, [activePortal, authSession]);

  if (!authSession && window.location.pathname.startsWith('/invite/')) {
    return <InvitationAcceptancePage onAccept={handleLogin} />;
  }

  if (!authSession) {
    return <Login onLogin={handleLogin} />;
  }

  if (!activePortal) {
    return null;
  }

  const ActivePortalComponent = activePortal.component;

  return (
    <PortalShell
      portals={availablePortals}
      activePortalId={activePortalId}
      onPortalChange={setActivePortalId}
      onLogout={handleLogout}
      authUser={authSession.user}
    >
      <ActivePortalComponent
        dashboardData={dashboardData}
        dashboardLoading={dashboardLoading}
      />
    </PortalShell>
  );
}
