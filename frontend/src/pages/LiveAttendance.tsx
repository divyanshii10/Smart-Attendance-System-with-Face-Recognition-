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
        <h1 className="text-3xl white font-bold  font-tech">Live Attendance</h1>
        <p className="text-purple-400 mt-1">Real-time biometric face recognition system</p>
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
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Scanner Inactive</p>
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
  <div className="space-y-3">

    {/* Scanner */}
    <div className="
      flex items-center justify-between
      p-4
      bg-[#0B1220]
      border border-white/10
      rounded-xl
      hover:border-purple-500/40
      hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]
      transition-all
    ">
      <div>
        <p className="text-sm text-white font-medium">
          Scanner
        </p>
        <p className="text-xs text-gray-400">
          {isActive ? 'Capturing biometric data' : 'Ready to start'}
        </p>
      </div>

      <div className={`
        w-3 h-3 rounded-full
        ${isActive ? 'bg-purple-500' : 'bg-gray-500'}
      `}/>
    </div>

    {/* Face Detection */}
    <div className="
      flex items-center justify-between
      p-4
      bg-[#0B1220]
      border border-white/10
      rounded-xl
      hover:border-purple-500/40
      hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]
      transition-all
    ">
      <div>
        <p className="text-sm text-white font-medium">
          Face Detection
        </p>
        <p className="text-xs text-gray-400">
          {faceDetected ? 'Face in frame' : 'Waiting for face'}
        </p>
      </div>

      <div className={`
        w-3 h-3 rounded-full
        ${faceDetected ? 'bg-purple-500' : 'bg-gray-500'}
      `}/>
    </div>

    {/* ID Verification */}
    <div className="
      flex items-center justify-between
      p-4
      bg-[#0B1220]
      border border-white/10
      rounded-xl
      hover:border-purple-500/40
      hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]
      transition-all
    ">
      <div>
        <p className="text-sm text-white font-medium">
          ID Verification
        </p>
        <p className="text-xs text-gray-400">
          {idScanned ? 'Identity confirmed' : 'Pending verification'}
        </p>
      </div>

      <div className={`
        w-3 h-3 rounded-full
        ${idScanned ? 'bg-purple-500' : 'bg-gray-500'}
      `}/>
    </div>

    {/* Today's Stats */}
    <div className="
      p-4
      bg-[#0B1220]
      border border-white/10
      rounded-xl
      mt-2
    ">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">
          Today's Stats
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Verified</span>
        <span className="text-white font-semibold">132</span>
      </div>

      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-400">Failed</span>
        <span className="text-white font-semibold">3</span>
      </div>
    </div>

  </div>
</Card>

          {/* Activity Log */}
          <Card title="Activity Log">
  <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">

    {logs.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-8">
        No activity yet
      </p>
    ) : (
      logs.map((log, index) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="
            flex items-center justify-between
            p-4
            bg-[#0B1220]
            border border-white/10
            rounded-xl
            hover:border-purple-500/40
            hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]
            transition-all
          "
        >
          {/* Left */}
          <div className="flex flex-col">
            <p className="text-sm text-white font-medium">
              {log.message}
            </p>
            <p className="text-xs text-gray-400">
              System Event
            </p>
          </div>

          {/* Right */}
          <span className="text-xs text-gray-500">
            {log.timestamp}
          </span>
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
