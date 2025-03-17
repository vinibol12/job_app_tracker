import React, { useState } from 'react';
import { JobApplication } from '../types/JobApplication';
import { api } from '../services/api';

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
            onApplicationAdded();
        } catch (error) {
            console.error('Error adding application:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <div className="mb-4">
                <label className="block mb-2">Company Name:</label>
                <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Position:</label>
                <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add Application
            </button>
        </form>
    );
}; 