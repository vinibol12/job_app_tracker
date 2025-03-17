import React, { useState } from 'react';
import { JobApplication } from '../types/JobApplication';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Props {
    onApplicationAdded: () => void;
}

export const AddApplicationForm: React.FC<Props> = ({ onApplicationAdded }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        status: 'Applied'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createApplication({
                ...formData,
                dateApplied: new Date().toISOString()
            });
            setFormData({ companyName: '', position: '', status: 'Applied' });
            toast.success('Application added successfully');
            onApplicationAdded();
        } catch (error) {
            console.error('Error adding application:', error);
            toast.error('Failed to add application');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Application</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                    </label>
                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                    </label>
                    <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Application
                </button>
            </div>
        </form>
    );
}; 