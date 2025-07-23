'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search, Shield, Globe } from 'lucide-react';

export default function WebBrowser() {
  const [url, setUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(['https://example.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const bookmarks = [
    { name: 'Google', url: 'https://google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'MDN', url: 'https://developer.mozilla.org' }
  ];

  const handleNavigate = (newUrl: string) => {
    setIsLoading(true);
    setUrl(newUrl);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(url);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Browser toolbar */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex === history.length - 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 rounded hover:bg-gray-100"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => handleNavigate('https://example.com')}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Address bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1">
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter URL or search..."
              />
            </div>
          </form>

          {/* Search button */}
          <button
            onClick={() => handleNavigate(`https://google.com/search?q=${encodeURIComponent(url)}`)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarks bar */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm text-gray-600">Bookmarks:</span>
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.name}
              onClick={() => handleNavigate(bookmark.url)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {bookmark.name}
            </button>
          ))}
        </div>
      </div>

      {/* Browser content */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {url}...</p>
          </div>
        ) : (
          <div className="text-center max-w-md">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">WebOS Browser</h2>
            <p className="text-gray-600 mb-4">
              This is a demo browser interface. In a real implementation, this would display web content.
            </p>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
              <div className="text-sm text-gray-600 mb-2">Current URL:</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">{url}</div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-600 bg-gray-50">
        {isLoading ? 'Loading...' : 'Ready'}
      </div>
    </div>
  );
}