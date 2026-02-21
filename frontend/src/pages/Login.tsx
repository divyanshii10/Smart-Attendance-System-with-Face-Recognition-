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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1120]">

      {/* AI Circuit Brain Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: "url('/assets/attendance-bg.png')"
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-sm" />

      {/* Login Container */}
      <div className="relative z-10 max-w-md w-full px-6">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4F46E5]/20 border border-[#4F46E5]/40 rounded-2xl mb-4 backdrop-blur-md">
            <Camera className="w-8 h-8 text-[#4F46E5]" />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-wide">
            AttendEase AI
          </h1>

          <p className="text-[#9CA3AF] mt-2 text-sm">
            Facial Recognition Attendance System
          </p>
        </div>

        {/* Glass Login Card */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-8 text-white">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#E5E7EB]">Welcome Back</h2>
            <p className="text-[#9CA3AF] mt-1 text-sm">
              Sign in to access the AI dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-lg">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4F46E5]" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@college.edu"
                  required
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-white/[0.05] border border-white/[0.08]
                    rounded-lg outline-none
                    text-white placeholder-[#6B7280]
                    focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50
                    transition
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4F46E5]" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-white/[0.05] border border-white/[0.08]
                    rounded-lg outline-none
                    text-white placeholder-[#6B7280]
                    focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50
                    transition
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
                  className="mr-2 accent-[#4F46E5]"
                />
                <span className="text-[#9CA3AF]">Remember me</span>
              </label>

              <span className="text-[#4F46E5] hover:text-[#4338CA] cursor-pointer transition">
                Forgot password?
              </span>
            </div>

            {/* Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          {/* Demo creds */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-center text-[#6B7280]">
              Demo: admin@college.edu / admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#6B7280] mt-6">
          Powered by Computer Vision & Deep Learning
        </p>
      </div>
    </div>
  );
};
