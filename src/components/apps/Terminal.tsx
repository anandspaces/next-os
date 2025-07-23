'use client';

import { useState, useEffect, useRef } from 'react';
import { useOS } from '@/contexts/OSContext';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: 'WebOS Terminal v1.0.0',
      timestamp: new Date()
    },
    {
      type: 'output',
      content: 'Type "help" for available commands.',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('/');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { fileSystem, getItemsByPath, createFile, createFolder, deleteItem, openWindow } = useOS();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, { type, content, timestamp: new Date() }]);
  };

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    addLine('input', `user@webos:${currentPath}$ ${trimmedCommand}`);
    
    const [cmd, ...args] = trimmedCommand.split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        addLine('output', 'Available commands:');
        addLine('output', '  help          - Show this help message');
        addLine('output', '  ls            - List directory contents');
        addLine('output', '  cd <path>     - Change directory');
        addLine('output', '  pwd           - Print working directory');
        addLine('output', '  mkdir <name>  - Create directory');
        addLine('output', '  touch <name>  - Create file');
        addLine('output', '  rm <name>     - Remove file/directory');
        addLine('output', '  cat <file>    - Display file contents');
        addLine('output', '  echo <text>   - Display text');
        addLine('output', '  clear         - Clear terminal');
        addLine('output', '  date          - Show current date/time');
        addLine('output', '  whoami        - Show current user');
        addLine('output', '  uname         - Show system information');
        break;

      case 'ls':
        const items = getItemsByPath(currentPath);
        if (items.length === 0) {
          addLine('output', 'Directory is empty');
        } else {
          items.forEach((item:any) => {
            const prefix = item.type === 'folder' ? 'd' : '-';
            const size = item.size ? item.size.toString().padStart(8) : '       -';
            const date = item.modified.toLocaleDateString();
            addLine('output', `${prefix}rwxr-xr-x 1 user user ${size} ${date} ${item.name}`);
          });
        }
        break;

      case 'cd':
        if (args.length === 0) {
          setCurrentPath('/');
          addLine('output', 'Changed to home directory');
        } else {
          const targetPath = args[0];
          if (targetPath === '..') {
            if (currentPath !== '/') {
              const pathParts = currentPath.split('/').filter(Boolean);
              pathParts.pop();
              setCurrentPath(pathParts.length > 0 ? '/' + pathParts.join('/') : '/');
            }
          } else if (targetPath === '/') {
            setCurrentPath('/');
          } else {
            const newPath = currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`;
            const targetItems = getItemsByPath(newPath);
            if (targetItems !== null) {
              setCurrentPath(newPath);
            } else {
              addLine('error', `cd: ${targetPath}: No such file or directory`);
            }
          }
        }
        break;

      case 'pwd':
        addLine('output', currentPath);
        break;

      case 'mkdir':
        if (args.length === 0) {
          addLine('error', 'mkdir: missing operand');
        } else {
          const parentId = currentPath === '/' ? 'root' : findItemIdByPath(currentPath);
          if (parentId) {
            createFolder(args[0], parentId);
            addLine('output', `Directory '${args[0]}' created`);
          }
        }
        break;

      case 'touch':
        if (args.length === 0) {
          addLine('error', 'touch: missing operand');
        } else {
          const parentId = currentPath === '/' ? 'root' : findItemIdByPath(currentPath);
          if (parentId) {
            createFile(args[0], '', parentId);
            addLine('output', `File '${args[0]}' created`);
          }
        }
        break;

      case 'rm':
        if (args.length === 0) {
          addLine('error', 'rm: missing operand');
        } else {
          const items = getItemsByPath(currentPath);
          const targetItem = items.find((item:any) => item.name === args[0]);
          if (targetItem) {
            deleteItem(targetItem.id);
            addLine('output', `'${args[0]}' removed`);
          } else {
            addLine('error', `rm: cannot remove '${args[0]}': No such file or directory`);
          }
        }
        break;

      case 'cat':
        if (args.length === 0) {
          addLine('error', 'cat: missing operand');
        } else {
          const items = getItemsByPath(currentPath);
          const targetItem = items.find((item:any) => item.name === args[0]);
          if (targetItem && targetItem.type === 'file') {
            addLine('output', targetItem.content || '');
          } else if (targetItem && targetItem.type === 'folder') {
            addLine('error', `cat: ${args[0]}: Is a directory`);
          } else {
            addLine('error', `cat: ${args[0]}: No such file or directory`);
          }
        }
        break;

      case 'echo':
        addLine('output', args.join(' '));
        break;

      case 'clear':
        setLines([]);
        break;

      case 'date':
        addLine('output', new Date().toString());
        break;

      case 'whoami':
        addLine('output', 'user');
        break;

      case 'uname':
        addLine('output', 'WebOS 1.0.0 (web-based operating system)');
        break;

      case 'exit':
        addLine('output', 'Goodbye!');
        break;

      default:
        addLine('error', `${cmd}: command not found`);
    }

    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
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

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      {/* Terminal output */}
      <div ref={terminalRef} className="flex-1 overflow-auto p-4 space-y-1">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${
              line.type === 'error' ? 'text-red-400' : 
              line.type === 'input' ? 'text-white' : 'text-green-400'
            }`}
          >
            {line.content}
          </div>
        ))}
        
        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-white">user@webos:{currentPath}$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 ml-1"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}