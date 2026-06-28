import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    vi.mocked(api.get).mockReset();
  });

  it('renders the login screen when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/QCTO Learner Management System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Access Portal/i })).toBeInTheDocument();
  });

  it('redirects an authenticated user away from a portal outside their role', async () => {
    localStorage.setItem(
      'authSession',
      JSON.stringify({
        token: 'demo-token',
        user: {
          id: 102,
          name: 'Thabo Mbeki',
          email: 'learner@mokhitli.com',
          role: 'learner',
          defaultPortal: 'learner'
        }
      })
    );
    window.history.replaceState({}, '', '/admin');

    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url === '/dashboard') {
        return Promise.resolve({
          data: {
            learners: [],
            courses: [],
            recentSubmissions: [],
            infrastructure: {},
            modules: []
          }
        });
      }

      if (url === '/learner-management/portal/learner') {
        return Promise.resolve({
          data: {
            learner: {
              id: 'LRN-1001',
              name: 'Thabo Mbeki',
              programme: 'Occupational Certificate: Logistics Management',
              nqfLevel: 5,
              facilitator: 'Nomsa Dlamini'
            },
            progress: [],
            upcomingAssessments: [],
            certificates: []
          }
        });
      }

      return Promise.reject(new Error(`Unexpected url: ${url}`));
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Learner Portal/i)).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/learner');
    expect(screen.getByText('Thabo Mbeki')).toBeInTheDocument();
  });
});
