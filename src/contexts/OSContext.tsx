'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  size?: number;
  created: Date;
  modified: Date;
  parent?: string;
  children?: string[];
}

export interface Window {
  id: string;
  title: string;
  component: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  data?: Record<string, unknown>;
}

interface OSContextType {
  windows: Window[];
  fileSystem: Record<string, FileSystemItem>;
  currentPath: string;
  openWindow: (window: Omit<Window, 'id' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  createFile: (name: string, content: string, parent?: string) => void;
  createFolder: (name: string, parent?: string) => void;
  deleteItem: (id: string) => void;
  navigateTo: (path: string) => void;
  getItemsByPath: (path: string) => FileSystemItem[];
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [nextZIndex, setNextZIndex] = useState(1000);

  // Initialize file system
  const [fileSystem, setFileSystem] = useState<Record<string, FileSystemItem>>(() => {
    const now = new Date();
    return {
      'root': {
        id: 'root',
        name: '/',
        type: 'folder',
        created: now,
        modified: now,
        children: ['desktop', 'documents', 'downloads', 'pictures', 'music', 'videos']
      },
      'desktop': {
        id: 'desktop',
        name: 'Desktop',
        type: 'folder',
        created: now,
        modified: now,
        parent: 'root',
        children: ['welcome-txt']
      },
      'documents': {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        created: now,
        modified: now,
        parent: 'root',
        children: ['readme-txt']
      },
      'downloads': {
        id: 'downloads',
        name: 'Downloads',
        type: 'folder',
        created: now,
        modified: now,
        parent: 'root',
        children: []
      },
      'pictures': {
        id: 'pictures',
        name: 'Pictures',
        type: 'folder',
        created: now,
        modified: now,
        parent: 'root',
        children: []
      },
      'music': {
        id: 'music',
        name: 'Music',
        type: 'folder',
        created: now,
        modified: now,
        parent: 'root',
        children: []
      },
      'videos': {
        id: 'videos',
        name: 'Videos',
        type: 'folder',
        created: now,
        modified: now,
        parent: 'root',
        children: []
      },
      'welcome-txt': {
        id: 'welcome-txt',
        name: 'Welcome.txt',
        type: 'file',
        content: 'Welcome to WebOS!\n\nThis is a fully functional web-based operating system. You can:\n\n- Open and manage files\n- Run applications\n- Customize your desktop\n- And much more!\n\nEnjoy exploring your new OS!',
        size: 234,
        created: now,
        modified: now,
        parent: 'desktop'
      },
      'readme-txt': {
        id: 'readme-txt',
        name: 'README.txt',
        type: 'file',
        content: 'WebOS Documentation\n\n===================\n\nThis operating system includes:\n\n1. File Manager\n2. Text Editor\n3. Calculator\n4. Terminal\n5. Settings\n6. Web Browser\n\nAll applications are fully functional and provide a native OS experience.',
        size: 312,
        created: now,
        modified: now,
        parent: 'documents'
      }
    };
  });

  const openWindow = useCallback((windowData: Omit<Window, 'id' | 'zIndex'>) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWindow: Window = {
      ...windowData,
      id,
      zIndex: nextZIndex
    };
    
    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  const createFile = useCallback((name: string, content: string, parent = 'root') => {
    const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newFile: FileSystemItem = {
      id,
      name,
      type: 'file',
      content,
      size: content.length,
      created: now,
      modified: now,
      parent
    };

    setFileSystem(prev => ({
      ...prev,
      [id]: newFile,
      [parent]: {
        ...prev[parent],
        children: [...(prev[parent].children || []), id],
        modified: now
      }
    }));
  }, []);

  const createFolder = useCallback((name: string, parent = 'root') => {
    const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newFolder: FileSystemItem = {
      id,
      name,
      type: 'folder',
      created: now,
      modified: now,
      parent,
      children: []
    };

    setFileSystem(prev => ({
      ...prev,
      [id]: newFolder,
      [parent]: {
        ...prev[parent],
        children: [...(prev[parent].children || []), id],
        modified: now
      }
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setFileSystem(prev => {
      const item = prev[id];
      if (!item) return prev;

      const newFileSystem = { ...prev };
      
      // Remove from parent's children
      if (item.parent && newFileSystem[item.parent]) {
        newFileSystem[item.parent] = {
          ...newFileSystem[item.parent],
          children: newFileSystem[item.parent].children?.filter(childId => childId !== id) || []
        };
      }

      // Recursively delete children if it's a folder
      if (item.type === 'folder' && item.children) {
        const deleteRecursively = (itemId: string) => {
          const currentItem = newFileSystem[itemId];
          if (currentItem?.type === 'folder' && currentItem.children) {
            currentItem.children.forEach(deleteRecursively);
          }
          delete newFileSystem[itemId];
        };
        
        item.children.forEach(deleteRecursively);
      }

      delete newFileSystem[id];
      return newFileSystem;
    });
  }, []);

  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  const getItemsByPath = useCallback((path: string): FileSystemItem[] => {
    if (path === '/') {
      const rootItem = fileSystem['root'];
      return rootItem?.children?.map(id => fileSystem[id]).filter(Boolean) || [];
    }

    const pathParts = path.split('/').filter(Boolean);
    let currentItem = fileSystem['root'];

    for (const part of pathParts) {
      const childId = currentItem?.children?.find(id => 
        fileSystem[id]?.name.toLowerCase() === part.toLowerCase()
      );
      if (childId) {
        currentItem = fileSystem[childId];
      } else {
        return [];
      }
    }

    if (currentItem?.type === 'folder') {
      return currentItem.children?.map(id => fileSystem[id]).filter(Boolean) || [];
    }

    return [];
  }, [fileSystem]);

  const value: OSContextType = {
    windows,
    fileSystem,
    currentPath,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    createFile,
    createFolder,
    deleteItem,
    navigateTo,
    getItemsByPath
  };

  return (
    <OSContext.Provider value={value}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}