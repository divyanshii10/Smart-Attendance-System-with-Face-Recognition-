import axios from 'axios';
import type {
  User,
  Student,
  AttendanceRecord,
  DashboardStats,
  AttendanceData,
  Department,
  Settings
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@college.edu' && password === 'admin123') {
      const user: User = {
        id: '1',
        email: 'admin@college.edu',
        name: 'Admin User',
        role: 'admin'
      };
      localStorage.setItem('authToken', 'mock-token-123');
      return user;
    }
    throw new Error('Invalid credentials');
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    return {
      id: '1',
      email: 'admin@college.edu',
      name: 'Admin User',
      role: 'admin'
    };
  }
};

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalStudents: 150,
      todayPresent: 132,
      todayAbsent: 18,
      attendancePercentage: 88
    };
  },

  getWeeklyData: async (): Promise<AttendanceData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { date: 'Mon', present: 128, absent: 22, percentage: 85 },
      { date: 'Tue', present: 135, absent: 15, percentage: 90 },
      { date: 'Wed', present: 130, absent: 20, percentage: 87 },
      { date: 'Thu', present: 132, absent: 18, percentage: 88 },
      { date: 'Fri', present: 140, absent: 10, percentage: 93 },
      { date: 'Sat', present: 125, absent: 25, percentage: 83 },
      { date: 'Sun', present: 120, absent: 30, percentage: 80 },
    ];
  }
};

export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStudents;
  },

  getById: async (id: string): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  },

  create: async (student: Omit<Student, 'id'>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...student, id: Math.random().toString() };
  },

  update: async (id: string, student: Partial<Student>): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = mockStudents.find(s => s.id === id);
    if (!existing) throw new Error('Student not found');
    return { ...existing, ...student };
  }
};

export const attendanceAPI = {
  startSession: async (): Promise<{ success: boolean; sessionId: string }> => {
    const response = await api.post('/attendance/start');
    return response.data;
  },

  stopSession: async (sessionId: string): Promise<{ success: boolean }> => {
    const response = await api.post('/attendance/stop', { sessionId });
    return response.data;
  },

  verifyAttendance: async (image_base64: string): Promise<{ success: boolean; student?: string; message?: string }> => {
    const response = await api.post('/attendance/verify', { image: image_base64 });
    return response.data;
  },

  markAttendance: async (studentId: string, method: 'face' | 'id_card'): Promise<AttendanceRecord> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Math.random().toString(),
      studentId,
      studentName: 'John Doe',
      rollNumber: 'CS2021001',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'present',
      method,
      confidence: Math.random() * 20 + 80
    };
  },

  getRecords: async (startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAttendanceRecords;
  },

  getTodayStats: async () => {
    const res = await fetch("http://127.0.0.1:8000/attendance/today-stats");
    return res.json();
  }
};

export const settingsAPI = {
  get: async (): Promise<Settings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      cameraId: 'default',
      confidenceThreshold: 85,
      autoExport: false,
      notificationsEnabled: true
    };
  },

  update: async (settings: Partial<Settings>): Promise<Settings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      cameraId: 'default',
      confidenceThreshold: 85,
      autoExport: false,
      notificationsEnabled: true,
      ...settings
    };
  }
};

export const departmentsAPI = {
  getAll: async (): Promise<Department[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', name: 'Computer Science', code: 'CS' },
      { id: '2', name: 'Electronics', code: 'EC' },
      { id: '3', name: 'Mechanical', code: 'ME' },
      { id: '4', name: 'Civil', code: 'CE' },
      { id: '5', name: 'Information Technology', code: 'IT' }
    ];
  }
};

const mockStudents: Student[] = [
  {
    id: '1',
    rollNumber: 'CS2021001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    department: 'Computer Science',
    year: 3,
    phoneNumber: '+91-9876543210',
    enrollmentDate: '2021-08-15',
  },
  {
    id: '2',
    rollNumber: 'CS2021002',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    department: 'Computer Science',
    year: 3,
    phoneNumber: '+91-9876543211',
    enrollmentDate: '2021-08-15',
  },
  {
    id: '3',
    rollNumber: 'EC2021001',
    name: 'Amit Kumar',
    email: 'amit.kumar@college.edu',
    department: 'Electronics',
    year: 3,
    phoneNumber: '+91-9876543212',
    enrollmentDate: '2021-08-15',
  },
  {
    id: '4',
    rollNumber: 'ME2021001',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@college.edu',
    department: 'Mechanical',
    year: 3,
    phoneNumber: '+91-9876543213',
    enrollmentDate: '2021-08-15',
  },
  {
    id: '5',
    rollNumber: 'CS2021003',
    name: 'Arjun Singh',
    email: 'arjun.singh@college.edu',
    department: 'Computer Science',
    year: 3,
    phoneNumber: '+91-9876543214',
    enrollmentDate: '2021-08-15',
  }
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Rahul Sharma',
    rollNumber: 'CS2021001',
    date: new Date().toISOString().split('T')[0],
    time: '09:15 AM',
    status: 'present',
    method: 'face',
    confidence: 95.5
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Priya Patel',
    rollNumber: 'CS2021002',
    date: new Date().toISOString().split('T')[0],
    time: '09:18 AM',
    status: 'present',
    method: 'face',
    confidence: 92.3
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Amit Kumar',
    rollNumber: 'EC2021001',
    date: new Date().toISOString().split('T')[0],
    time: '09:20 AM',
    status: 'present',
    method: 'id_card',
    confidence: 98.7
  }
];

export default api;
