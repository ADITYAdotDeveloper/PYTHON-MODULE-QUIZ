import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-white flex flex-col items-center justify-center p-3 sm:p-4 selection:bg-purple-500 selection:text-white overflow-hidden relative touch-none">
      {/* Dynamic Background Gradient Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-slow opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-medium opacity-30" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <main className="relative z-10 w-full max-w-2xl h-full flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
};