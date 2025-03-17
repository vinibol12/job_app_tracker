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

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                    {applications.map(application => (
                        <tr key={application.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.companyName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={application.status}
                                    onChange={(e) => handleStatusChange(application, e.target.value)}
                                    className={`text-sm rounded-full px-3 py-1 font-medium ${statusColors[application.status as keyof typeof statusColors]}`}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(application.dateApplied).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(application.id!)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 