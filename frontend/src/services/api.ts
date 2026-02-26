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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

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
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      return user;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { user, token } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      return user;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Signup failed');
      }
      throw new Error('Network error during signup');
    }
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

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
    try {
      const res = await api.get('/dashboard/stats');
      return res.data;
    } catch (e: any) {
      console.error("Axios getStats error:", e.response?.data || e.message);
      throw new Error('Failed to fetch stats');
    }
  },

  getWeeklyData: async (): Promise<AttendanceData[]> => {
    try {
      const res = await api.get('/dashboard/weekly');
      return res.data;
    } catch (e: any) {
      console.error("Axios getWeeklyData error:", e.response?.data || e.message);
      throw new Error('Failed to fetch weekly data');
    }
  },

  getRecentActivity: async () => {
    try {
      const res = await api.get('/dashboard/recent');
      return res.data;
    } catch (e: any) {
      console.error("Axios getRecentActivity error:", e.response?.data || e.message);
      throw new Error('Failed to fetch recent activity');
    }
  },

  getDepartmentStats: async () => {
    try {
      const res = await api.get('/dashboard/departments');
      return res.data;
    } catch (e: any) {
      console.error("Axios getDepartmentStats error:", e.response?.data || e.message);
      throw new Error('Failed to fetch department stats');
    }
  }
};

export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    const res = await fetch(`${API_BASE_URL}/students/`);
    const data = await res.json();
    return data.map((s: any) => ({
      id: String(s.id),
      rollNumber: s.roll_number,
      name: s.name,
      email: s.email || "",
      department: s.department,
      year: Number(s.year) || 0,
      phoneNumber: "",
      enrollmentDate: "",
    }));
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
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete student');
    }
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

  getRecords: async (_startDate: string, _endDate: string): Promise<AttendanceRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAttendanceRecords;
  },

  getTodayStats: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/today-stats`);
    return res.json();
  }
};

export const reportsAPI = {
  getSessions: async () => {
    const res = await fetch(`${API_BASE_URL}/reports/sessions`);
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  getSessionDetail: async (sessionId: number) => {
    const res = await fetch(`${API_BASE_URL}/reports/session/${sessionId}`);
    if (!res.ok) throw new Error('Failed to fetch session detail');
    return res.json();
  },

  exportSession: (sessionId: number) => {
    // Triggers a browser file download directly
    window.open(`${API_BASE_URL}/reports/export/${sessionId}`, '_blank');
  }
};

export const settingsAPI = {
  get: async (): Promise<Settings> => {
    try {
      const res = await api.get('/settings');
      // Map API response to frontend type
      return {
        cameraId: 'default',
        confidenceThreshold: res.data.confidenceThreshold ? res.data.confidenceThreshold * 100 : 85,
        autoExport: res.data.autoExport || false,
        notificationsEnabled: true
      };
    } catch (e) {
      console.error("Failed to load settings from API", e);
      return {
        cameraId: 'default',
        confidenceThreshold: 85,
        autoExport: false,
        notificationsEnabled: true
      };
    }
  },

  update: async (settings: Partial<Settings>): Promise<Settings> => {
    const payload = {
      ...(settings.confidenceThreshold && { confidenceThreshold: settings.confidenceThreshold / 100 }),
      ...(settings.autoExport !== undefined && { autoExport: settings.autoExport })
    };
    const res = await api.post('/settings', payload);
    return {
      ...settings,
      confidenceThreshold: res.data.confidenceThreshold ? res.data.confidenceThreshold * 100 : 85,
      autoExport: res.data.autoExport
    } as Settings;
  },

  backupDatabase: () => {
    window.open(`${API_BASE_URL}/settings/backup`, '_blank');
  }
};

export interface AppNotification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
  created_at: string;
  is_read: boolean;
}

export const notificationsAPI = {
  get: async (): Promise<{ notifications: AppNotification[], unread_count: number }> => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markRead: async (id: number) => {
    const res = await api.post(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await api.post('/notifications/read-all');
    return res.data;
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
