import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signin from './Signin';
import { MemoryRouter } from 'react-router-dom';

// Mock the dependencies
jest.mock('./api-auth.js');
jest.mock('./auth-helper.js');

import { signin } from './api-auth.js';
import auth from './auth-helper.js';

// Mock Navigate component
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(({ to }) => {
        const React = require('react');
        return React.createElement('div', { 
            'data-testid': 'navigate', 
            'data-to': typeof to === 'string' ? to : JSON.stringify(to)
        });
    })
}));

describe('Signin Component Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Signin form and accepts input', () => {
        render(
            <MemoryRouter>
                <Signin />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');

        const submitBtn = screen.getByRole('button', { name: /submit/i });
        expect(submitBtn).toBeInTheDocument();
    });

    test('displays Sign In title', () => {
        render(
            <MemoryRouter>
                <Signin />
            </MemoryRouter>
        );

        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('handles successful signin', async () => {
        const mockSigninResponse = {
            token: 'mock-token',
            user: { _id: '123', name: 'Test User', email: 'test@example.com' }
        };
        
        signin.mockResolvedValue(mockSigninResponse);
        auth.authenticate.mockImplementation((data, callback) => callback());

        render(
            <MemoryRouter>
                <Signin />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitBtn = screen.getByRole('button', { name: /submit/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitBtn);

        expect(signin).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });

        await waitFor(() => {
            expect(auth.authenticate).toHaveBeenCalledWith(mockSigninResponse, expect.any(Function));
        });
    });

    test('displays error message on signin failure', async () => {
        const mockError = { error: 'Invalid credentials' };
        signin.mockResolvedValue(mockError);

        render(
            <MemoryRouter>
                <Signin />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitBtn = screen.getByRole('button', { name: /submit/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    test('redirects after successful signin', async () => {
        const mockSigninResponse = {
            token: 'mock-token',
            user: { _id: '123', name: 'Test User', email: 'test@example.com' }
        };
        
        signin.mockResolvedValue(mockSigninResponse);
        auth.authenticate.mockImplementation((data, callback) => callback());

        render(
            <MemoryRouter>
                <Signin />
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitBtn = screen.getByRole('button', { name: /submit/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '{"pathname":"/"}');
        });
    });

    test('handles empty form submission', async () => {
        signin.mockResolvedValue({});
        auth.authenticate.mockImplementation((data, callback) => callback());

        render(
            <MemoryRouter>
                <Signin />
            </MemoryRouter>
        );

        const submitBtn = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitBtn);

        expect(signin).toHaveBeenCalledWith({
            email: undefined,
            password: undefined
        });
    });
});