import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CustomerLoop from './pages/CustomerLoop';
import DailyTasks from './pages/DailyTasks';
import Photos from './pages/Photos';
import './styles/mobile.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-loop' | 'daily-tasks' | 'photos'>('dashboard');
  const [globalPhotos, setGlobalPhotos] = useState<{ [key: string]: string }>({});

  const handlePhotosUpdate = (photos: { [key: string]: string }) => {
    console.log('=== APP PHOTOS UPDATE ===');
    console.log('Received photos:', Object.keys(photos));
    console.log('Current globalPhotos:', Object.keys(globalPhotos));
    setGlobalPhotos(photos);
    console.log('Updated globalPhotos to:', Object.keys(photos));
  };

  const handleClearPhotos = () => {
    console.log('=== CLEARING ALL PHOTOS ===');
    setGlobalPhotos({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' ? (
        <Dashboard onNavigate={(page) => setCurrentPage(page)} />
      ) : currentPage === 'customer-loop' ? (
        <CustomerLoop 
          onBack={() => setCurrentPage('dashboard')} 
          onPhotosUpdate={handlePhotosUpdate}
          globalPhotos={globalPhotos}
        />
      ) : currentPage === 'photos' ? (
        <Photos 
          onBack={() => setCurrentPage('dashboard')} 
          photos={globalPhotos}
          onClearPhotos={handleClearPhotos}
        />
      ) : (
        <DailyTasks onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
}

export default App;