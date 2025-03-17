import React, { useEffect, useState } from 'react';
import { JobApplication } from '../types/JobApplication';
import { api } from '../services/api';

const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];

export const JobApplicationList: React.FC = () => {
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
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Company</th>
                        <th className="px-4 py-2">Position</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Date Applied</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(application => (
                        <tr key={application.id}>
                            <td className="border px-4 py-2">{application.companyName}</td>
                            <td className="border px-4 py-2">{application.position}</td>
                            <td className="border px-4 py-2">
                                <select
                                    value={application.status}
                                    onChange={(e) => handleStatusChange(application, e.target.value)}
                                    className="form-select"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(application.dateApplied).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 