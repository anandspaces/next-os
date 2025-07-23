'use client';

import { useEffect, useRef } from 'react';
import { FolderPlus, FileText, RotateCcw, Settings } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onAction: (action: string) => void;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onAction, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { label: 'New Folder', icon: FolderPlus, action: 'new-folder' },
    { label: 'New Text File', icon: FileText, action: 'new-file' },
    { label: 'Refresh', icon: RotateCcw, action: 'refresh' },
    { label: 'Properties', icon: Settings, action: 'properties' }
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bg-gray-900/95 backdrop-blur-lg rounded-lg border border-gray-700 shadow-2xl py-2 min-w-48 z-50"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => (
        <button
          key={item.action}
          onClick={() => onAction(item.action)}
          className="w-full flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200 text-left"
        >
          <item.icon className="w-4 h-4 text-gray-400" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}