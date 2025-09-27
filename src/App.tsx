import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CustomerLoop from './pages/CustomerLoop';
import DailyTasks from './pages/DailyTasks';
import './styles/mobile.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-loop' | 'daily-tasks'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' ? (
        <Dashboard onNavigate={(page) => setCurrentPage(page)} />
      ) : currentPage === 'customer-loop' ? (
        <CustomerLoop onBack={() => setCurrentPage('dashboard')} />
      ) : (
        <DailyTasks onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
}

export default App;