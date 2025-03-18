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
  
  const mockApplications = [
    {
      id: 1,
      companyName: 'Test Company 1',
      position: 'Developer',
      status: 'Applied',
      dateApplied: '2023-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      companyName: 'Test Company 2',
      position: 'Senior Developer',
      status: 'Interview',
      dateApplied: '2023-02-01T00:00:00.000Z'
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
  
  it('renders the application list after loading', async () => {
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(api.getAllApplications).toHaveBeenCalled();
    });
    
    // Check if the applications are rendered
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    
    // Check if status selects are rendered with correct values
    const selects = screen.getAllByTestId('status-select');
    expect(selects[0]).toHaveValue('Applied');
    expect(selects[1]).toHaveValue('Interview');
  });
  
  it('handles status update correctly', async () => {
    const updatedApplication = {
      ...mockApplications[0],
      status: 'Interview'
    };
    
    (api.updateApplication as jest.Mock).mockResolvedValue(updatedApplication);
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });
    
    // Find and change status dropdown
    const selects = screen.getAllByTestId('status-select');
    await act(async () => {
      fireEvent.change(selects[0], { target: { value: 'Interview' } });
    });
    
    // Wait for update to complete
    await waitFor(() => {
      expect(api.updateApplication).toHaveBeenCalledWith({
        ...mockApplications[0],
        status: 'Interview'
      });
      expect(toast.success).toHaveBeenCalledWith('Status updated to Interview');
    });
  });
  
  it('handles delete action when confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (api.deleteApplication as jest.Mock).mockResolvedValue({});
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });
    
    // Find and click delete buttons
    const deleteButtons = screen.getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
    
    // Verify confirm dialog was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this application?');
    
    // Wait for delete to complete
    await waitFor(() => {
      expect(api.deleteApplication).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Application deleted successfully');
      expect(mockOnApplicationDeleted).toHaveBeenCalled();
    });
  });
  
  it('does not delete when cancel is clicked', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });
    
    // Find and click delete buttons
    const deleteButtons = screen.getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
    
    // Verify confirm dialog was shown
    expect(window.confirm).toHaveBeenCalled();
    
    // API should not be called
    expect(api.deleteApplication).not.toHaveBeenCalled();
    expect(mockOnApplicationDeleted).not.toHaveBeenCalled();
  });
  
  it('handles error when API call fails', async () => {
    (api.updateApplication as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<JobApplicationList onApplicationDeleted={mockOnApplicationDeleted} />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    });
    
    // Find and change status dropdown
    const selects = screen.getAllByTestId('status-select');
    await act(async () => {
      fireEvent.change(selects[0], { target: { value: 'Interview' } });
    });
    
    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update status');
    });
  });
});
