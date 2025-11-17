import React, { useState, useEffect } from 'react';
import type { AppProps } from '@/src/system/types';
import CodeHelper from '@/src/components/CodeHelper';
import { Code2, History } from 'lucide-react';

type CodeView = 'helper' | 'history';

/**
 * Code Helper Application - AI coding assistant
 * Debug, explain, and optimize code with AI
 */
const CodeHelperApp: React.FC<AppProps> = ({ 
  appId, 
  systemServices, 
  initialIntent, 
  onNavigate, 
  isActive 
}) => {
  const [currentView, setCurrentView] = useState<CodeView>('helper');
  const [codeHistory, setCodeHistory] = useState<any[]>([]);
  const [initialCode, setInitialCode] = useState('');

  useEffect(() => {
    if (!initialIntent || !isActive) return;

    if (initialIntent.action === 'EDIT' && initialIntent.data?.code) {
      setInitialCode(initialIntent.data.code);
      setCurrentView('helper');
    }
  }, [initialIntent, isActive]);

  const handleCodeAnalysis = (code: string, analysis: string) => {
    const entry = {
      code,
      analysis,
      timestamp: new Date().toISOString(),
    };
    
    setCodeHistory(prev => [entry, ...prev.slice(0, 29)]);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex gap-2 p-2 border-b border-border/20 bg-background/50 backdrop-blur-sm">
        <button
          onClick={() => setCurrentView('helper')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentView === 'helper' ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'
          }`}
        >
          <Code2 size={18} />
          <span className="text-sm font-medium">Code Helper</span>
        </button>
        <button
          onClick={() => setCurrentView('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentView === 'history' ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'
          }`}
        >
          <History size={18} />
          <span className="text-sm font-medium">History</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {currentView === 'helper' ? (
          <CodeHelper 
            initialCode={initialCode}
            onAnalysis={handleCodeAnalysis}
          />
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar p-4">
            <h2 className="text-xl font-bold text-primary mb-4">Analysis History</h2>
            {codeHistory.length === 0 ? (
              <p className="text-muted-foreground">No analyses yet!</p>
            ) : (
              <div className="space-y-3">
                {codeHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setInitialCode(entry.code);
                      setCurrentView('helper');
                    }}
                  >
                    <span className="text-xs text-muted-foreground block mb-2">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <pre className="text-xs font-mono text-foreground bg-background/50 p-2 rounded mb-2 overflow-x-auto custom-scrollbar">
                      {entry.code.substring(0, 150)}{entry.code.length > 150 ? '...' : ''}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeHelperApp;
