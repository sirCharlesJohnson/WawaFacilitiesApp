import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CustomerLoop from './pages/CustomerLoop';
import './styles/mobile.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-loop'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' ? (
        <Dashboard onNavigate={() => setCurrentPage('customer-loop')} />
      ) : (
        <CustomerLoop onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
}

export default App;