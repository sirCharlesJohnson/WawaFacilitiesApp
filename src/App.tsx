@@ .. @@
 import React, { useState } from 'react';
 import Dashboard from './pages/Dashboard';
 import CustomerLoop from './pages/CustomerLoop';
+import './styles/mobile.css';
 
 function App() {
   const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-loop'>('dashboard');