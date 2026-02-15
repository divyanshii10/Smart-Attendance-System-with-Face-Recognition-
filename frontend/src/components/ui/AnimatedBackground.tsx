import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    type: 'float' | 'wave' | 'orbit' | 'drift';
}

export const AnimatedBackground = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate 80 particles with varied movement patterns
        const movementTypes: Array<'float' | 'wave' | 'orbit' | 'drift'> = ['float', 'wave', 'orbit', 'drift'];
        const newParticles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 5,
            type: movementTypes[Math.floor(Math.random() * movementTypes.length)]
        }));
        setParticles(newParticles);
    }, []);

    const getParticleAnimation = (particle: Particle) => {
        switch (particle.type) {
            case 'wave':
                return {
                    y: [0, -50, 0],
                    x: [0, 30, 0],
                    opacity: [0.2, 0.6, 0.2],
                };
            case 'orbit':
                return {
                    x: [0, 40, 0, -40, 0],
                    y: [0, -40, 0, 40, 0],
                    opacity: [0.3, 0.5, 0.3],
                };
            case 'drift':
                return {
                    x: [0, 60],
                    y: [0, -80],
                    opacity: [0.2, 0.5, 0.2],
                };
            default:
                return {
                    y: [0, -30, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0.2, 0.5, 0.2],
                };
        }
    };

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

            {/* Background Image Layer */}
            <div
                className="absolute inset-0 opacity-15 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/assets/face-wireframe.jpg.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Gradient base */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-blue to-cyber-dark opacity-90" />

            {/* Radial gradients for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(circle at 20% 20%, rgba(0,255,255,0.08), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(160,32,240,0.06), transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0,128,255,0.05), transparent 60%)
          `,
                }}
            />

            {/* Animated particles with varied movements */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-neon-cyan/30"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={getParticleAnimation(particle)}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                    }}
                />
            ))}

            {/* Scanning grid lines */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }} />
            </div>

            {/* Animated scan lines */}
            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 2px)',
                    backgroundSize: '100% 4px',
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '0% 100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
        </div>
    );
};
