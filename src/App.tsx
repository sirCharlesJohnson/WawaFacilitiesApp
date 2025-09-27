import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CustomerLoop from './pages/CustomerLoop';
import DailyTasks from './pages/DailyTasks';
import Photos from './pages/Photos';
import './styles/mobile.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-loop' | 'daily-tasks' | 'photos'>('dashboard');
  const [globalPhotos, setGlobalPhotos] = useState<{ [key: string]: string }>({});
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  
  // Customer Loop persistent state
  const [loopState, setLoopState] = useState({
    isRunning: false,
    elapsedTime: 0,
    completedTasks: new Set<number>(),
    notes: {} as { [key: number]: string }
  });
  
  const [recentActivities, setRecentActivities] = useState<Array<{
    id: string;
    type: 'task' | 'photo' | 'loop' | 'issue';
    title: string;
    description: string;
    timestamp: Date;
    icon: 'check' | 'camera' | 'clock' | 'alert';
    color: 'green' | 'blue' | 'orange' | 'red';
  }>>([]);

  const handlePhotosUpdate = (photos: { [key: string]: string }) => {
    console.log('🔄 APP PHOTOS UPDATE:', {
      received: Object.keys(photos),
      current: Object.keys(globalPhotos),
      newCount: Object.keys(photos).length
    });
    setGlobalPhotos(photos);
    
    // Add photo activity
    const newPhotoCount = Object.keys(photos).length - Object.keys(globalPhotos).length;
    if (newPhotoCount > 0) {
      const newActivity = {
        id: `photo-${Date.now()}`,
        type: 'photo' as const,
        title: `${newPhotoCount} Photo${newPhotoCount > 1 ? 's' : ''} Captured`,
        description: `Added ${newPhotoCount} inspection photo${newPhotoCount > 1 ? 's' : ''} to system`,
        timestamp: new Date(),
        icon: 'camera' as const,
        color: 'blue' as const
      };
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }
    console.log('✅ Global photos updated successfully');
  };

  const handleClearPhotos = () => {
    console.log('🗑️ CLEARING ALL PHOTOS');
    setGlobalPhotos({});
  };

  const handleTaskComplete = (taskTitle: string, source: 'daily' | 'loop') => {
    setCompletedTasks(prev => prev + 1);
    
    const newActivity = {
      id: `task-${Date.now()}`,
      type: 'task' as const,
      title: `Task Completed`,
      description: taskTitle,
      timestamp: new Date(),
      icon: 'check' as const,
      color: 'green' as const
    };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  const handleLoopComplete = (loopNumber: number, duration: string, tasksCompleted: number) => {
    const newActivity = {
      id: `loop-${Date.now()}`,
      type: 'loop' as const,
      title: `Customer Loop #${loopNumber} Completed`,
      description: `All ${tasksCompleted} tasks completed in ${duration}`,
      timestamp: new Date(),
      icon: 'check' as const,
      color: 'green' as const
    };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  const handleLoopStateUpdate = (newState: Partial<typeof loopState>) => {
    setLoopState(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' ? (
        <Dashboard 
          onNavigate={(page) => setCurrentPage(page)} 
          completedTasks={completedTasks}
          recentActivities={recentActivities}
          totalPhotos={Object.keys(globalPhotos).length}
        />
      ) : currentPage === 'customer-loop' ? (
        <CustomerLoop 
          onBack={() => setCurrentPage('dashboard')} 
          onPhotosUpdate={handlePhotosUpdate}
          globalPhotos={globalPhotos}
          onTaskComplete={handleTaskComplete}
          onLoopComplete={handleLoopComplete}
          loopState={loopState}
          onLoopStateUpdate={handleLoopStateUpdate}
        />
      ) : currentPage === 'photos' ? (
        <Photos 
          onBack={() => setCurrentPage('dashboard')} 
          photos={globalPhotos}
          onClearPhotos={handleClearPhotos}
        />
      ) : (
        <DailyTasks 
          onBack={() => setCurrentPage('dashboard')} 
          onTaskComplete={handleTaskComplete}
        />
      )}
    </div>
  );
}

export default App;