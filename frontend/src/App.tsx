import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout/Layout";

import Landing from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { LiveAttendance } from "./pages/LiveAttendance";
import { Students } from "./pages/Students";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* 🟢 LANDING PAGE (Public) */}
      <Route path="/" element={<Landing />} />

      {/* 🟢 LOGIN / SIGNUP (Public) */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
        }
      />

      {/* 🔒 DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 🔒 LIVE ATTENDANCE */}
      <Route
        path="/live-attendance"
        element={
          <ProtectedRoute>
            <Layout>
              <LiveAttendance />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 🔒 STUDENTS */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 🔒 REPORTS */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 🔒 SETTINGS */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ❌ FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;