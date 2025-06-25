import React, { useState, useEffect } from 'react';
import { Camera, Play, Square, AlertTriangle, Activity, Users, Shield } from 'lucide-react';

const LiveWebcamPage: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [detectionStats, setDetectionStats] = useState({
    totalDetections: 0,
    safeWorkers: 0,
    violations: 0,
    confidence: 0
  });

  const startStream = () => {
    setIsStreaming(true);
    // In real implementation, this would connect to your Flask webcam endpoint
    setStreamUrl('/api/webcam-stream'); // This would be your Flask webcam stream endpoint
    
    // Simulate detection stats updates
    const interval = setInterval(() => {
      setDetectionStats(prev => ({
        totalDetections: Math.floor(Math.random() * 10) + 1,
        safeWorkers: Math.floor(Math.random() * 8) + 1,
        violations: Math.floor(Math.random() * 3),
        confidence: Math.floor(Math.random() * 20) + 80
      }));
    }, 2000);

    return () => clearInterval(interval);
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStreamUrl(null);
    setDetectionStats({
      totalDetections: 0,
      safeWorkers: 0,
      violations: 0,
      confidence: 0
    });
  };

  const detectionClasses = [
    { name: 'Protective Helmet', color: 'bg-blue-500', detected: isStreaming },
    { name: 'Safety Jacket', color: 'bg-green-500', detected: isStreaming },
    { name: 'Protective Gloves', color: 'bg-purple-500', detected: isStreaming },
    { name: 'Dust Mask', color: 'bg-yellow-500', detected: false },
    { name: 'Eye Wear', color: 'bg-red-500', detected: false },
    { name: 'Safety Boots', color: 'bg-indigo-500', detected: isStreaming },
    { name: 'Shield', color: 'bg-pink-500', detected: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Live Webcam Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time PPE detection using your webcam. Monitor workplace safety compliance as it happens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-primary-600" />
                  Live Video Feed
                </h2>
                <div className="flex items-center space-x-2">
                  {isStreaming && (
                    <span className="status-indicator online text-sm font-medium text-green-700">
                      Live
                    </span>
                  )}
                </div>
              </div>

              <div className="video-container bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {streamUrl ? (
                  <img
                    src={streamUrl}
                    alt="Live Webcam Stream"
                    className="video-stream"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Webcam Not Active</p>
                      <p className="text-sm">Click start to begin live detection</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-4 flex justify-center">
                {!isStreaming ? (
                  <button
                    onClick={startStream}
                    className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Live Detection
                  </button>
                ) : (
                  <button
                    onClick={stopStream}
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Detection
                  </button>
                )}
              </div>
            </div>

            {/* Real-time Stats */}
            {isStreaming && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.totalDetections}</div>
                  <div className="text-sm text-gray-600">Total Detected</div>
                </div>
                <div className="card text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.safeWorkers}</div>
                  <div className="text-sm text-gray-600">Safe Workers</div>
                </div>
                <div className="card text-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.violations}</div>
                  <div className="text-sm text-gray-600">Violations</div>
                </div>
                <div className="card text-center">
                  <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{detectionStats.confidence}%</div>
                  <div className="text-sm text-gray-600">Avg Confidence</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Detection Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Camera</span>
                  <span className={`status-indicator text-sm font-medium ${isStreaming ? 'online text-green-700' : 'offline text-red-700'}`}>
                    {isStreaming ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">AI Model</span>
                  <span className="status-indicator online text-sm font-medium text-green-700">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Frame Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {isStreaming ? '30 FPS' : '0 FPS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detection Classes */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PPE Detection Classes</h3>
              <div className="space-y-2">
                {detectionClasses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${item.detected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ensure proper lighting for accurate detection</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Position camera to capture full body view</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Allow camera access when prompted</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Monitor alerts for safety violations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 card">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Detection Instructions</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Click "Start Live Detection" to activate your webcam</li>
                <li>• The system will analyze the video feed in real-time</li>
                <li>• PPE items will be highlighted with colored bounding boxes</li>
                <li>• Safety violations will trigger immediate alerts</li>
                <li>• Monitor the statistics panel for compliance metrics</li>
                <li>• Ensure good lighting and clear view of workers for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveWebcamPage;