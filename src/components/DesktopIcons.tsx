'use client';

import { Folder, FileText, Trash2, Settings } from 'lucide-react';
import { useOS } from '@/contexts/OSContext';

export default function DesktopIcons() {
  const { openWindow } = useOS();

  const desktopItems = [
    {
      name: 'My Documents',
      icon: Folder,
      action: () => openWindow({
        title: 'File Manager - Documents',
        component: 'FileManager',
        isMinimized: false,
        isMaximized: false,
        position: { x: 100, y: 100 },
        size: { width: 800, height: 600 },
        data: { currentPath: '/Documents' }
      })
    },
    {
      name: 'Welcome.txt',
      icon: FileText,
      action: () => openWindow({
        title: 'Welcome.txt',
        component: 'TextEditor',
        isMinimized: false,
        isMaximized: false,
        position: { x: 150, y: 150 },
        size: { width: 600, height: 400 },
        data: { 
          content: 'Welcome to WebOS!\n\nThis is a fully functional web-based operating system. You can:\n\n- Open and manage files\n- Run applications\n- Customize your desktop\n- And much more!\n\nEnjoy exploring your new OS!',
          filename: 'Welcome.txt'
        }
      })
    },
    {
      name: 'Recycle Bin',
      icon: Trash2,
      action: () => openWindow({
        title: 'Recycle Bin',
        component: 'FileManager',
        isMinimized: false,
        isMaximized: false,
        position: { x: 200, y: 200 },
        size: { width: 600, height: 400 },
        data: { currentPath: '/Trash' }
      })
    },
    {
      name: 'Settings',
      icon: Settings,
      action: () => openWindow({
        title: 'Settings',
        component: 'Settings',
        isMinimized: false,
        isMaximized: false,
        position: { x: 250, y: 250 },
        size: { width: 500, height: 400 }
      })
    }
  ];

  return (
    <div className="absolute top-4 left-4 space-y-6">
      {desktopItems.map((item, index) => (
        <div
          key={item.name}
          onDoubleClick={item.action}
          className="flex flex-col items-center cursor-pointer group w-20"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-2 group-hover:bg-white/30 transition-colors duration-200 border border-white/30">
            <item.icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs text-center leading-tight bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}