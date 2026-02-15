import { useState } from 'react';
import { Camera, Play, Square, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { attendanceAPI } from '../services/api';
import type { AttendanceLog } from '../types';

export const LiveAttendance = () => {
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [idScanned, setIdScanned] = useState(false);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const result = await attendanceAPI.startSession();
      setSessionId(result.sessionId);
      setIsActive(true);
      addLog('Session started successfully', 'success');
      simulateLiveDetection();
    } catch (error) {
      addLog('Failed to start session', 'failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSession = async () => {
    if (sessionId) {
      setIsLoading(true);
      try {
        await attendanceAPI.stopSession(sessionId);
        setIsActive(false);
        setSessionId(null);
        setFaceDetected(false);
        setIdScanned(false);
        addLog('Session stopped', 'success');
      } catch (error) {
        addLog('Failed to stop session', 'failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const simulateLiveDetection = () => {
    setTimeout(() => {
      setFaceDetected(true);
      addLog('Face detected in frame', 'success');

      setTimeout(() => {
        setIdScanned(true);
        addLog('ID card scanned successfully', 'success');

        setTimeout(() => {
          addLog('Student verified: Rahul Sharma (CS2021001)', 'success');
          setFaceDetected(false);
          setIdScanned(false);
        }, 2000);
      }, 2000);
    }, 3000);
  };

  const addLog = (message: string, status: 'success' | 'failed') => {
    const newLog: AttendanceLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      studentName: 'System',
      rollNumber: '',
      status,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 20));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Attendance</h1>
        <p className="text-gray-600 mt-1">Real-time face recognition and ID verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
                <Card title="Live Face Scanner">

        <div className="relative rounded-xl overflow-hidden border border-cyan-400/30">

          {/* 🔵 Background Scan Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage: "url('/assets/face-scan-bg.jpg')"
            }}
          />

          {/* 🔵 Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* 🔵 Scanner Frame */}
          <div className="relative h-[450px] flex items-center justify-center">

            {isActive ? (
              <div className="relative">

                {/* Face Box */}
                <div className="w-64 h-64 border-2 border-cyan-400 animate-pulse rounded-xl" />

                {/* Scanning Line */}
                <div className="absolute left-0 w-full h-1 bg-cyan-400 animate-[scan_2s_linear_infinite]" />

                <p className="text-center text-cyan-300 mt-6 text-sm">
                  Scanning face biometrics...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <p className="text-cyan-300">Scanner Inactive</p>
              </div>
            )}
          </div>

          {/* LIVE Badge */}
          {isActive && (
            <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-lg text-sm font-semibold animate-pulse">
              LIVE
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center">
          {!isActive ? (
            <Button
              onClick={handleStartSession}
              isLoading={isLoading}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              leftIcon={<Play className="w-5 h-5" />}
            >
              Start Scan
            </Button>
          ) : (
            <Button
              onClick={handleStopSession}
              isLoading={isLoading}
              className="bg-red-500 hover:bg-red-600"
              leftIcon={<Square className="w-5 h-5" />}
            >
              Stop Scan
            </Button>
          )}
        </div>

      </Card>
        </div>

        <div className="space-y-6">
          <Card title="Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Session Status</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Face Detection</span>
                {faceDetected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">ID Verification</span>
                {idScanned ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Today's Stats</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-700">Verified</span>
                    <span className="text-xs font-semibold text-blue-900">132</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-700">Failed</span>
                    <span className="text-xs font-semibold text-blue-900">3</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Activity Log">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border ${
                      log.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-xs font-medium ${
                        log.status === 'success' ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {log.message}
                      </p>
                      <span className={`text-xs ${
                        log.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
