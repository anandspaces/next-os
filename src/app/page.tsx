'use client';

import { useState, useEffect } from 'react';
import Desktop from '@/components/Desktop';
import LoginScreen from '@/components/LoginScreen';
import { OSProvider } from '@/contexts/OSContext';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate boot time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-mono">WebOS Loading...</div>
          <div className="text-gray-400 text-sm mt-2">Initializing system...</div>
        </div>
      </div>
    );
  }

  return (
    <OSProvider>
      <div className="h-screen overflow-hidden">
        {isLoggedIn ? (
          <Desktop onLogout={() => setIsLoggedIn(false)} />
        ) : (
          <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        )}
      </div>
    </OSProvider>
  );
}