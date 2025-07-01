import { useState, useEffect } from 'react';
import { MainView } from './components/MainView/MainView';
import { PracticeView } from './components/PracticeView/PracticeView';
import { SettingsView } from './components/SettingsView/SettingsView';
import { Debug } from './components/Debug/Debug';
import { SettingsProvider } from './contexts/SettingsContext';
import { addVocabulary } from './utils/indexedDB';
import type { Vocabulary } from './types';

type View = 'main' | 'practice' | 'settings' | 'debug';

function App() {
  const [currentView, setCurrentView] = useState<View>('debug'); // Start with debug
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize vocabulary data
    const initializeData = async () => {
      try {
        // Check if window.api is available (Electron context)
        if (window.api && window.api.readJsonData) {
          const data = await window.api.readJsonData();
          await addVocabulary(data as Vocabulary[]);
        } else {
          // Fallback for web development or if API is not ready
          console.warn('Electron API not available, using fallback data');
          const fallbackData: Vocabulary[] = [
            {
              id: "hello",
              english: "hello",
              vietnamese: "xin chào",
              pronunciation: "/həˈloʊ/"
            }
          ];
          await addVocabulary(fallbackData);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsInitialized(true); // Still set to true to show UI
      }
    };

    initializeData();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Initializing application...</p>
      </div>
    );
  }

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Vocabulary App</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('main')}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === 'main'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Vocabulary
                </button>
                <button
                  onClick={() => setCurrentView('practice')}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === 'practice'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Practice
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === 'settings'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setCurrentView('debug')}
                  className={`px-4 py-2 rounded-lg ${
                    currentView === 'debug'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Debug
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-8">
          {currentView === 'main' && <MainView />}
          {currentView === 'practice' && <PracticeView />}
          {currentView === 'settings' && <SettingsView />}
          {currentView === 'debug' && <Debug />}
        </main>
      </div>
    </SettingsProvider>
  );
}

export default App;
