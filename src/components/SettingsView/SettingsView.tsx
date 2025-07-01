import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export function SettingsView() {
  const { settings, updateSettings } = useSettings();
  const [hintInterval, setHintInterval] = useState(settings.hintInterval);
  const [dailyWordCount, setDailyWordCount] = useState(settings.dailyWordCount);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        hintInterval,
        dailyWordCount
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="hintInterval"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hint Interval (seconds)
            </label>
            <input
              type="number"
              id="hintInterval"
              min="5"
              max="60"
              value={hintInterval}
              onChange={(e) => setHintInterval(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="dailyWordCount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Daily Word Count
            </label>
            <input
              type="number"
              id="dailyWordCount"
              min="10"
              max="200"
              value={dailyWordCount}
              onChange={(e) => setDailyWordCount(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
} 