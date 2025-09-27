import React, { useState } from 'react';
import { ArrowLeft, Camera, Download, Trash2, RefreshCw, BarChart3, Image as ImageIcon } from 'lucide-react';

interface PhotosProps {
  onBack: () => void;
  photos: { [key: string]: string };
  onClearPhotos: () => void;
}

interface PhotoMetadata {
  id: string;
  filename: string;
  timestamp: Date;
  size: string;
  location: string;
  type: string;
  taskIndex?: number;
  photoType?: 'before' | 'after';
}

export default function Photos({ onBack, photos, onClearPhotos }: PhotosProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  // Convert photos object to metadata array
  const photoMetadata: PhotoMetadata[] = Object.entries(photos).map(([key, dataUrl]) => {
    const [taskIndex, photoType] = key.split('-');
    const timestamp = new Date();
    const sizeInBytes = Math.round((dataUrl.length * 3) / 4); // Approximate size from base64
    const sizeInKB = Math.round(sizeInBytes / 1024);
    
    // Map task indices to locations
    const locations = [
      'Customer Restrooms',
      'Store Interior', 
      'Exterior Areas',
      'Beverage Area',
      'Sales Floor',
      'Store Entrance',
      'Front Entrance',
      'Café Area'
    ];
    
    const location = locations[parseInt(taskIndex)] || 'Unknown Location';
    
    return {
      id: key,
      filename: `Photo_${Date.now()}_${key}.jpg`,
      timestamp,
      size: `${sizeInKB} KB`,
      location,
      type: photoType === 'before' ? 'Before' : 'After',
      taskIndex: parseInt(taskIndex),
      photoType: photoType as 'before' | 'after'
    };
  });

  const totalPhotos = photoMetadata.length;
  const totalSize = photoMetadata.reduce((sum, photo) => {
    const sizeNum = parseInt(photo.size.replace(' KB', ''));
    return sum + sizeNum;
  }, 0);

  const handlePhotoSelect = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === totalPhotos) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photoMetadata.map(p => p.id)));
    }
  };

  const handleDownloadSelected = () => {
    selectedPhotos.forEach(photoId => {
      const photo = photos[photoId];
      const metadata = photoMetadata.find(p => p.id === photoId);
      if (photo && metadata) {
        const link = document.createElement('a');
        link.href = photo;
        link.download = metadata.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedPhotos.size} selected photos?`)) {
      // This would need to be implemented to actually remove photos from the parent state
      setSelectedPhotos(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
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
                onClick={() => window.location.reload()}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <RefreshCw className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button 
                onClick={onClearPhotos}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <BarChart3 className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Storage Info</span>
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Simple Photo Manager</h1>
          <p className="text-gray-600">iOS-compatible photo system with storage monitoring and error handling.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ImageIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
                <p className="text-sm text-gray-600">Total Photos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSize} KB</p>
                <p className="text-sm text-gray-600">Total Size</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Camera className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedPhotos.size}</p>
                <p className="text-sm text-gray-600">Selected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        {totalPhotos > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedPhotos.size === totalPhotos ? 'Deselect All' : 'Select All'}
                </button>
                {selectedPhotos.size > 0 && (
                  <span className="text-gray-600">
                    {selectedPhotos.size} selected
                  </span>
                )}
              </div>
              
              {selectedPhotos.size > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadSelected}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {totalPhotos === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos captured yet</h3>
            <p className="text-gray-600">Photos taken in the Customer Loop will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photoMetadata.map((photo) => (
              <div
                key={photo.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all ${
                  selectedPhotos.has(photo.id) ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => handlePhotoSelect(photo.id)}
              >
                <div className="aspect-square relative">
                  <img
                    src={photos[photo.id]}
                    alt={`${photo.type} photo from ${photo.location}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedPhotos.has(photo.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}>
                      {selectedPhotos.has(photo.id) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      photo.photoType === 'before'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {photo.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{photo.filename}</h3>
                  <p className="text-sm text-gray-600 mb-1">{photo.location}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{photo.timestamp.toLocaleDateString()}</span>
                    <span>{photo.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}