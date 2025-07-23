'use client';

import { useState, useEffect } from 'react';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import DesktopIcons from './DesktopIcons';
import ContextMenu from './ContextMenu';
import { useOS } from '@/contexts/OSContext';

interface DesktopProps {
  onLogout: () => void;
}

export default function Desktop({ onLogout }: DesktopProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { openWindow } = useOS();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleClick = () => {
    setContextMenu(null);
  };

  const handleContextMenuAction = (action: string) => {
    setContextMenu(null);
    
    switch (action) {
      case 'new-folder':
        // Handle new folder creation
        break;
      case 'new-file':
        openWindow({
          title: 'New Text File',
          component: 'TextEditor',
          isMinimized: false,
          isMaximized: false,
          position: { x: 100, y: 100 },
          size: { width: 600, height: 400 },
          data: { content: '', filename: 'Untitled.txt' }
        });
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'properties':
        openWindow({
          title: 'Desktop Properties',
          component: 'Settings',
          isMinimized: false,
          isMaximized: false,
          position: { x: 200, y: 150 },
          size: { width: 500, height: 400 }
        });
        break;
    }
  };

  return (
    <div 
      className="h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden select-none"
      onContextMenu={handleRightClick}
      onClick={handleClick}
    >
      {/* Desktop wallpaper overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Desktop icons */}
      <DesktopIcons />
      
      {/* Window manager */}
      <WindowManager />
      
      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}
      
      {/* Taskbar */}
      <Taskbar currentTime={currentTime} onLogout={onLogout} />
    </div>
  );
}