import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Upload } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setCurrentPhotoTask(taskIndex);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size for better mobile performance
      const width = Math.min(video.videoWidth, 1920);
      const height = Math.min(video.videoHeight, 1080);
      
      canvas.width = width;
      canvas.height = height;
      
      if (context) {
        context.drawImage(video, 0, 0, width, height);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        setPhotos(prev => ({
          ...prev,
          [currentPhotoTask!]: photoDataUrl
        }));
        
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCurrentPhotoTask(null);
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
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {!isMobile && 'Back to Dashboard'}
            </button>
            <div className="text-sm text-gray-500">
              {completedTasks.size} of {tasks.length} completed
            </div>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Customer Loop #1</h1>
          <p className="text-sm md:text-base text-gray-600">Complete every 1-1.5 hours for optimal store conditions</p>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {tasks.map((task, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 md:p-4 transition-all ${
                  completedTasks.has(index)
                    ? 'border-green-200 bg-green-50'
                    : currentTask === index
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {completedTasks.has(index) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{task.area}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">{task.description}</p>
                      
                      {/* Task Items */}
                      <ul className="space-y-1 text-xs md:text-sm text-gray-700">
                        {task.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    {!completedTasks.has(index) && (
                      <>
                        <button
                          onClick={() => handlePhotoCapture(index)}
                          className="flex items-center px-2 md:px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm whitespace-nowrap"
                        >
                          <Camera className="w-4 h-4 mr-1" />
                          {!isMobile && 'Photo'}
                        </button>
                        <button
                          onClick={() => handleTaskComplete(index)}
                          className="flex items-center px-2 md:px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs md:text-sm whitespace-nowrap"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {!isMobile ? 'Complete' : '✓'}
                        </button>
                      </>
                    )}
                    
                    {/* Show captured photo */}
                    {photos[index] && (
                      <div className="mt-3">
                        <img
                          src={photos[index]}
                          alt={`${task.area} photo`}
                          className="w-20 h-16 md:w-32 md:h-24 object-cover rounded-md border"
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
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Customer Loop #1 Completed!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Great job! All tasks have been completed successfully.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Take Photo</h3>
            
            <div className="mb-4 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-40 md:h-48 bg-gray-200 rounded-md object-cover"
              />
            </div>
            
            <div className="flex space-x-2 md:space-x-3">
              <button
                onClick={capturePhoto}
                className="flex-1 bg-blue-600 text-white py-2 px-3 md:px-4 rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                Capture
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 bg-gray-600 text-white py-2 px-3 md:px-4 rounded-md hover:bg-gray-700 transition-colors text-sm md:text-base"
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