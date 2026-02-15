export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  department: string;
  year: number;
  phoneNumber: string;
  enrollmentDate: string;
  photoUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
  method: 'face' | 'manual' | 'id_card';
  confidence?: number;
}

export interface DashboardStats {
  totalStudents: number;
  todayPresent: number;
  todayAbsent: number;
  attendancePercentage: number;
}

export interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  percentage: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface LiveAttendanceStatus {
  isActive: boolean;
  faceDetected: boolean;
  idScanned: boolean;
  currentStudent?: Student;
  verificationResult?: 'success' | 'failed' | 'pending';
  confidence?: number;
}

export interface AttendanceLog {
  id: string;
  timestamp: string;
  studentName: string;
  rollNumber: string;
  status: 'success' | 'failed';
  message: string;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  department?: string;
  year?: number;
}

export interface Settings {
  cameraId: string;
  confidenceThreshold: number;
  autoExport: boolean;
  notificationsEnabled: boolean;
}
