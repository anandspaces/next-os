'use client';

import { useState } from 'react';
import { User, Lock, Monitor } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onLogin();
  };

  const handleGuestLogin = () => {
    onLogin();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Login form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md mx-4 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WebOS</h1>
          <p className="text-gray-300">Welcome to your web-based operating system</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleGuestLogin}
            className="text-blue-300 hover:text-blue-200 text-sm underline transition-colors duration-200"
          >
            Continue as Guest
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Demo credentials: Any username/password will work</p>
        </div>
      </div>

      {/* System info */}
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        <p>WebOS v1.0.0</p>
        <p>Built with Next.js & TypeScript</p>
      </div>

      {/* Time */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm">
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}