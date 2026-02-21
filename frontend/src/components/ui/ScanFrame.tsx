import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScanFrameProps {
    isActive: boolean;
    faceDetected?: boolean;
    status?: 'idle' | 'scanning' | 'recognized' | 'failed';
    children?: ReactNode;
}

export const ScanFrame = ({
    isActive,
    faceDetected = false,
    status = 'idle',
    children
}: ScanFrameProps) => {

    const getStatusColor = () => {
        switch (status) {
            case 'scanning': return 'border-[#4F46E5]';
            case 'recognized': return 'border-[#10B981]';
            case 'failed': return 'border-[#EF4444]';
            default: return 'border-white/10';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'scanning': return 'Scanning biometrics...';
            case 'recognized': return 'Face recognized!';
            case 'failed': return 'Recognition failed';
            default: return 'Scanner inactive';
        }
    };

    return (
        <div className={`relative rounded-xl overflow-hidden border-2 ${getStatusColor()} transition-all duration-300`}>

            {/* Background Image - Face Scan */}
            {isActive && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                        backgroundImage: 'url(/assets/face-scan-bg.jpeg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Corner brackets */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top-left */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#4F46E5]/60" />
                {/* Top-right */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#4F46E5]/60" />
                {/* Bottom-left */}
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#4F46E5]/60" />
                {/* Bottom-right */}
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#4F46E5]/60" />
            </div>

            {/* Content area */}
            <div className="relative h-[450px] flex items-center justify-center">
                {children}

                {isActive && status === 'scanning' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* Radar sweep */}
                        <motion.div
                            className="absolute inset-0 border-2 border-[#4F46E5]/20 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.4, 0, 0.4],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Face bounding box */}
                        {faceDetected && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-64 h-64 border-2 border-[#4F46E5] rounded-xl"
                            >
                                {/* Scanning line */}
                                <motion.div
                                    className="absolute left-0 w-full h-0.5 bg-[#4F46E5]"
                                    animate={{ top: ['0%', '100%'] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Success animation */}
                {status === 'recognized' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-[#10B981]/15 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.5, 1],
                            }}
                            transition={{ duration: 1, repeat: 3 }}
                            className="text-[#10B981] text-6xl"
                        >
                            ✓
                        </motion.div>
                    </motion.div>
                )}
            </div>

            {/* Status indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center text-sm font-medium ${status === 'recognized' ? 'text-[#10B981]' :
                        status === 'failed' ? 'text-[#EF4444]' :
                            'text-[#9CA3AF]'
                        }`}
                >
                    {getStatusText()}
                </motion.p>
            </div>

            {/* LIVE badge */}
            {isActive && (
                <div className="absolute top-4 left-4 bg-[#10B981] px-3 py-1 rounded-lg text-sm font-semibold text-white">
                    LIVE
                </div>
            )}
        </div>
    );
};
