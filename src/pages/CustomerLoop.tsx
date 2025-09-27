import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface CustomerLoopProps {
  onBack: () => void;
}

export default function CustomerLoop({ onBack }: CustomerLoopProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [currentTask, setCurrentTask] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [photos, setPhotos] = useState<{ [key: number]: string }>({});
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoTask, setCurrentPhotoTask] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const tasks = [
    {
      area: "Front End & Entrance",
      description: "Ensure welcoming first impression",
      items: [
        "Check entrance doors are clean and functioning",
        "Verify shopping carts/baskets are available and clean",
        "Ensure promotional displays are neat and stocked",
        "Check floor is clean and dry"
      ]
    },
    {
      area: "Checkout Area",
      description: "Maintain efficient customer flow",
      items: [
        "Ensure adequate checkout lanes are open",
        "Check queue management and signage",
        "Verify payment systems are working",
        "Ensure checkout areas are clean and organized"
      ]
    },
    {
      area: "Customer Service Desk",
      description: "Support customer inquiries and returns",
      items: [
        "Check staff availability and response time",
        "Ensure return/exchange process is smooth",
        "Verify information displays are current",
        "Check cleanliness of service area"
      ]
    },
    {
      area: "Restrooms",
      description: "Maintain cleanliness and supplies",
      items: [
        "Check cleanliness and sanitation",
        "Verify toilet paper and soap supplies",
        "Ensure proper lighting and ventilation",
        "Check for any maintenance issues"
      ]
    },
    {
      area: "Main Aisles",
      description: "Ensure clear navigation and safety",
      items: [
        "Check for obstacles or spills",
        "Verify aisle signage is visible and accurate",
        "Ensure adequate lighting throughout",
        "Check for any safety hazards"
      ]
    }
  ];

  const handlePhotoCapture = async (taskIndex: number) => {
    setCameraError(null);
    try {
      // Request camera permissions with mobile-optimized settings
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve(true);
          }
        });
        
        setShowCamera(true);
        setCurrentPhotoTask(taskIndex);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Unable to access camera. Please check permissions and try again.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL with good quality
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        // Store the photo
        setPhotos(prev => ({
          ...prev,
          [currentPhotoTask!]: photoDataUrl
        }));
        
        stopCamera();
      } else {
        setCameraError('Video not ready. Please try again.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCurrentPhotoTask(null);
    setCameraError(null);
  };

  const handleTaskComplete = (taskIndex: number) => {
    setCompletedTasks(prev => new Set([...prev, taskIndex]));
    
    // Move to next incomplete task
    const nextTask = tasks.findIndex((_, index) => 
      index > taskIndex && !completedTasks.has(index)
    );
    if (nextTask !== -1) {
      setCurrentTask(nextTask);
    }
  };

  const allTasksCompleted = completedTasks.size === tasks.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Mobile Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {completedTasks.size}/{tasks.length}
            </div>
          </div>
          
          <h1 className="text-xl font-bold text-gray-900 mb-1">Customer Loop #1</h1>
          <p className="text-sm text-gray-600">Complete every 1-1.5 hours</p>
        </div>

        {/* Task List - Mobile Optimized */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border-l-4 ${
                completedTasks.has(index)
                  ? 'border-l-green-500 bg-green-50'
                  : currentTask === index
                  ? 'border-l-blue-500 bg-blue-50'
                  : 'border-l-gray-300'
              }`}
            >
              <div className="p-4">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {completedTasks.has(index) ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{task.area}</h3>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    </div>
                  </div>
                </div>

                {/* Task Items */}
                <div className="ml-9 mb-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    {task.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons and Photo */}
                <div className="ml-9">
                  {!completedTasks.has(index) && (
                    <div className="flex space-x-2 mb-3">
                      <button
                        onClick={() => handlePhotoCapture(index)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px]"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </button>
                      <button
                        onClick={() => handleTaskComplete(index)}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium min-h-[44px]"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </button>
                    </div>
                  )}
                  
                  {/* Show captured photo */}
                  {photos[index] && (
                    <div className="mt-3">
                      <img
                        src={photos[index]}
                        alt={`${task.area} photo`}
                        className="w-full max-w-xs h-32 object-cover rounded-lg border shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Status */}
        {allTasksCompleted && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-green-800 font-semibold">Customer Loop #1 Completed!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Great job! All tasks have been completed successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal - Mobile Optimized */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl md:rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Take Photo</h3>
              <button
                onClick={stopCamera}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            {cameraError ? (
              <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{cameraError}</p>
              </div>
            ) : (
              <div className="mb-4 relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}