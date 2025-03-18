import React, { useEffect, useState } from 'react';
import { JobApplication } from '../types/JobApplication';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];
const statusColors = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Interview': 'bg-yellow-100 text-yellow-800',
    'Offer': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
};

interface Props {
    onApplicationDeleted: () => void;
}

export const JobApplicationList: React.FC<Props> = ({ onApplicationDeleted }) => {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // The applications are already sorted by the backend (most recent first)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(applications.length / itemsPerPage);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await api.getAllApplications();
            setApplications(data);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (application: JobApplication, newStatus: string) => {
        try {
            const updated = await api.updateApplication({
                ...application,
                status: newStatus
            });
            setApplications(applications.map(app => 
                app.id === updated.id ? updated : app
            ));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.deleteApplication(id);
                toast.success('Application deleted successfully');
                onApplicationDeleted();
            } catch (error) {
                console.error('Error deleting application:', error);
                toast.error('Failed to delete application');
            }
        }
    };

    const startEditing = (id: number, field: string, value: string) => {
        setEditingId(id);
        setEditingField(field);
        setEditValue(value);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    const saveEdit = async (application: JobApplication) => {
        if (!editingField || editingId !== application.id) return;

        try {
            const updatedApplication = {
                ...application,
                [editingField]: editValue
            };

            const updated = await api.updateApplication(updatedApplication);
            setApplications(applications.map(app => 
                app.id === updated.id ? updated : app
            ));
            toast.success(`${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated`);
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('Failed to update application');
        } finally {
            setEditingId(null);
            setEditingField(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, application: JobApplication) => {
        if (e.key === 'Enter') {
            saveEdit(application);
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditingField(null);
        }
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                data-testid="loading-spinner"
                role="status"
                aria-label="Loading..."
            ></div>
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentApplications.map(application => (
                        <tr key={application.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingId === application.id && editingField === 'companyName' ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={handleEditChange}
                                        onBlur={() => saveEdit(application)}
                                        onKeyDown={(e) => handleKeyDown(e, application)}
                                        className="border rounded p-1 w-full"
                                        autoFocus
                                        data-testid="edit-company-input"
                                    />
                                ) : (
                                    <div 
                                        onClick={() => startEditing(application.id!, 'companyName', application.companyName)}
                                        className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                                    >
                                        {application.companyName}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {editingId === application.id && editingField === 'position' ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={handleEditChange}
                                        onBlur={() => saveEdit(application)}
                                        onKeyDown={(e) => handleKeyDown(e, application)}
                                        className="border rounded p-1 w-full"
                                        autoFocus
                                        data-testid="edit-position-input"
                                    />
                                ) : (
                                    <div 
                                        onClick={() => startEditing(application.id!, 'position', application.position)}
                                        className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                                    >
                                        {application.position}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={application.status}
                                    onChange={(e) => handleStatusChange(application, e.target.value)}
                                    className={`text-sm rounded-full px-3 py-1 font-medium ${statusColors[application.status as keyof typeof statusColors]}`}
                                    data-testid="status-select"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editingId === application.id && editingField === 'dateApplied' ? (
                                    <input
                                        type="date"
                                        value={editValue.split('T')[0]} // Format date for date input
                                        onChange={handleEditChange}
                                        onBlur={() => saveEdit(application)}
                                        onKeyDown={(e) => handleKeyDown(e, application)}
                                        className="border rounded p-1"
                                        autoFocus
                                        data-testid="edit-date-input"
                                    />
                                ) : (
                                    <div 
                                        onClick={() => startEditing(application.id!, 'dateApplied', application.dateApplied)}
                                        className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                                    >
                                        {new Date(application.dateApplied).toLocaleDateString()}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(application.id!)}
                                    className="text-red-600 hover:text-red-900"
                                    data-testid="delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Pagination with added margin-bottom for spacing */}
            {applications.length > itemsPerPage && (
                <div className="flex justify-center my-6 mb-12">
                    <nav className="flex items-center">
                        <button 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            data-testid="prev-page"
                        >
                            Prev
                        </button>
                        
                        <div className="px-4">
                            <span className="font-medium">{currentPage}</span> of <span>{totalPages}</span>
                        </div>
                        
                        <button 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            data-testid="next-page"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};