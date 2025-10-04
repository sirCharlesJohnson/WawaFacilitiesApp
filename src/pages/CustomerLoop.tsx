import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, CheckCircle, Users, Trash2, Coffee, AlertTriangle, Droplets, Home, Play, Square, RotateCcw, Printer, Timer } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface CustomerLoopProps {
  onBack: () => void;
  onPhotosUpdate?: (photos: { [key: string]: string }) => void;
  globalPhotos?: { [key: string]: string };
  onTaskComplete?: (taskTitle: string, source: 'daily' | 'loop') => void;
  onLoopComplete?: (loopNumber: number, duration: string, tasksCompleted: number) => void;
  loopState: {
    isRunning: boolean;
    elapsedTime: number;
    completedTasks: Set<number>;
    notes: { [key: number]: string };
  };
  onLoopStateUpdate: (newState: Partial<CustomerLoopProps['loopState']>) => void;
  currentLoopNumber: number;
  onResetCounter?: () => void;
}

export default function CustomerLoop({ onBack, onPhotosUpdate, globalPhotos = {}, onTaskComplete, onLoopComplete, loopState, onLoopStateUpdate, currentLoopNumber, onResetCounter }: CustomerLoopProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [photos, setPhotos] = useState<{ [key: string]: string }>({});
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoTask, setCurrentPhotoTask] = useState<{ taskIndex: number; photoType: 'before' | 'after' } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tasks = [
    {
      title: "Restroom Check",
      location: "Customer Restrooms",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Trash - Inside",
      location: "Store Interior",
      icon: Trash2,
      color: "text-blue-600"
    },
    {
      title: "Trash - Outside",
      location: "Exterior Areas",
      icon: Trash2,
      color: "text-blue-600"
    },
    {
      title: "Creating the Catchbox & Beer",
      location: "Beverage Area",
      icon: Coffee,
      color: "text-blue-600"
    },
    {
      title: "Sales Floor Debris & Safety Standards",
      location: "Sales Floor",
      icon: AlertTriangle,
      color: "text-blue-600"
    },
    {
      title: "Vestibule - Debris, Spot Clean Glass",
      location: "Store Entrance",
      icon: Droplets,
      color: "text-blue-600"
    },
    {
      title: "Front Porch - Debris",
      location: "Front Entrance",
      icon: Home,
      color: "text-blue-600"
    },
    {
      title: "Café - Wipe Tables & Sweep",
      location: "Café Area",
      icon: Coffee,
      color: "text-blue-600"
    }
  ];

  // Timer functionality
  useEffect(() => {
    if (loopState.isRunning) {
      intervalRef.current = setInterval(() => {
        onLoopStateUpdate({ elapsedTime: loopState.elapsedTime + 1 });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loopState.isRunning, loopState.elapsedTime, onLoopStateUpdate]);

  // Check for loop completion
  const [hasNotifiedCompletion, setHasNotifiedCompletion] = useState(false);

  useEffect(() => {
    if (loopState.completedTasks.size === tasks.length && loopState.completedTasks.size > 0 && onLoopComplete && !hasNotifiedCompletion) {
      onLoopComplete(currentLoopNumber, formatTime(loopState.elapsedTime), tasks.length);
      setHasNotifiedCompletion(true);
    }
  }, [loopState.completedTasks.size, tasks.length, loopState.elapsedTime, onLoopComplete, currentLoopNumber, hasNotifiedCompletion]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const completedTasksList = tasks
        .filter((_, index) => loopState.completedTasks.has(index))
        .map(task => `• ${task.title}`)
        .join('\n');
      
      const reportContent = `
        <html>
          <head>
            <title>Customer Loop Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              .summary { background: #f5f5f5; padding: 15px; margin: 15px 0; }
              .tasks { margin: 15px 0; }
              .notes { margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>Customer Loop #{currentLoopNumber} Report</h1>
            <div class="summary">
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
              <p><strong>Duration:</strong> ${formatTime(loopState.elapsedTime)}</p>
              <p><strong>Tasks Completed:</strong> ${loopState.completedTasks.size}/${tasks.length}</p>
              <p><strong>Progress:</strong> ${Math.round((loopState.completedTasks.size / tasks.length) * 100)}%</p>
            </div>
            <div class="tasks">
              <h2>Completed Tasks:</h2>
              <pre>${completedTasksList || 'No tasks completed'}</pre>
            </div>
            <div class="notes">
              <h2>Notes:</h2>
              ${Object.entries(loopState.notes)
                .filter(([_, note]) => note.trim())
                .map(([taskIndex, note]) => `<p><strong>${tasks[parseInt(taskIndex)].title}:</strong> ${note}</p>`)
                .join('') || '<p>No notes recorded</p>'}
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const startLoop = () => {
    onLoopStateUpdate({ isRunning: true });
  };

  const resetLoop = () => {
    onLoopStateUpdate({
      isRunning: false,
      elapsedTime: 0,
      completedTasks: new Set(),
      notes: {}
    });
    setPhotos({});
    if (onPhotosUpdate) {
      onPhotosUpdate({});
    }
    setHasNotifiedCompletion(false);
  };

  // Simplified photo capture using file input
  const handlePhotoCapture = (taskIndex: number, photoType: 'before' | 'after') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use rear camera on mobile
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photoDataUrl = e.target?.result as string;
          const photoKey = `${taskIndex}-${photoType}`;
          
          console.log('📸 PHOTO CAPTURED:', {
            key: photoKey,
            dataLength: photoDataUrl.length,
            taskIndex,
            photoType
          });
          
          // Update local photos state
          const updatedPhotos = {
            ...photos,
            [photoKey]: photoDataUrl
          };
          
          setPhotos(updatedPhotos);
          
          // Update global photos state
          if (onPhotosUpdate) {
            console.log('🔄 UPDATING GLOBAL PHOTOS:', Object.keys(updatedPhotos));
            onPhotosUpdate(updatedPhotos);
          }
          
          console.log('✅ PHOTO STORED SUCCESSFULLY');
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleTaskComplete = (taskIndex: number) => {
    const task = tasks[taskIndex];
    const newCompletedTasks = new Set([...loopState.completedTasks, taskIndex]);
    onLoopStateUpdate({ completedTasks: newCompletedTasks });
    
    // Notify parent component
    if (onTaskComplete) {
      onTaskComplete(task.title, 'loop');
    }
  };

  const progress = Math.round((loopState.completedTasks.size / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePrintReport}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <Printer className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Print Report</span>
              </button>
              <button 
                onClick={() => setShowTimerSettings(true)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <Timer className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Timer Settings</span>
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Loop #{currentLoopNumber}</h1>
          <p className="text-gray-600 mb-6">Complete every 1-1.5 hours for optimal store conditions</p>
          
          {/* Timer and Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{formatTime(loopState.elapsedTime)}</div>
              <div className="text-sm text-gray-600">Elapsed Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{loopState.completedTasks.size}/{tasks.length}</div>
              <div className="text-sm text-gray-600">Tasks Complete</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">Progress</div>
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            </div>
            
            <div className="flex flex-col space-y-2">
              {!loopState.isRunning ? (
                <button
                  onClick={startLoop}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Loop
                </button>
              ) : (
                <button
                  onClick={() => onLoopStateUpdate({ isRunning: false })}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </button>
              )}
              
              <button
                onClick={resetLoop}
                className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Loop
              </button>

              {onResetCounter && (
                <button
                  onClick={onResetCounter}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to #1
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">📊 Photo Debug Info</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>📸 Photos stored locally: {Object.keys(photos).length}</p>
            <p>🔑 Photo keys: {Object.keys(photos).join(', ') || 'None'}</p>
            <p>🌐 Global photos received: {Object.keys(globalPhotos).length}</p>
            <button 
              onClick={() => {
                console.log('🔍 CURRENT STATE:', {
                  localPhotos: photos,
                  globalPhotos,
                  photoKeys: Object.keys(photos)
                });
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Log State to Console
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <task.icon className={`w-6 h-6 ${task.color} mt-1`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      {task.location}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleTaskComplete(index)}
                  className={`p-2 rounded-full transition-colors ${
                    loopState.completedTasks.has(index)
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Before & After Photos Section */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Before & After Photos Required</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Photo */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Before Photo</span>
                      {photos[`${index}-before`] ? (
                        <span className="text-xs text-green-600 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Captured
                        </span>
                      ) : null}
                    </div>
                    
                    {photos[`${index}-before`] ? (
                      <div className="relative">
                        <img
                          src={photos[`${index}-before`]}
                          alt="Before photo"
                          className="w-full h-32 object-cover rounded-lg border mb-2"
                        />
                        <button
                          onClick={() => handlePhotoCapture(index, 'before')}
                          className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePhotoCapture(index, 'before')}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors mb-2"
                      >
                        <div className="text-center">
                          <Camera className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm">Take Photo</span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* After Photo */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">After Photo</span>
                      {photos[`${index}-after`] ? (
                        <span className="text-xs text-green-600 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Captured
                        </span>
                      ) : null}
                    </div>
                    
                    {photos[`${index}-after`] ? (
                      <div className="relative">
                        <img
                          src={photos[`${index}-after`]}
                          alt="After photo"
                          className="w-full h-32 object-cover rounded-lg border mb-2"
                        />
                        <button
                          onClick={() => handlePhotoCapture(index, 'after')}
                          className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePhotoCapture(index, 'after')}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors mb-2"
                      >
                        <div className="text-center">
                          <Camera className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-sm">Take Photo</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <label htmlFor={`notes-${index}`} className="sr-only">
                  Notes for {task.title}
                </label>
                <textarea
                  id={`notes-${index}`}
                  name={`notes-${index}`}
                  placeholder="Add notes about this task..."
                  value={loopState.notes[index] || ''}
                  onChange={(e) => onLoopStateUpdate({ 
                    notes: { ...loopState.notes, [index]: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Completion Status */}
        {loopState.completedTasks.size === tasks.length && loopState.completedTasks.size > 0 && (
          <div className="mt-6 p-6 bg-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-green-800 font-semibold text-lg">Customer Loop #{currentLoopNumber} Completed!</h3>
                <p className="text-green-700 mt-1">
                  All {tasks.length} tasks completed in {formatTime(loopState.elapsedTime)}. Great job!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timer Settings Modal */}
        {showTimerSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Timer Settings</h3>
                <button
                  onClick={() => setShowTimerSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Timer Status
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${loopState.isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                        {loopState.isRunning ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">Elapsed:</span>
                      <span className="text-sm font-medium text-gray-900">{formatTime(loopState.elapsedTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Actions
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (loopState.isRunning) {
                          onLoopStateUpdate({ isRunning: false });
                        } else {
                          onLoopStateUpdate({ isRunning: true });
                        }
                      }}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        loopState.isRunning
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {loopState.isRunning ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Pause Timer
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Resume Timer
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset the timer? This will clear all progress.')) {
                          resetLoop();
                          setShowTimerSettings(false);
                        }
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Timer
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timer Info
                  </label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Customer loops should be completed every 1-1.5 hours</p>
                    <p>• Timer continues running when you navigate to other pages</p>
                    <p>• Progress is automatically saved</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTimerSettings(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

