import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { server } from '../../mocks/server';
import { resetApplications } from '../../mocks/handlers';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    server.resetHandlers();
    resetApplications();
});
afterAll(() => server.close());

describe('Job Tracker Integration', () => {
    it('performs full CRUD workflow', async () => {
        render(<App />);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Existing Company')).toBeInTheDocument();
        });

        // Create new application
        const companyNameInput = screen.getByLabelText(/company name/i);
        const positionInput = screen.getByLabelText(/position/i);
        const submitButton = screen.getByText(/add application/i);

        // Fill and submit form
        await userEvent.type(companyNameInput, 'New Company');
        await userEvent.type(positionInput, 'Senior Developer');
        await userEvent.click(submitButton);

        // Wait for the success toast and new application to appear
        await waitFor(() => {
            expect(screen.getByText('Application added successfully')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('New Company')).toBeInTheDocument();
            expect(screen.getByText('Senior Developer')).toBeInTheDocument();
        });

        // Update status
        const statusSelects = screen.getAllByRole('combobox');
        const newCompanySelect = statusSelects[statusSelects.length - 1];
        await userEvent.selectOptions(newCompanySelect, 'Interview');

        // Delete application
        window.confirm = jest.fn(() => true);
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        const lastDeleteButton = deleteButtons[deleteButtons.length - 1];
        await userEvent.click(lastDeleteButton);

        // Verify deletion
        await waitFor(() => {
            expect(screen.queryByText('New Company')).not.toBeInTheDocument();
        });
    });
}); 