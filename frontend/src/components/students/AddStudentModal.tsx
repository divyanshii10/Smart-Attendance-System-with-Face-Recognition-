import { useState, useEffect, useRef } from 'react';
import { X, Upload, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import api from '../../services/api';



interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DEPARTMENTS = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology',
];

const YEARS = [1, 2, 3, 4];

const defaultForm = {
    name: '',
    roll_number: '',
    department: '',
    year: '',
    email: '',
    image: null as File | null,
};

export const AddStudentModal = ({ isOpen, onClose, onSuccess }: AddStudentModalProps) => {
    const [formData, setFormData] = useState(defaultForm);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('roll_number', formData.roll_number);
            payload.append('department', formData.department);
            payload.append('year', formData.year);
            payload.append('email', formData.email);
            if (formData.image) {
                payload.append('image', formData.image);
            }

            const res = await api.post('/students/register', payload);

            console.log('Registration result:', res.data);

            setSubmitStatus('success');
            onSuccess?.();
            setTimeout(() => {
                setFormData(defaultForm);
                setImagePreview(null);
                setSubmitStatus('idle');
                onClose();
            }, 1200);
        } catch (err) {
            console.error('Registration failed:', err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(defaultForm);
        setImagePreview(null);
        onClose();
    };

    const inputClass = `
    w-full px-4 py-2
    bg-[#0B1120]
    border border-white/[0.06]
    rounded-lg
    text-[#E5E7EB]
    placeholder-[#6B7280]
    focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5]/50
    outline-none transition
  `;

    return (
        <AnimatePresence>
            {isOpen && (
                // Backdrop
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
                    onClick={handleClose}
                >
                    {/* Modal Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="
              w-full max-w-lg
              bg-[#0F1729]
              border border-white/[0.08]
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <div>
                                <h2 className="text-lg font-semibold text-[#E5E7EB]">Add New Student</h2>
                                <p className="text-xs text-[#6B7280] mt-0.5">Fill in the details to register a student</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#E5E7EB] hover:bg-white/[0.06] transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                            {/* Face Image Upload */}
                            <div className="flex flex-col items-center gap-3">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="
                    w-24 h-24 rounded-full
                    bg-[#0B1120]
                    border-2 border-dashed border-white/[0.12]
                    flex items-center justify-center
                    cursor-pointer
                    hover:border-[#4F46E5]/50
                    transition overflow-hidden
                  "
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-[#6B7280]">
                                            <User className="w-8 h-8" />
                                            <span className="text-[10px]">Upload Photo</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 text-xs text-[#4F46E5] hover:text-[#6366F1] transition"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    {imagePreview ? 'Change Photo' : 'Upload Face Image'}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>

                            {/* Name + Roll Number */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[#9CA3AF] mb-1.5">Full Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#9CA3AF] mb-1.5">Roll Number</label>
                                    <input
                                        name="roll_number"
                                        type="text"
                                        placeholder="e.g. CS2021001"
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Department + Year */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[#9CA3AF] mb-1.5">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className={inputClass + ' appearance-none'}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-[#9CA3AF] mb-1.5">Year</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className={inputClass + ' appearance-none'}
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        {YEARS.map(y => (
                                            <option key={y} value={y}>Year {y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs text-[#9CA3AF] mb-1.5">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="e.g. rahul@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                />
                            </div>

                            {/* Status Banner */}
                            {submitStatus === 'success' && (
                                <div className="text-center text-sm text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg py-2">
                                    ✅ Student registered successfully!
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="text-center text-sm text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg py-2">
                                    ❌ Registration failed. Check face image or roll number.
                                </div>
                            )}

                            {/* Footer Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                    isLoading={isSubmitting}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register Student'}
                                </Button>
                            </div>

                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
