import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* 🔵 Face Wireframe Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('/assets/face-wireframe.jpg')"
        }}
      />

      {/* 🔵 Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* 🔵 Login Container */}
      <div className="relative z-10 max-w-md w-full px-6">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 border border-cyan-400 rounded-2xl mb-4 backdrop-blur-md">
            <Camera className="w-8 h-8 text-cyan-400" />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-wide">
            AttendEase AI
          </h1>

          <p className="text-cyan-200 mt-2 text-sm">
            Facial Recognition Attendance System
          </p>
        </div>

        {/* 🔵 Glass Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-300 mt-1 text-sm">
              Sign in to access the AI dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@college.edu"
                  required
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-white/10 border border-white/20
                    rounded-lg outline-none
                    text-white placeholder-gray-400
                    focus:ring-2 focus:ring-cyan-400
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-white/10 border border-white/20
                    rounded-lg outline-none
                    text-white placeholder-gray-400
                    focus:ring-2 focus:ring-cyan-400
                  "
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 accent-cyan-400"
                />
                <span className="text-gray-300">Remember me</span>
              </label>

              <span className="text-cyan-300 hover:text-cyan-200 cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold"
            >
              Sign In
            </Button>
          </form>

          {/* Demo creds */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-center text-gray-400">
              Demo: admin@college.edu / admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Powered by Computer Vision & Deep Learning
        </p>
      </div>
    </div>
  );
};
