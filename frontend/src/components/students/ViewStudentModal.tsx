import { X, User, Mail, Hash, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Student } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface ViewStudentModalProps {
    student: Student | null;
    onClose: () => void;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.06] last:border-0">
        <div className="mt-0.5 text-[#4F46E5]">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-[#6B7280] mb-0.5">{label}</p>
            <p className="text-sm text-[#E5E7EB] font-medium truncate">
                {value || <span className="text-[#4B5563] font-normal">—</span>}
            </p>
        </div>
    </div>
);

export const ViewStudentModal = ({ student, onClose }: ViewStudentModalProps) => {
    // Build photo URL from roll number
    const photoUrl = student
        ? `${API_URL}/uploads/students/${student.rollNumber}.jpg`
        : null;

    return (
        <AnimatePresence>
            {student && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-full max-w-sm bg-[#0F1729] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <div>
                                <h2 className="text-lg font-semibold text-[#E5E7EB]">Student Profile</h2>
                                <p className="text-xs text-[#6B7280] mt-0.5">Registered identity record</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#E5E7EB] hover:bg-white/[0.06] transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-2 pt-6 pb-4 px-6">
                            <div className="w-20 h-20 rounded-full bg-[#0B1120] border-2 border-white/[0.08] overflow-hidden flex items-center justify-center">
                                <img
                                    src={photoUrl!}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <User className="w-8 h-8 text-[#4B5563] hidden" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-[#E5E7EB]">{student.name}</p>
                                <p className="text-xs text-[#6B7280]">{student.rollNumber}</p>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="px-6 pb-6">
                            <div className="bg-[#0B1120] rounded-xl px-4 py-1 border border-white/[0.06]">
                                <InfoRow icon={<Hash className="w-4 h-4" />} label="Roll Number" value={student.rollNumber} />
                                <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Department" value={student.department} />
                                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Year" value={student.year ? `Year ${student.year}` : ''} />
                                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={student.email} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
