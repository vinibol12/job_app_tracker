import axios from 'axios';
import { JobApplication } from '../types/JobApplication';

const API_URL = 'http://localhost:5000/api';

export const api = {
    getAllApplications: async () => {
        const response = await axios.get<JobApplication[]>(`${API_URL}/jobapplications`);
        return response.data;
    },

    createApplication: async (application: JobApplication) => {
        const response = await axios.post<JobApplication>(`${API_URL}/jobapplications`, application);
        return response.data;
    },

    updateApplication: async (application: JobApplication) => {
        const response = await axios.put<JobApplication>(
            `${API_URL}/jobapplications/${application.id}`,
            application
        );
        return response.data;
    },

    deleteApplication: async (id: number) => {
        await axios.delete(`${API_URL}/jobapplications/${id}`);
    }
}; 