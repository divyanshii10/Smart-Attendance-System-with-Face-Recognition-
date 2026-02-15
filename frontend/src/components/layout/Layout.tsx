import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">

      {/* 🔵 Animated Scan Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0,255,255,0.15), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(0,120,255,0.15), transparent 40%),
            url('/assets/face-scan-bg.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 🔵 Cyber Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black/80 via-blue-900/40 to-black/90 backdrop-blur-sm" />

      {/* 🔵 Foreground UI */}
      <div className="relative z-10 min-h-screen text-white">
        <Sidebar />
        <Header />

        <main className="ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};