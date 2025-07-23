'use client';

import { useState, useRef, useEffect } from 'react';
import { Minimize2, Square, X } from 'lucide-react';
import { useOS, Window as WindowType } from '@/contexts/OSContext';

interface WindowProps {
  window: WindowType;
  children: React.ReactNode;
}

export default function Window({ window, children }: WindowProps) {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow, 
    updateWindowPosition, 
    updateWindowSize 
  } = useOS();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      focusWindow(window.id);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    focusWindow(window.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - window.size.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - window.size.height - 48));
        updateWindowPosition(window.id, { x: newX, y: newY });
      }
      
      if (isResizing && !window.isMaximized) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
          const newWidth = Math.max(300, e.clientX - rect.left);
          const newHeight = Math.max(200, e.clientY - rect.top);
          updateWindowSize(window.id, { width: newWidth, height: newHeight });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, window, updateWindowPosition, updateWindowSize]);

  if (window.isMinimized) return null;

  const windowStyle = window.isMaximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)' }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height
      };

  return (
    <div
      ref={windowRef}
      className="absolute bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden"
      style={{ ...windowStyle, zIndex: window.zIndex }}
      onClick={() => focusWindow(window.id)}
    >
      {/* Window header */}
      <div
        className="window-header bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-medium text-gray-800 truncate">{window.title}</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Minimize2 className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={() => maximizeWindow(window.id)}
            className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Square className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="w-6 h-6 rounded hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>

      {/* Resize handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
}