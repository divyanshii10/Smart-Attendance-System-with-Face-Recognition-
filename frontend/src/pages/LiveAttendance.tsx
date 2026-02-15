import { useState } from 'react';
import { Camera, Play, Square, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ScanFrame } from '../components/ui/ScanFrame';
import { StatusIndicator } from '../components/ui/StatusIndicator';
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

  const getScannerStatus = () => {
    if (!isActive) return 'idle';
    if (idScanned) return 'recognized';
    if (faceDetected) return 'scanning';
    return 'scanning';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text font-tech">Live Attendance</h1>
        <p className="text-cyan-300/70 mt-1">Real-time biometric face recognition system</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {/* Scanner Frame */}
            <ScanFrame
              isActive={isActive}
              faceDetected={faceDetected}
              status={getScannerStatus()}
            >
              {!isActive && (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <p className="text-cyan-300">Scanner Inactive</p>
                </div>
              )}
            </ScanFrame>

            {/* Control Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              {!isActive ? (
                <Button
                  onClick={handleStartSession}
                  isLoading={isLoading}
                  variant="primary"
                  size="lg"
                  leftIcon={<Play className="w-5 h-5" />}
                >
                  Start Scanning
                </Button>
              ) : (
                <Button
                  onClick={handleStopSession}
                  isLoading={isLoading}
                  variant="danger"
                  size="lg"
                  leftIcon={<Square className="w-5 h-5" />}
                >
                  Stop Scanning
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* System Status */}
          <Card title="System Status">
            <div className="space-y-4">
              <StatusIndicator
                status={isActive ? 'active' : 'inactive'}
                label="Scanner"
                description={isActive ? 'Capturing biometric data' : 'Ready to start'}
              />

              <StatusIndicator
                status={faceDetected ? 'active' : 'inactive'}
                label="Face Detection"
                description={faceDetected ? 'Face in frame' : 'Waiting for face'}
              />

              <StatusIndicator
                status={idScanned ? 'active' : 'inactive'}
                label="ID Verification"
                description={idScanned ? 'Identity confirmed' : 'Pending verification'}
              />

              <div className="p-4 glass rounded-lg border border-cyan-400/20 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">Today's Stats</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-300/70">Verified</span>
                    <span className="font-semibold text-white">132</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-300/70">Failed</span>
                    <span className="font-semibold text-white">3</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Log */}
          <Card title="Activity Log">
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {logs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No activity yet</p>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border backdrop-blur-sm ${log.status === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-xs font-medium flex-1 ${log.status === 'success' ? 'text-green-300' : 'text-red-300'
                        }`}>
                        {log.message}
                      </p>
                      <span className={`text-xs ml-2 ${log.status === 'success' ? 'text-green-400/70' : 'text-red-400/70'
                        }`}>
                        {log.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
