import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';

describe('Day Zero Admin Panel Acceptance Criteria', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/admin/login');
  });

  it('1 & 2: Renders Day Zero Login with 70:30 branding and ADMIN ACCESS panel', () => {
    render(<App />);

    // Check 70% left side branding
    expect(screen.getByText('THE FIRST COMMIT')).toBeInTheDocument();
    expect(screen.getByText('CONTROL ARCHITECTURE')).toBeInTheDocument();
    expect(screen.getAllByText(/DAY ZERO/i).length).toBeGreaterThan(0);

    // Check 30% right side form
    expect(screen.getByText('ADMIN ACCESS')).toBeInTheDocument();
    expect(screen.getByLabelText(/OPERATOR IDENTIFIER/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SECURITY KEY/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SIGN IN/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Forgot password\?/i })).toBeInTheDocument();
  });

  it('3: Submit empty form triggers validation error states', async () => {
    render(<App />);

    const userInput = screen.getByLabelText(/OPERATOR IDENTIFIER/i);
    const passInput = screen.getByLabelText(/SECURITY KEY/i);
    const submitBtn = screen.getByRole('button', { name: /SIGN IN/i });

    // Clear inputs
    fireEvent.change(userInput, { target: { value: '' } });
    fireEvent.change(passInput, { target: { value: '' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/OPERATOR USERNAME IS REQUIRED/i)).toBeInTheDocument();
      expect(screen.getByText(/SECURITY PASSPHRASE IS REQUIRED/i)).toBeInTheDocument();
    });
  });

  it('4: Submit invalid mock credentials shows error banner', async () => {
    render(<App />);

    const userInput = screen.getByLabelText(/OPERATOR IDENTIFIER/i);
    const passInput = screen.getByLabelText(/SECURITY KEY/i);
    const submitBtn = screen.getByRole('button', { name: /SIGN IN/i });

    fireEvent.change(userInput, { target: { value: 'invalid_operator' } });
    fireEvent.change(passInput, { target: { value: 'bad_key' } });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(
          screen.getByText(/Invalid credentials. Access restricted to authorized operators/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('5, 6, 7 & 8: Submit valid mock credentials redirects to /admin/dashboard and displays stats, operational status, activity, and sidebar', async () => {
    render(<App />);

    const userInput = screen.getByLabelText(/OPERATOR IDENTIFIER/i);
    const passInput = screen.getByLabelText(/SECURITY KEY/i);
    const submitBtn = screen.getByRole('button', { name: /SIGN IN/i });

    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'dayzero' } });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        // Dashboard header
        expect(screen.getByRole('heading', { name: 'DASHBOARD' })).toBeInTheDocument();
        expect(screen.getByText("What's happening across Day Zero.")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify Stats
    expect(screen.getAllByText('Products').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getAllByText('Contacts').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getAllByText('Missions').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('04')).toBeInTheDocument();

    // Verify Operational Status
    expect(screen.getByText(/SITE STATUS: OPERATIONAL/i)).toBeInTheDocument();
    expect(screen.getByText('99.98%')).toBeInTheDocument();

    // Verify Recent Activity
    expect(screen.getByText('Project Chimera v1.0 published')).toBeInTheDocument();
    expect(screen.getByText('Partnership dispatch from Quantum Labs')).toBeInTheDocument();
    expect(screen.getByText('Specter Audio Engine spec revised')).toBeInTheDocument();
    expect(screen.getByText('Orbital Relay Phase 2 milestone reached')).toBeInTheDocument();

    // Verify Quick Actions
    expect(screen.getByRole('button', { name: /New Product/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Mission/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Contacts/i })).toBeInTheDocument();

    // Verify Sidebar Structure
    expect(screen.getAllByText('OPERATIONS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CONTENT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ASSETS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('COMMUNICATION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ORGANIZATION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Alex Vance')).toBeInTheDocument();
    expect(screen.getByText('SUPER ADMIN')).toBeInTheDocument();
  });

  it('9: Logout returns to /admin/login', async () => {
    render(<App />);

    // Login first
    const userInput = screen.getByLabelText(/OPERATOR IDENTIFIER/i);
    const passInput = screen.getByLabelText(/SECURITY KEY/i);
    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'dayzero' } });
    fireEvent.click(screen.getByRole('button', { name: /SIGN IN/i }));

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'DASHBOARD' })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Click logout
    const logoutBtn = screen.getByTitle('Terminate Session');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByText('ADMIN ACCESS')).toBeInTheDocument();
    });
  });

  it('10 & 11: Forgot Password opens correctly, validates, and shows confirmation state', async () => {
    window.history.pushState({}, '', '/admin/forgot-password');
    render(<App />);

    expect(screen.getByText('FORGOT PASSWORD')).toBeInTheDocument();
    expect(screen.getByText('RESET ACCESS')).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/VERIFIED OPERATOR EMAIL/i);
    const resetBtn = screen.getByRole('button', { name: /Send reset link/i });

    // Empty validation
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.click(resetBtn);
    expect(screen.getByText(/EMAIL ADDRESS IS REQUIRED/i)).toBeInTheDocument();

    // Submit valid email
    fireEvent.change(emailInput, { target: { value: 'operator@dayzero.internal' } });
    fireEvent.click(resetBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/DISPATCH CONFIRMED/i)).toBeInTheDocument();
        expect(screen.getByText(/A password reset token has been dispatched/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
