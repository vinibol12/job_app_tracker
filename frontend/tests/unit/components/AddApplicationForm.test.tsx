import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddApplicationForm } from '../../../src/components/AddApplicationForm';
import { api } from '../../../src/services/api';
import toast from 'react-hot-toast';

// Mock the api module
jest.mock('../../../src/services/api', () => ({
  api: {
    createApplication: jest.fn()
  }
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

describe('AddApplicationForm Component', () => {
  const mockOnApplicationAdded = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the form correctly', () => {
    render(<AddApplicationForm onApplicationAdded={mockOnApplicationAdded} />);
    
    expect(screen.getByText('Add New Application')).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Application/i })).toBeInTheDocument();
  });
  
  it('updates form values when user types', () => {
    render(<AddApplicationForm onApplicationAdded={mockOnApplicationAdded} />);
    
    const companyInput = screen.getByLabelText(/Company Name/i);
    const positionInput = screen.getByLabelText(/Position/i);
    
    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(positionInput, { target: { value: 'Test Position' } });
    
    expect(companyInput).toHaveValue('Test Company');
    expect(positionInput).toHaveValue('Test Position');
  });
  
  it('submits the form with correct data', async () => {
    // Mock the API response
    (api.createApplication as jest.Mock).mockResolvedValue({});
    
    render(<AddApplicationForm onApplicationAdded={mockOnApplicationAdded} />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/Position/i), { target: { value: 'Test Position' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      // Verify the API was called with correct data
      expect(api.createApplication).toHaveBeenCalledWith({
        companyName: 'Test Company',
        position: 'Test Position',
        status: 'Applied',
        dateApplied: expect.any(String)
      });
      
      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Application added successfully');
      
      // Verify callback was called
      expect(mockOnApplicationAdded).toHaveBeenCalled();
    });
    
    // Verify form was reset
    expect(screen.getByLabelText(/Company Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Position/i)).toHaveValue('');
  });
  
  it('shows error toast when API call fails', async () => {
    // Mock API call to fail
    (api.createApplication as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<AddApplicationForm onApplicationAdded={mockOnApplicationAdded} />);
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/Position/i), { target: { value: 'Test Position' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));
    
    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add application');
      expect(mockOnApplicationAdded).not.toHaveBeenCalled();
    });
  });
  
  it('does not submit if required fields are empty', async () => {
    render(<AddApplicationForm onApplicationAdded={mockOnApplicationAdded} />);
    
    // Submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));
    
    // API should not be called
    expect(api.createApplication).not.toHaveBeenCalled();
    expect(mockOnApplicationAdded).not.toHaveBeenCalled();
  });
});
