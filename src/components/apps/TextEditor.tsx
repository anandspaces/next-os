'use client';

import { useState, useEffect } from 'react';
import { Save, FileText, Download, Upload } from 'lucide-react';

interface TextEditorProps {
  data?: { content?: string; filename?: string };
}

export default function TextEditor({ data }: TextEditorProps) {
  const [content, setContent] = useState(data?.content || '');
  const [filename, setFilename] = useState(data?.filename || 'Untitled.txt');
  const [isModified, setIsModified] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lines = content.split('\n').length;
    setWordCount(words);
    setLineCount(lines);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // In a real implementation, this would save to the file system
    console.log('Saving file:', filename, content);
    setIsModified(false);
    
    // Create download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setFilename(file.name);
        setIsModified(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="font-medium text-lg bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
            />
            {isModified && <span className="text-orange-500 text-sm">• Modified</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer text-sm">
              <Upload className="w-4 h-4" />
              <span>Open</span>
              <input
                type="file"
                accept=".txt,.md,.js,.ts,.json,.css,.html"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        {/* Line numbers */}
        <div className="bg-gray-50 border-r border-gray-200 p-4 text-sm text-gray-500 font-mono min-w-12 text-right">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text area */}
        <textarea
          value={content}
          onChange={handleContentChange}
          className="flex-1 p-4 font-mono text-sm resize-none outline-none leading-6"
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-600 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Lines: {lineCount}</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {content.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Plain Text</span>
        </div>
      </div>
    </div>
  );
}