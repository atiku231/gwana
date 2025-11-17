import React, { useState, useEffect } from 'react';
import type { AppProps } from '@/src/system/types';
import AIWritingAssistant from '@/src/components/AIWritingAssistant';
import { FileText, History } from 'lucide-react';

type WriterView = 'editor' | 'history';

/**
 * AI Writing Application - AI-powered writing assistant
 * Generate and edit documents with AI assistance
 */
const AIWriterApp: React.FC<AppProps> = ({ 
  appId, 
  systemServices, 
  initialIntent, 
  onNavigate, 
  isActive 
}) => {
  const [currentView, setCurrentView] = useState<WriterView>('editor');
  const [writingHistory, setWritingHistory] = useState<any[]>([]);
  const [initialText, setInitialText] = useState('');

  useEffect(() => {
    if (!initialIntent || !isActive) return;

    switch (initialIntent.action) {
      case 'CREATE':
        setCurrentView('editor');
        setInitialText('');
        break;
      
      case 'EDIT':
        if (initialIntent.data?.text) {
          setInitialText(initialIntent.data.text);
          setCurrentView('editor');
        }
        break;
    }
  }, [initialIntent, isActive]);

  const handleDocumentSave = (content: string, title: string) => {
    const document = {
      title,
      content,
      timestamp: new Date().toISOString(),
    };
    
    setWritingHistory(prev => [document, ...prev.slice(0, 49)]);
    systemServices.setToastMessage('Document saved!');
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex gap-2 p-2 border-b border-border/20 bg-background/50 backdrop-blur-sm">
        <button
          onClick={() => setCurrentView('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentView === 'editor' ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'
          }`}
        >
          <FileText size={18} />
          <span className="text-sm font-medium">Editor</span>
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
        {currentView === 'editor' ? (
          <AIWritingAssistant 
            initialText={initialText}
            onSave={handleDocumentSave}
          />
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar p-4">
            <h2 className="text-xl font-bold text-primary mb-4">Writing History</h2>
            {writingHistory.length === 0 ? (
              <p className="text-muted-foreground">No documents yet. Start writing!</p>
            ) : (
              <div className="space-y-3">
                {writingHistory.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setInitialText(doc.content);
                      setCurrentView('editor');
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{doc.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{doc.content}</p>
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

export default AIWriterApp;
