import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Play, Brain } from 'lucide-react';
import { studyDB, FlashcardDeck, FlashcardWithSRS } from '@/src/lib/studyDB';
import { supabase } from '@/src/integrations/supabase/client';

interface FlashcardManagerProps {
  onBack: () => void;
  onStartReview: (deck: FlashcardDeck) => void;
}

const FlashcardManager: React.FC<FlashcardManagerProps> = ({ onBack, onStartReview }) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('');
  const [newDeckTopic, setNewDeckTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    const allDecks = await studyDB.getFlashcardDecks();
    setDecks(allDecks);
  };

  const handleGenerateDeck = async () => {
    if (!newDeckName.trim() || !newDeckSubject.trim() || !newDeckTopic.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { subject: newDeckSubject, topic: newDeckTopic }
      });

      if (error) throw error;

      const cards: FlashcardWithSRS[] = data.flashcards.map((card: any) => ({
        front: card.front,
        back: card.back,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: new Date()
      }));

      const newDeck: FlashcardDeck = {
        name: newDeckName,
        subject: newDeckSubject,
        cards,
        createdAt: new Date()
      };

      await studyDB.addFlashcardDeck(newDeck);
      await loadDecks();
      setShowCreateModal(false);
      setNewDeckName('');
      setNewDeckSubject('');
      setNewDeckTopic('');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteDeck = async (id: number) => {
    if (confirm('Are you sure you want to delete this deck?')) {
      await studyDB.deleteFlashcardDeck(id);
      await loadDecks();
    }
  };

  return (
    <div className="h-full w-full bg-background overflow-y-auto custom-scrollbar">
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} className="text-primary" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Flashcard Decks</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Create Deck</span>
          </button>
        </div>

        {/* Decks Grid */}
        {decks.length === 0 ? (
          <div className="text-center py-12">
            <Brain size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No flashcard decks yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Your First Deck
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{deck.name}</h3>
                    <p className="text-sm text-muted-foreground">{deck.subject}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDeck(deck.id!)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    aria-label="Delete deck"
                  >
                    <Trash2 size={18} className="text-destructive" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {deck.cards.length} cards
                  </span>
                  <button
                    onClick={() => onStartReview(deck)}
                    className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Play size={16} />
                    Review
                  </button>
                </div>

                {deck.lastReviewedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last reviewed: {new Date(deck.lastReviewedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-foreground mb-4">Create Flashcard Deck</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Deck Name
                </label>
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="e.g., Spanish Vocabulary"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newDeckSubject}
                  onChange={(e) => setNewDeckSubject(e.target.value)}
                  placeholder="e.g., Spanish"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={newDeckTopic}
                  onChange={(e) => setNewDeckTopic(e.target.value)}
                  placeholder="e.g., Common greetings and phrases"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDeckName('');
                  setNewDeckSubject('');
                  setNewDeckTopic('');
                }}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating || !newDeckName.trim() || !newDeckSubject.trim() || !newDeckTopic.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManager;
