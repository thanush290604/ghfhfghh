import React, { useState, useRef } from 'react';
import { Upload, Play, AlertCircle, CheckCircle, Video, FileVideo, X } from 'lucide-react';

const VideoDetectionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setVideoUrl(null);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    // Simulate processing - In real implementation, this would upload to Flask backend
    setTimeout(() => {
      setVideoUrl('/api/video-stream'); // This would be your Flask video stream endpoint
      setIsProcessing(false);
    }, 2000);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setVideoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Video Safety Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a video file to analyze PPE compliance and safety violations using our YOLOv8 detection model.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-primary-600" />
                Upload Video File
              </h2>

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragActive
                    ? 'border-primary-400 bg-primary-50'
                    : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-green-700">File Selected</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileVideo className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your video file here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Supports MP4, AVI, MOV, and other video formats
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isProcessing}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    selectedFile && !isProcessing
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Processing Video...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Detection
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Detection Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Protective Helmet Detection</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Safety Jacket & Gloves</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Dust Mask & Eye Wear</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Protective Boots & Shield</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Display Section */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary-600" />
                Detection Results
              </h2>

              <div className="video-container bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {videoUrl ? (
                  <img
                    src={videoUrl}
                    alt="Video Detection Stream"
                    className="video-stream"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No video selected</p>
                      <p className="text-sm">Upload a video file to start detection</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Panel */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Model Status</span>
                  <span className="status-indicator online text-sm font-medium text-green-700">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Processing Speed</span>
                  <span className="text-sm font-medium text-gray-900">30 FPS</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Detection Confidence</span>
                  <span className="text-sm font-medium text-gray-900">≥ 50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 card">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Upload a video file containing industrial workers</li>
                <li>• The system will automatically detect PPE items in real-time</li>
                <li>• Different colored bounding boxes indicate different safety equipment</li>
                <li>• Only detections with confidence ≥ 50% are displayed</li>
                <li>• The processed video stream will show detection results with labels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetectionPage;