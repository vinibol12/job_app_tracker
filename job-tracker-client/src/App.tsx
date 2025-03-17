import React, { useState } from 'react';
import { JobApplicationList } from './components/JobApplicationList';
import { AddApplicationForm } from './components/AddApplicationForm';

function App() {
    const [refresh, setRefresh] = useState(false);

    const handleApplicationAdded = () => {
        setRefresh(!refresh);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Job Application Tracker</h1>
            <AddApplicationForm onApplicationAdded={handleApplicationAdded} />
            <JobApplicationList key={refresh.toString()} />
        </div>
    );
}

export default App; 