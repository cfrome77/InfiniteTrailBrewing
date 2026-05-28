import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mock useRouter and usePathname
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/login',
}));

// Mock loginAction
jest.mock('@/app/login/actions', () => ({
  loginAction: jest.fn(),
}));

// Mock AuthProvider/useAuth
jest.mock('@/components/auth-provider', () => ({
    useAuth: () => ({ user: null, loading: false }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    // Check for the H1 specifically to avoid the footer link
    expect(screen.getByRole('heading', { name: /staff access/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
