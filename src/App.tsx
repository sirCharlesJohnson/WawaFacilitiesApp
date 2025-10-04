import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CustomerLoop from './pages/CustomerLoop';
import DailyTasks from './pages/DailyTasks';
import Photos from './pages/Photos';
import './styles/mobile.css';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-loop' | 'daily-tasks' | 'photos'>('dashboard');
  const [globalPhotos, setGlobalPhotos] = useState<{ [key: string]: string }>({});
  const [completedTasks, setCompletedTasks] = useState<number>(0);

  // Loop counter state
  const [currentLoopNumber, setCurrentLoopNumber] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('currentLoopNumber');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Persistent notes state
  const [dailyTaskNotes, setDailyTaskNotes] = useState<{ [key: number]: string }>(() => {
    try {
      const saved = localStorage.getItem('dailyTaskNotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Customer Loop persistent state
  const [loopState, setLoopState] = useState(() => {
    try {
      const saved = localStorage.getItem('loopState');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          completedTasks: new Set(parsed.completedTasks || [])
        };
      }
    } catch {
      // Fall through to default
    }
    return {
      isRunning: false,
      elapsedTime: 0,
      completedTasks: new Set<number>(),
      notes: {} as { [key: number]: string }
    };
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

  // Save daily task notes to localStorage whenever they change
  const handleDailyTaskNotesUpdate = (notes: { [key: number]: string }) => {
    setDailyTaskNotes(notes);
    try {
      localStorage.setItem('dailyTaskNotes', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save daily task notes:', error);
    }
  };

  // Save loop state to localStorage whenever it changes
  const handleLoopStateUpdate = (newState: Partial<typeof loopState>) => {
    const updatedState = { ...loopState, ...newState };
    setLoopState(updatedState);

    try {
      // Convert Set to Array for JSON serialization
      const stateToSave = {
        ...updatedState,
        completedTasks: Array.from(updatedState.completedTasks)
      };
      localStorage.setItem('loopState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save loop state:', error);
    }
  };

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

    // Increment loop number for next loop
    const nextLoopNumber = loopNumber + 1;
    setCurrentLoopNumber(nextLoopNumber);
    try {
      localStorage.setItem('currentLoopNumber', nextLoopNumber.toString());
    } catch (error) {
      console.error('Failed to save loop number:', error);
    }

    // Reset loop state for next loop
    handleLoopStateUpdate({
      isRunning: false,
      elapsedTime: 0,
      completedTasks: new Set<number>(),
      notes: {}
    });
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
          currentLoopNumber={currentLoopNumber}
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
          notes={dailyTaskNotes}
          onNotesUpdate={handleDailyTaskNotesUpdate}
        />
      )}
    </div>
  );
}

export default App;
