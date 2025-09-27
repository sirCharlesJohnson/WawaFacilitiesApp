@@ .. @@
 import React, { useState, useRef } from 'react';
 import { ArrowLeft, Camera, CheckCircle, AlertCircle, Upload } from 'lucide-react';
+import { useMediaQuery } from '../hooks/useMediaQuery';
 
 interface CustomerLoopProps {
   onBack: () => void;
@@ .. @@
 export default function CustomerLoop({ onBack }: CustomerLoopProps) {
+  const isMobile = useMediaQuery('(max-width: 768px)');
   const [currentTask, setCurrentTask] = useState(0);
   const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
   const [photos, setPhotos] = useState<{ [key: number]: string }>({});
@@ .. @@
   const handlePhotoCapture = async (taskIndex: number) => {
     try {
-      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
+      const stream = await navigator.mediaDevices.getUserMedia({ 
+        video: { 
+          facingMode: 'environment',
+          width: { ideal: 1920 },
+          height: { ideal: 1080 }
+        } 
+      });
       
       if (videoRef.current) {
         videoRef.current.srcObject = stream;
@@ .. @@
   const capturePhoto = () => {
     if (videoRef.current && canvasRef.current) {
       const canvas = canvasRef.current;
       const video = videoRef.current;
       const context = canvas.getContext('2d');
       
-      canvas.width = video.videoWidth;
-      canvas.height = video.videoHeight;
+      // Set canvas size for better mobile performance
+      const width = Math.min(video.videoWidth, 1920);
+      const height = Math.min(video.videoHeight, 1080);
+      
+      canvas.width = width;
+      canvas.height = height;
       
       if (context) {
-        context.drawImage(video, 0, 0, canvas.width, canvas.height);
+        context.drawImage(video, 0, 0, width, height);
         const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
         
         setPhotos(prev => ({
@@ .. @@
   return (
-    <div className="min-h-screen bg-gray-50 p-4">
+    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
       <div className="max-w-4xl mx-auto">
         {/* Header */}
-        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
+        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
           <div className="flex items-center justify-between mb-4">
             <button
               onClick={onBack}
-              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
+              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2"
             >
               <ArrowLeft className="w-5 h-5 mr-2" />
-              Back to Dashboard
+              {!isMobile && 'Back to Dashboard'}
             </button>
             <div className="text-sm text-gray-500">
               {completedTasks.size} of {tasks.length} completed
@@ .. @@
           </div>
           
-          <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Loop #1</h1>
-          <p className="text-gray-600">Complete every 1-1.5 hours for optimal store conditions</p>
+          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Customer Loop #1</h1>
+          <p className="text-sm md:text-base text-gray-600">Complete every 1-1.5 hours for optimal store conditions</p>
         </div>
 
         {/* Task List */}
-        <div className="bg-white rounded-lg shadow-sm p-6">
-          <div className="space-y-4">
+        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
+          <div className="space-y-3 md:space-y-4">
             {tasks.map((task, index) => (
               <div
                 key={index}
-                className={`border rounded-lg p-4 transition-all ${
+                className={`border rounded-lg p-3 md:p-4 transition-all ${
                   completedTasks.has(index)
                     ? 'border-green-200 bg-green-50'
                     : currentTask === index
@@ -142,7 +162,7 @@ export default function CustomerLoop({ onBack }: CustomerLoopProps) {
                     : 'border-gray-200 bg-gray-50'
                 }`}
               >
-                <div className="flex items-start justify-between">
+                <div className="flex items-start justify-between gap-3">
                   <div className="flex items-start space-x-3 flex-1">
                     <div className="flex-shrink-0 mt-1">
                       {completedTasks.has(index) ? (
@@ .. @@
                     </div>
                     <div className="flex-1">
-                      <h3 className="font-medium text-gray-900 mb-1">{task.area}</h3>
-                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
+                      <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{task.area}</h3>
+                      <p className="text-xs md:text-sm text-gray-600 mb-2">{task.description}</p>
                       
                       {/* Task Items */}
-                      <ul className="space-y-1 text-sm text-gray-700">
+                      <ul className="space-y-1 text-xs md:text-sm text-gray-700">
                         {task.items.map((item, itemIndex) => (
                           <li key={itemIndex} className="flex items-center">
                             <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
@@ .. @@
                   </div>
                   
                   {/* Action Buttons */}
-                  <div className="flex flex-col space-y-2 ml-4">
+                  <div className="flex flex-col space-y-2 flex-shrink-0">
                     {!completedTasks.has(index) && (
                       <>
                         <button
                           onClick={() => handlePhotoCapture(index)}
-                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
+                          className="flex items-center px-2 md:px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm whitespace-nowrap"
                         >
                           <Camera className="w-4 h-4 mr-1" />
-                          Photo
+                          {!isMobile && 'Photo'}
                         </button>
                         <button
                           onClick={() => handleTaskComplete(index)}
-                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
+                          className="flex items-center px-2 md:px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs md:text-sm whitespace-nowrap"
                         >
                           <CheckCircle className="w-4 h-4 mr-1" />
-                          Complete
+                          {!isMobile ? 'Complete' : '✓'}
                         </button>
                       </>
                     )}
@@ .. @@
                     {photos[index] && (
                       <div className="mt-3">
                         <img
                           src={photos[index]}
                           alt={`${task.area} photo`}
-                          className="w-32 h-24 object-cover rounded-md border"
+                          className="w-20 h-16 md:w-32 md:h-24 object-cover rounded-md border"
                         />
                       </div>
                     )}
@@ .. @@
       {/* Camera Modal */}
       {showCamera && (
-        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
-          <div className="bg-white rounded-lg p-6 max-w-md w-full">
-            <h3 className="text-lg font-semibold mb-4">Take Photo</h3>
+        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2">
+          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
+            <h3 className="text-lg font-semibold mb-4">Take Photo</h3>
             
-            <div className="mb-4">
+            <div className="mb-4 relative">
               <video
                 ref={videoRef}
                 autoPlay
                 playsInline
-                className="w-full h-48 bg-gray-200 rounded-md object-cover"
+                muted
+                className="w-full h-40 md:h-48 bg-gray-200 rounded-md object-cover"
               />
             </div>
             
-            <div className="flex space-x-3">
+            <div className="flex space-x-2 md:space-x-3">
               <button
                 onClick={capturePhoto}
-                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
+                className="flex-1 bg-blue-600 text-white py-2 px-3 md:px-4 rounded-md hover:bg-blue-700 transition-colors text-sm md:text-base"
               >
                 Capture
               </button>
               <button
                 onClick={stopCamera}
-                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
+                className="flex-1 bg-gray-600 text-white py-2 px-3 md:px-4 rounded-md hover:bg-gray-700 transition-colors text-sm md:text-base"
               >
                 Cancel
               </button>
@@ .. @@
       
       {/* Hidden canvas for photo capture */}
       <canvas ref={canvasRef} style={{ display: 'none' }} />
     </div>
   );
 }