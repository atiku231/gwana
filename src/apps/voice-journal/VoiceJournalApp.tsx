import React, { useState, useEffect } from 'react';
import type { AppProps } from '@/src/system/types';
import VoiceJournal from '@/src/components/VoiceJournal';
import { AudioLines, History, Calendar } from 'lucide-react';

type JournalView = 'record' | 'history';

interface JournalEntry {
  id: string;
  text: string;
  timestamp: string;
  mood?: string;
}

/**
 * Voice Journal Application - Audio diary with AI analysis
 * Record thoughts and get AI-powered insights
 */
const VoiceJournalApp: React.FC<AppProps> = ({ 
  appId, 
  systemServices, 
  initialIntent, 
  onNavigate, 
  isActive 
}) => {
  const [currentView, setCurrentView] = useState<JournalView>('record');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (!initialIntent || !isActive) return;

    if (initialIntent.action === 'CREATE' && initialIntent.type?.startsWith('journal/')) {
      setCurrentView('record');
    }
  }, [initialIntent, isActive]);

  useEffect(() => {
    if (isActive) {
      const stored = localStorage.getItem('journal_entries');
      if (stored) {
        try {
          setJournalEntries(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to load journal entries:', error);
        }
      }
    }
  }, [isActive]);

  const handleJournalSave = (text: string, mood?: string) => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      mood,
    };

    const updatedEntries = [entry, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    systemServices.setToastMessage('Journal entry saved!');
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      const updatedEntries = journalEntries.filter(e => e.id !== id);
      setJournalEntries(updatedEntries);
      localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="flex gap-2 p-2 border-b border-border/20 bg-background/50 backdrop-blur-sm">
        <button
          onClick={() => setCurrentView('record')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentView === 'record' ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'
          }`}
        >
          <AudioLines size={18} />
          <span className="text-sm font-medium">Record</span>
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
        {currentView === 'record' ? (
          <VoiceJournal onSave={handleJournalSave} />
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar p-4">
            <h2 className="text-xl font-bold text-primary mb-4">Journal Entries</h2>
            {journalEntries.length === 0 ? (
              <p className="text-muted-foreground">No entries yet!</p>
            ) : (
              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                    {entry.mood && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded mb-2 inline-block">
                        Mood: {entry.mood}
                      </span>
                    )}
                    <p className="text-sm text-foreground whitespace-pre-wrap">{entry.text}</p>
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

export default VoiceJournalApp;
