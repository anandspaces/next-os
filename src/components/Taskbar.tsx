'use client';

import { useState } from 'react';
import { 
  Menu, 
  Search, 
  Folder, 
  Calculator, 
  Terminal, 
  Settings, 
  Globe, 
  FileText,
  LogOut,
  Monitor,
  Minimize2,
  Square,
  X
} from 'lucide-react';
import { useOS } from '@/contexts/OSContext';

interface TaskbarProps {
  currentTime: Date;
  onLogout: () => void;
}

export default function Taskbar({ currentTime, onLogout }: TaskbarProps) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { windows, openWindow, minimizeWindow, focusWindow, closeWindow } = useOS();

  const applications = [
    { name: 'File Manager', icon: Folder, component: 'FileManager' },
    { name: 'Text Editor', icon: FileText, component: 'TextEditor' },
    { name: 'Calculator', icon: Calculator, component: 'Calculator' },
    { name: 'Terminal', icon: Terminal, component: 'Terminal' },
    { name: 'Web Browser', icon: Globe, component: 'WebBrowser' },
    { name: 'Settings', icon: Settings, component: 'Settings' }
  ];

  const handleAppClick = (app: typeof applications[0]) => {
    setIsStartMenuOpen(false);
    
    const defaultData = app.component === 'TextEditor' 
      ? { content: '', filename: 'Untitled.txt' }
      : app.component === 'FileManager'
      ? { currentPath: '/' }
      : undefined;

    openWindow({
      title: app.name,
      component: app.component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 },
      size: { width: 800, height: 600 },
      data: defaultData
    });
  };

  return (
    <>
      {/* Start Menu */}
      {isStartMenuOpen && (
        <div className="absolute bottom-12 left-0 w-80 bg-gray-900/95 backdrop-blur-lg rounded-tr-lg border-t border-r border-gray-700 shadow-2xl">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">User</div>
                <div className="text-gray-400 text-sm">WebOS</div>
              </div>
            </div>

            <div className="space-y-1">
              {applications.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleAppClick(app)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-left"
                >
                  <app.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-white">{app.name}</span>
                </button>
              ))}
              
              <div className="border-t border-gray-700 pt-2 mt-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors duration-200 text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700 flex items-center px-2 z-50">
        {/* Start button */}
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            isStartMenuOpen ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Menu className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Start</span>
        </button>

        {/* Search */}
        <div className="flex items-center space-x-2 ml-4 bg-gray-800 rounded-lg px-3 py-1">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-white text-sm outline-none w-32"
          />
        </div>

        {/* Window buttons */}
        <div className="flex-1 flex items-center space-x-1 ml-4">
          {windows.filter(w => !w.isMinimized).map((window) => (
            <button
              key={window.id}
              onClick={() => focusWindow(window.id)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm max-w-48 truncate"
            >
              <span className="truncate">{window.title}</span>
            </button>
          ))}
        </div>

        {/* System tray */}
        <div className="flex items-center space-x-4 text-white text-sm">
          <div className="text-center">
            <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-xs text-gray-400">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}