import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
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
    vi.mocked(api.post).mockReset();
  });

  it('renders the login screen when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/QCTO Learner Management System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Access Portal/i })).toBeInTheDocument();
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });

  it('shows a registration place for new users on the auth screen', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Register User/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register Company/i })).toBeInTheDocument();
  });

  it('allows the login password to be shown before sign in', () => {
    render(<App />);

    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /Show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /Hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('allows registration passwords to be shown before submitting', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Register User/i }));

    const registrationPasswordInput = screen.getByLabelText(/^Password$/i);
    expect(registrationPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /Show registration password/i }));
    expect(registrationPasswordInput).toHaveAttribute('type', 'text');

    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /Show confirm password/i }));
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('allows company admin passwords to be shown before submitting', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Register Company/i }));

    const adminPasswordInput = screen.getByLabelText(/Admin Password/i);
    expect(adminPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /Show admin password/i }));
    expect(adminPasswordInput).toHaveAttribute('type', 'text');

    const confirmAdminPasswordInput = screen.getByLabelText(/Confirm Admin Password/i);
    expect(confirmAdminPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /Show confirm admin password/i }));
    expect(confirmAdminPasswordInput).toHaveAttribute('type', 'text');
  });

  it('blocks weak passwords before submitting registration', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Register User/i }));
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Weak Password User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'weak.password.user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Register User/i }));

    expect(
      await screen.findByText(
        /Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character\./i
      )
    ).toBeInTheDocument();
    expect(vi.mocked(api.post)).not.toHaveBeenCalled();
  });

  it('updates the registration password checklist live while typing', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Register User/i }));

    expect(screen.getByText(/Password Rules/i)).toBeInTheDocument();
    expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/One uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/One lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/One number/i)).toBeInTheDocument();
    expect(screen.getByText(/One special character/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Strong@Pass123' } });

    expect(screen.getAllByText('OK')).toHaveLength(5);
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
      expect(screen.getByRole('heading', { name: /Learner Portal/i })).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/learner');
    expect(screen.getByRole('heading', { name: 'Thabo Mbeki' })).toBeInTheDocument();
  });
});
