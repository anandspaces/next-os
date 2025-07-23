'use client';

import { useState } from 'react';
import { 
  Monitor, 
  Palette, 
  Volume2, 
  Wifi, 
  Shield, 
  User, 
  Bell, 
  HardDrive,
  Info
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('display');
  const [settings, setSettings] = useState({
    theme: 'light',
    wallpaper: 'gradient',
    volume: 75,
    notifications: true,
    autoSave: true,
    username: 'User'
  });

  const tabs = [
    { id: 'display', name: 'Display', icon: Monitor },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'sound', name: 'Sound', icon: Volume2 },
    { id: 'network', name: 'Network', icon: Wifi },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'account', name: 'Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'storage', name: 'Storage', icon: HardDrive },
    { id: 'about', name: 'About', icon: Info }
  ];
  type SettingValue = string | number | boolean;
  const updateSetting = (key: string, value: SettingValue) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'display':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option>1920 x 1080 (Recommended)</option>
                  <option>1366 x 768</option>
                  <option>1280 x 720</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scaling
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option>100% (Default)</option>
                  <option>125%</option>
                  <option>150%</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-3 border rounded-lg text-left ${
                      settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-8 bg-white border rounded mb-2"></div>
                    Light
                  </button>
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-3 border rounded-lg text-left ${
                      settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-8 bg-gray-800 border rounded mb-2"></div>
                    Dark
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallpaper
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['gradient', 'solid', 'pattern'].map((wallpaper) => (
                    <button
                      key={wallpaper}
                      onClick={() => updateSetting('wallpaper', wallpaper)}
                      className={`p-2 border rounded-lg text-center capitalize ${
                        settings.wallpaper === wallpaper ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {wallpaper}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sound':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Sound Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Volume: {settings.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">System Sounds</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => updateSetting('username', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Change Password
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">About WebOS</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Version</div>
                    <div className="text-gray-600">1.0.0</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Build</div>
                    <div className="text-gray-600">2024.01.01</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Platform</div>
                    <div className="text-gray-600">Web Browser</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Runtime</div>
                    <div className="text-gray-600">Next.js</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• File Management System</li>
                  <li>• Multi-window Interface</li>
                  <li>• Built-in Applications</li>
                  <li>• Terminal Emulator</li>
                  <li>• Web Browser</li>
                  <li>• Text Editor</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{tabs.find(t => t.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Settings for this section are coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}