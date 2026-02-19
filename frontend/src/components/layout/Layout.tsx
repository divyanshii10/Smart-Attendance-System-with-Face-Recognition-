import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Animated Background */}
      {/* <AnimatedBackground /> */}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <Sidebar />
        <Header />

        <main className="ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};