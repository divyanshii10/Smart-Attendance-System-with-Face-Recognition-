import { useState, useRef, useEffect } from 'react';
import { Camera, Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ScanFrame } from '../components/ui/ScanFrame';
import type { AttendanceLog } from '../types';
import Webcam from 'react-webcam';

import { attendanceAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const LiveAttendance = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [idScanned, setIdScanned] = useState(false);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ verified: 0, failed: 0 });
  const processedStudents = useRef<Set<string>>(new Set());

  // Fetch recent attendance logs on mount
  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        const res = await fetch(`${API_URL}/attendance/recent`);
        const data = await res.json();
        if (data.success && data.records) {
          const recentLogs = data.records.map((r: any) => ({
            id: r.student_id + Math.random().toString(),
            timestamp: r.time,
            studentName: 'System',
            rollNumber: '',
            status: 'success' as const,
            message: `Student verified (ID: ${r.student_id})`
          }));
          setLogs(recentLogs);
        }
      } catch (error) {
        console.error("Failed to fetch recent logs", error);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await attendanceAPI.getTodayStats();
        setStats({ verified: data.verified, failed: data.failed });
      } catch (error) {
        console.error("Failed to fetch today's stats", error);
      }
    };

    fetchRecentLogs();
    fetchStats();
  }, []);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/attendance/start`, { method: "POST" });
      const result = await res.json();
      setSessionId(result.sessionId);
      setIsActive(true);
      processedStudents.current.clear();
      addLog('Session started successfully', 'success');
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
        await fetch(`${API_URL}/attendance/stop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId })
        });
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

  // Set up an interval to grab a frame from webcam and verify it in the backend
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(async () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            setFaceDetected(true);
            const res = await fetch(`${API_URL}/attendance/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: imageSrc,
              }),
            });
            const response = await res.json();

            if (response.status) {
              switch (response.status) {
                case "marked":
                  addLog(`✅ Scanning face recognized, attendance marked for ${response.student}`, 'success');
                  setIdScanned(true);
                  break;
                case "already_marked":
                  if (!processedStudents.current.has(response.student)) {
                    addLog(`⚠️ Student ${response.student} already marked`, 'success');
                    processedStudents.current.add(response.student);
                  }
                  setIdScanned(true);
                  break;
                case "not_found":
                  // Add log only once or throttle failure for UX, but user asked to log it
                  addLog(`❌ No records found failure`, 'failed');
                  setIdScanned(false);
                  break;
                default:
                  if (response.student) {
                    addLog(`Student verified: ${response.student}`, 'success');
                    setIdScanned(true);
                  } else {
                    setIdScanned(false);
                  }
                  break;
              }
              // Immediately fetch stats so dashboard updates
              attendanceAPI.getTodayStats().then(data => {
                setStats({ verified: data.verified, failed: data.failed });
              }).catch(e => console.error(e));
            } else {
              setIdScanned(false);
            }
          } catch (error) {
            console.error("Verification failed", error);
            setIdScanned(false);
          }
        }
      }, 3000); // Verify every 3 seconds while active
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

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
        <h1 className="text-3xl text-[#E5E7EB] font-bold">Live Attendance</h1>
        <p className="text-[#9CA3AF] mt-1">Real-time biometric face recognition system</p>
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
              {!isActive ? (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#9CA3AF]">Scanner Inactive</p>
                </div>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                  }}
                  className="w-full h-full object-cover rounded-2xl"
                />
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
      bg-[#0B1120]
      border border-white/[0.06]
      rounded-xl
      hover:border-[#4F46E5]/25
      transition-all
    ">
                <div>
                  <p className="text-sm text-[#E5E7EB] font-medium">
                    Scanner
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {isActive ? 'Capturing biometric data' : 'Ready to start'}
                  </p>
                </div>

                <div className={`
        w-3 h-3 rounded-full
        ${isActive ? 'bg-[#10B981]' : 'bg-[#6B7280]'}
      `} />
              </div>

              {/* Face Detection */}
              <div className="
      flex items-center justify-between
      p-4
      bg-[#0B1120]
      border border-white/[0.06]
      rounded-xl
      hover:border-[#4F46E5]/25
      transition-all
    ">
                <div>
                  <p className="text-sm text-[#E5E7EB] font-medium">
                    Face Detection
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {faceDetected ? 'Face in frame' : 'Waiting for face'}
                  </p>
                </div>

                <div className={`
        w-3 h-3 rounded-full
        ${faceDetected ? 'bg-[#10B981]' : 'bg-[#6B7280]'}
      `} />
              </div>

              {/* ID Verification */}
              <div className="
      flex items-center justify-between
      p-4
      bg-[#0B1120]
      border border-white/[0.06]
      rounded-xl
      hover:border-[#4F46E5]/25
      transition-all
    ">
                <div>
                  <p className="text-sm text-[#E5E7EB] font-medium">
                    ID Verification
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {idScanned ? 'Identity confirmed' : 'Pending verification'}
                  </p>
                </div>

                <div className={`
        w-3 h-3 rounded-full
        ${idScanned ? 'bg-[#10B981]' : 'bg-[#6B7280]'}
      `} />
              </div>

              {/* Today's Stats */}
              <div className="
      p-4
      bg-[#0B1120]
      border border-white/[0.06]
      rounded-xl
      mt-2
    ">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#9CA3AF]">
                    Today's Stats
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Verified</span>
                  <span className="text-[#E5E7EB] font-semibold">{stats.verified}</span>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span className="text-[#9CA3AF]">Failed</span>
                  <span className="text-[#E5E7EB] font-semibold">{stats.failed}</span>
                </div>
              </div>

            </div>
          </Card>

          {/* Activity Log */}
          <Card title="Activity Log">
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">

              {logs.length === 0 ? (
                <p className="text-sm text-[#9CA3AF] text-center py-8">
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
            bg-[#0B1120]
            border border-white/[0.06]
            rounded-xl
            hover:border-[#4F46E5]/25
            transition-all
          "
                  >
                    {/* Left */}
                    <div className="flex flex-col">
                      <p className="text-sm text-[#E5E7EB] font-medium">
                        {log.message}
                      </p>
                      <p className="text-xs text-[#9CA3AF]">
                        System Event
                      </p>
                    </div>

                    {/* Right */}
                    <span className="text-xs text-[#6B7280]">
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
