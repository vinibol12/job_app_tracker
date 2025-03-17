import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobApplicationList } from '../JobApplicationList';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

jest.mock('../../services/api');
jest.mock('react-hot-toast');
const mockApi = api as jest.Mocked<typeof api>;

describe('JobApplicationList', () => {
    const mockApplications = [
        {
            id: 1,
            companyName: 'Test Company',
            position: 'Developer',
            status: 'Applied',
            dateApplied: new Date().toISOString()
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockApi.getAllApplications.mockResolvedValue(mockApplications);
    });

    it('renders applications list', async () => {
        render(<JobApplicationList onApplicationDeleted={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('Test Company')).toBeInTheDocument();
            expect(screen.getByText('Developer')).toBeInTheDocument();
        });
    });

    it('handles delete', async () => {
        const mockOnDelete = jest.fn();
        window.confirm = jest.fn(() => true);
        
        render(<JobApplicationList onApplicationDeleted={mockOnDelete} />);

        await waitFor(() => {
            expect(screen.getByText('Test Company')).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(mockApi.deleteApplication).toHaveBeenCalledWith(1);
            expect(mockOnDelete).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
        });
    });
}); 