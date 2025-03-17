import React, { useState } from 'react';
import { JobApplicationList } from './components/JobApplicationList';
import { AddApplicationForm } from './components/AddApplicationForm';
import { Toaster } from 'react-hot-toast';

function App() {
    const [refresh, setRefresh] = useState(false);

    const handleApplicationAdded = () => {
        setRefresh(!refresh);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Job Application Tracker
                </h1>
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