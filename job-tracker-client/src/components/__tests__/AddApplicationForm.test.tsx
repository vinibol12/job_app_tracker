import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddApplicationForm } from '../AddApplicationForm';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('react-hot-toast');

const mockApi = api as jest.Mocked<typeof api>;

describe('AddApplicationForm', () => {
    const mockOnAdded = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockApi.createApplication.mockResolvedValue({
            id: 1,
            companyName: 'Test Company',
            position: 'Developer',
            status: 'Applied',
            dateApplied: new Date().toISOString()
        });
    });

    it('submits form with correct data', async () => {
        render(<AddApplicationForm onApplicationAdded={mockOnAdded} />);

        // Fill out form
        await userEvent.type(screen.getByLabelText(/company name/i), 'Test Company');
        await userEvent.type(screen.getByLabelText(/position/i), 'Developer');

        // Submit form
        const submitButton = screen.getByRole('button', { name: /add application/i });
        await userEvent.click(submitButton);

        // Wait for form submission and state updates
        await waitFor(() => {
            expect(mockApi.createApplication).toHaveBeenCalledWith(expect.objectContaining({
                companyName: 'Test Company',
                position: 'Developer',
                status: 'Applied'
            }));
            expect(mockOnAdded).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Application added successfully');
            
            // Verify form was reset
            const companyInput = screen.getByLabelText(/company name/i) as HTMLInputElement;
            const positionInput = screen.getByLabelText(/position/i) as HTMLInputElement;
            expect(companyInput.value).toBe('');
            expect(positionInput.value).toBe('');
        });
    });

    it('shows validation errors for empty fields', async () => {
        render(<AddApplicationForm onApplicationAdded={mockOnAdded} />);

        // Try to submit empty form
        const submitButton = screen.getByRole('button', { name: /add application/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockApi.createApplication).not.toHaveBeenCalled();
            expect(mockOnAdded).not.toHaveBeenCalled();
        });
    });
}); 