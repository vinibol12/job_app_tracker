import React, { useState } from 'react';
import { JobApplicationList } from './components/JobApplicationList';
import { AddApplicationForm } from './components/AddApplicationForm';
import { Toaster } from 'react-hot-toast';

function App() {
    const [refresh, setRefresh] = useState(false);

    const handleApplicationAdded = () => {
        setRefresh(!refresh);
    };

    // Determine API base URL based on environment
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const swaggerUrl = apiBaseUrl.replace('/api', '/swagger');

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Datacom Job Applications Tracker
                </h1>
                <div className="flex justify-center mb-8">
                    <a 
                        href={swaggerUrl}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                        data-testid="swagger-link"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        API Documentation
                    </a>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-4">
                        <div className="bg-white shadow rounded-lg">
                            <AddApplicationForm onApplicationAdded={handleApplicationAdded} />
                        </div>
                    </div>
                    {/* Table Section */}
                    <div className="lg:col-span-8">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <JobApplicationList key={refresh.toString()} onApplicationDeleted={handleApplicationAdded} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;