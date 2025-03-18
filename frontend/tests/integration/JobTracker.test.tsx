import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../../src/App';
import { server } from '../setup/mocks/server';
import { resetApplications } from '../setup/mocks/handlers';

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

        // Wait for the new application to appear
        // Since the backend sorts by newest first, the new company should be visible on the first page
        await waitFor(() => {
            expect(screen.getByText('New Company')).toBeInTheDocument();
            expect(screen.getByText('Senior Developer')).toBeInTheDocument();
        });

        // Edit company name
        const companyNameElement = screen.getByText('New Company');
        await userEvent.click(companyNameElement);
        
        // Now there should be an input field
        const editInput = screen.getByTestId('edit-company-input');
        await userEvent.clear(editInput);
        await userEvent.type(editInput, 'Updated Company');
        await userEvent.tab(); // Blur the field to trigger save
        
        // Wait for the update to appear
        await waitFor(() => {
            expect(screen.getByText('Updated Company')).toBeInTheDocument();
        });

        // Update status
        const statusSelects = screen.getAllByTestId('status-select');
        // Since the updated company should be at the top (backend sorting), we can select the first status select
        const updatedCompanySelect = statusSelects[0]; 
        await userEvent.selectOptions(updatedCompanySelect, 'Interview');

        // Delete application
        window.confirm = jest.fn(() => true);
        const deleteButtons = screen.getAllByTestId('delete-button');
        // Since the updated company should be at the top (backend sorting), we can select the first delete button
        const updatedCompanyDeleteButton = deleteButtons[0];
        await userEvent.click(updatedCompanyDeleteButton);

        // Verify deletion
        await waitFor(() => {
            expect(screen.queryByText('Updated Company')).not.toBeInTheDocument();
        });
    });
});