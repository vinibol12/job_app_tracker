import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { JobApplicationList } from '../../../src/components/JobApplicationList';
import { api } from '../../../src/services/api';
import toast from 'react-hot-toast';

// Mock the api module
jest.mock('../../../src/services/api', () => ({
  api: {
    getAllApplications: jest.fn(),
    updateApplication: jest.fn(),
    deleteApplication: jest.fn()
  }
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock window.confirm
window.confirm = jest.fn();

describe('JobApplicationList Component', () => {
  const mockOnApplicationDeleted = jest.fn();
  
  // Note: We're assuming these applications come pre-sorted from the backend
  // with highest ID first (most recent first)
  const mockApplications = [
    {
      id: 2,
      companyName: 'Test Company 2',
      position: 'Senior Developer',
      status: 'Interview',
      dateApplied: '2023-02-01T00:00:00.000Z'
    },
    {
      id: 1,
      companyName: 'Test Company 1',
      position: 'Developer',
      status: 'Applied',
      dateApplied: '2023-01-01T00:00:00.000Z'
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getAllApplications as jest.Mock).mockResolvedValue(mockApplications);
  });
  
  it('renders loading state initially', () => {
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('renders applications when loaded', async () => {
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check that applications are displayed in the order returned from the backend
    expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    
    // Check that applications appear in the order returned from backend
    const rows = screen.getAllByRole('row');
    // Header row is at index 0, so application rows start at index 1
    expect(rows[1].textContent).toContain('Test Company 2'); // ID: 2 should be first
    expect(rows[2].textContent).toContain('Test Company 1'); // ID: 1 should be second
    
    // Check status values
    const selects = screen.getAllByTestId('status-select');
    expect(selects[0]).toHaveValue('Interview'); // Test Company 2's status
    expect(selects[1]).toHaveValue('Applied');   // Test Company 1's status
  });
  
  it('handles status update correctly', async () => {
    const updatedApplication = {
      ...mockApplications[0], // Test Company 2 (id: 2) is first in our mock data
      status: 'Offer'
    };
    
    (api.updateApplication as jest.Mock).mockResolvedValue(updatedApplication);
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
    
    // Find and change status dropdown for first item (Test Company 2, id: 2)
    const selects = screen.getAllByTestId('status-select');
    await act(async () => {
      fireEvent.change(selects[0], { target: { value: 'Offer' } });
    });
    
    // Wait for update to complete
    await waitFor(() => {
      expect(api.updateApplication).toHaveBeenCalledWith({
        ...mockApplications[0], // Test Company 2
        status: 'Offer'
      });
      expect(toast.success).toHaveBeenCalledWith('Status updated to Offer');
    });
  });
  
  it('handles delete action when confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (api.deleteApplication as jest.Mock).mockResolvedValue({});
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
    
    // Find and click delete button for first item (Test Company 2, id: 2)
    const deleteButtons = screen.getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
    
    // Verify confirm dialog was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this application?');
    
    // Wait for delete to complete
    await waitFor(() => {
      expect(api.deleteApplication).toHaveBeenCalledWith(2); // Test Company 2's ID
      expect(toast.success).toHaveBeenCalledWith('Application deleted successfully');
      expect(mockOnApplicationDeleted).toHaveBeenCalled();
    });
  });
  
  it('does not delete when not confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
    
    expect(window.confirm).toHaveBeenCalled();
    expect(api.deleteApplication).not.toHaveBeenCalled();
  });
  
  it('handles error when API call fails', async () => {
    (api.updateApplication as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
    
    const selects = screen.getAllByTestId('status-select');
    await act(async () => {
      fireEvent.change(selects[0], { target: { value: 'Offer' } });
    });
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update status');
    });
  });
});
