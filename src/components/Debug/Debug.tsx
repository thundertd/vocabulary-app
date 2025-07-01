import { useState, useEffect } from 'react';

export function Debug() {
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Debug component mounted');
    
    // Test window.api availability
    if (typeof window !== 'undefined') {
      addLog('Window object available');
      
      if (window.api) {
        addLog('window.api is available');
        
        // Test API call
        window.api.readJsonData()
          .then(data => {
            addLog(`API call successful, got ${data.length} items`);
          })
          .catch(error => {
            addLog(`API call failed: ${error.message}`);
          });
      } else {
        addLog('window.api is NOT available');
      }
    } else {
      addLog('Window object NOT available');
    }
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Logs:</h2>
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono bg-white p-2 rounded">
              {log}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment:</h2>
        <p>User Agent: {navigator.userAgent}</p>
        <p>URL: {window.location.href}</p>
      </div>
    </div>
  );
}
