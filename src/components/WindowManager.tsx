'use client';

import { useOS } from '@/contexts/OSContext';
import Window from './Window';
import FileManager from './apps/FileManager';
import TextEditor from './apps/TextEditor';
import Calculator from './apps/Calculator';
import Terminal from './apps/Terminal';
import WebBrowser from './apps/WebBrowser';
import Settings from './apps/Settings';

const componentMap = {
  FileManager,
  TextEditor,
  Calculator,
  Terminal,
  WebBrowser,
  Settings
};

export default function WindowManager() {
  const { windows } = useOS();

  return (
    <>
      {windows.map((window) => {
        const Component = componentMap[window.component as keyof typeof componentMap];
        
        if (!Component) return null;

        return (
          <Window key={window.id} window={window}>
            <Component data={window.data} />
          </Window>
        );
      })}
    </>
  );
}