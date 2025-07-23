'use client';

import { useState, useEffect } from 'react';
import { 
  Folder, 
  File, 
  ArrowLeft, 
  Home, 
  Search, 
  Grid3X3, 
  List,
  Upload,
  FolderPlus,
  FileText,
  Trash2
} from 'lucide-react';
import { useOS, FileSystemItem } from '@/contexts/OSContext';

interface FileManagerProps {
  data?: { currentPath?: string };
}

export default function FileManager({ data }: FileManagerProps) {
  const { 
    fileSystem, 
    currentPath, 
    navigateTo, 
    getItemsByPath, 
    createFile, 
    createFolder, 
    deleteItem,
    openWindow 
  } = useOS();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [path, setPath] = useState(data?.currentPath || currentPath);

  useEffect(() => {
    if (data?.currentPath) {
      setPath(data.currentPath);
    }
  }, [data?.currentPath]);

  const items = getItemsByPath(path);
  const filteredItems = items.filter((item:any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigate = (newPath: string) => {
    setPath(newPath);
    setSelectedItems([]);
  };

  const handleBack = () => {
    if (path !== '/') {
      const pathParts = path.split('/').filter(Boolean);
      pathParts.pop();
      const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
      handleNavigate(newPath);
    }
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      const newPath = path === '/' ? `/${item.name}` : `${path}/${item.name}`;
      handleNavigate(newPath);
    } else {
      // Open file in appropriate application
      openWindow({
        title: item.name,
        component: 'TextEditor',
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
        size: { width: 600, height: 400 },
        data: { content: item.content || '', filename: item.name }
      });
    }
  };

  const handleItemClick = (item: FileSystemItem, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      setSelectedItems([item.id]);
    }
  };

  const handleNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const parentId = path === '/' ? 'root' : findItemIdByPath(path);
      if (parentId) {
        createFolder(name, parentId);
      }
    }
  };

  const handleNewFile = () => {
    const name = prompt('Enter file name:');
    if (name) {
      const parentId = path === '/' ? 'root' : findItemIdByPath(path);
      if (parentId) {
        createFile(name, '', parentId);
      }
    }
  };

  const handleDelete = () => {
    if (selectedItems.length > 0 && confirm('Are you sure you want to delete the selected items?')) {
      selectedItems.forEach(id => deleteItem(id));
      setSelectedItems([]);
    }
  };

  const findItemIdByPath = (targetPath: string): string | null => {
    if (targetPath === '/') return 'root';
    
    const pathParts = targetPath.split('/').filter(Boolean);
    let currentItem = fileSystem['root'];
    
    for (const part of pathParts) {
      const childId = currentItem?.children?.find((id:any) => 
        fileSystem[id]?.name.toLowerCase() === part.toLowerCase()
      );
      if (childId) {
        currentItem = fileSystem[childId];
      } else {
        return null;
      }
    }
    
    return currentItem?.id || null;
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '-';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              disabled={path === '/'}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavigate('/')}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Home className="w-4 h-4" />
            </button>
            <div className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded">
              {path}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded hover:bg-gray-100"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewFolder}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <button
              onClick={handleNewFile}
              className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>New File</span>
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* File listing */}
      <div className="flex-1 overflow-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>This folder is empty</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-6 gap-4">
            {filteredItems.map((item:any) => (
              <div
                key={item.id}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                className={`flex flex-col items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedItems.includes(item.id) ? 'bg-blue-100 border-2 border-blue-500' : 'border-2 border-transparent'
                }`}
              >
                {item.type === 'folder' ? (
                  <Folder className="w-12 h-12 text-blue-500 mb-2" />
                ) : (
                  <File className="w-12 h-12 text-gray-500 mb-2" />
                )}
                <span className="text-sm text-center truncate w-full" title={item.name}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-4 p-2 text-sm font-medium text-gray-600 border-b">
              <div>Name</div>
              <div>Type</div>
              <div>Size</div>
              <div>Modified</div>
            </div>
            {filteredItems.map((item:any) => (
              <div
                key={item.id}
                onClick={(e) => handleItemClick(item, e)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                className={`grid grid-cols-4 gap-4 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedItems.includes(item.id) ? 'bg-blue-100' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <File className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="text-sm text-gray-600 capitalize">{item.type}</div>
                <div className="text-sm text-gray-600">{formatFileSize(item.size)}</div>
                <div className="text-sm text-gray-600">
                  {item.modified.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-600 bg-gray-50">
        {filteredItems.length} items {selectedItems.length > 0 && `(${selectedItems.length} selected)`}
      </div>
    </div>
  );
}