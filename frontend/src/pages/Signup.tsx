import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signup(name, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
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

                {/* Glass Signup Card */}
                <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-8 text-white">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-[#E5E7EB]">Create Account</h2>
                        <p className="text-[#9CA3AF] mt-1 text-sm">
                            Register to access the AI dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-lg">
                            <p className="text-sm text-[#EF4444]">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                                Full Name
                            </label>

                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4F46E5]" />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
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
                                    minLength={6}
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

                        {/* Button */}
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full mt-2"
                        >
                            Sign Up
                        </Button>

                        <p className="text-center text-sm text-[#9CA3AF] mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#4F46E5] hover:text-[#4338CA] transition font-medium">
                                Sign in
                            </Link>
                        </p>

                    </form>

                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#6B7280] mt-6">
                    Powered by Computer Vision & Deep Learning
                </p>
            </div>
        </div>
    );
};
