import { rest } from 'msw';
import { JobApplication } from '../../../src/types/JobApplication';

// Shared state for mock data
let applications: JobApplication[] = [
    {
        id: 1,
        companyName: 'Existing Company',
        position: 'Developer',
        status: 'Applied',
        dateApplied: new Date().toISOString()
    }
];

// Reset function to restore initial state
export const resetApplications = () => {
    applications = [
        {
            id: 1,
            companyName: 'Existing Company',
            position: 'Developer',
            status: 'Applied',
            dateApplied: new Date().toISOString()
        }
    ];
};

export const handlers = [
    rest.get('http://localhost:8080/api/jobapplications', (req, res, ctx) => {
        return res(ctx.json(applications));
    }),

    rest.post('http://localhost:8080/api/jobapplications', async (req, res, ctx) => {
        const newApp = {
            id: applications.length + 1,
            ...(req.body as Partial<JobApplication>),
            dateApplied: new Date().toISOString()
        } as JobApplication;
        
        applications.push(newApp);
        return res(ctx.json(newApp));
    }),

    rest.put('http://localhost:8080/api/jobapplications/:id', (req, res, ctx) => {
        const id = parseInt(req.params.id as string);
        const updatedApp = req.body as JobApplication;
        
        applications = applications.map(app => 
            app.id === id ? { ...updatedApp } : app
        );
        
        return res(ctx.json(updatedApp));
    }),

    rest.delete('http://localhost:8080/api/jobapplications/:id', (req, res, ctx) => {
        const id = parseInt(req.params.id as string);
        applications = applications.filter(app => app.id !== id);
        return res(ctx.status(204));
    })
]; 