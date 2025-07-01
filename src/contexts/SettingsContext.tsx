import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Settings } from '../types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
  hintInterval: 20,
  dailyWordCount: 50
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from Electron or use defaults
    const loadSettings = async () => {
      try {
        if (window.api && window.api.getSettings) {
          const loadedSettings = await window.api.getSettings();
          setSettings(loadedSettings);
        } else {
          console.warn('Electron API not available, using default settings');
          // Use default settings when not in Electron context
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Keep default settings on error
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    try {
      if (window.api && window.api.saveSettings) {
        await window.api.saveSettings(updatedSettings);
      } else {
        console.warn('Electron API not available, settings not persisted');
        // In web context, just update local state
      }
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      // Still update local state even if save fails
      setSettings(updatedSettings);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 