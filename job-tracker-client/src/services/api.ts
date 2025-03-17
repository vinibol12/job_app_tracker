import axios from 'axios';
import { JobApplication } from '../types/JobApplication';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const api = {
    getAllApplications: async () => {
        const response = await axiosInstance.get<JobApplication[]>('/jobapplications');
        return response.data;
    },

    createApplication: async (application: JobApplication) => {
        const response = await axiosInstance.post<JobApplication>('/jobapplications', application);
        return response.data;
    },

    updateApplication: async (application: JobApplication) => {
        const response = await axiosInstance.put<JobApplication>(
            `/jobapplications/${application.id}`,
            application
        );
        return response.data;
    },

    deleteApplication: async (id: number) => {
        await axiosInstance.delete(`/jobapplications/${id}`);
    }
}; 