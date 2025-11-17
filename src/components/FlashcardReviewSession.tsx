import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FlashcardDeck, FlashcardWithSRS, SRSAlgorithm, studyDB } from '@/src/lib/studyDB';

interface FlashcardReviewSessionProps {
  deck: FlashcardDeck;
  onComplete: () => void;
}

const FlashcardReviewSession: React.FC<FlashcardReviewSessionProps> = ({ deck, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<FlashcardWithSRS[]>([]);
  const [sessionStartTime] = useState(Date.now());

  const dueCards = SRSAlgorithm.getDueCards(deck);
  const currentCard = dueCards[currentIndex];
  const progress = ((currentIndex + 1) / dueCards.length) * 100;

  const handleRating = async (quality: number) => {
    if (!currentCard) return;

    // Update card with SRS algorithm
    const updatedCard = SRSAlgorithm.calculateNextReview(currentCard, quality);
    const updatedCards = deck.cards.map(c =>
      c.front === currentCard.front && c.back === currentCard.back ? updatedCard : c
    );

    // Update deck
    const updatedDeck: FlashcardDeck = {
      ...deck,
      cards: updatedCards,
      lastReviewedAt: new Date()
    };

    await studyDB.updateFlashcardDeck(updatedDeck);
    setReviewedCards([...reviewedCards, updatedCard]);

    // Move to next card or complete
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Record study session
      const duration = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
      await studyDB.addStudySession({
        subject: deck.subject,
        duration,
        timestamp: new Date()
      });
      
      onComplete();
    }
  };

  if (dueCards.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Cards Due! 🎉</h2>
          <p className="text-muted-foreground mb-6">All cards have been reviewed. Come back later!</p>
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">{deck.name}</h2>
          <p className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {dueCards.length}
          </p>
        </div>
        <button
          onClick={onComplete}
          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          aria-label="Exit review"
        >
          <X size={24} className="text-foreground" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full max-w-2xl aspect-video cursor-pointer perspective-1000"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-card border-2 border-primary rounded-xl flex items-center justify-center p-8">
              <p className="text-2xl md:text-3xl font-medium text-center text-foreground">
                {currentCard.front}
              </p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-card border-2 border-secondary rounded-xl flex items-center justify-center p-8">
              <p className="text-2xl md:text-3xl font-medium text-center text-foreground">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        {!isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Show Answer
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground mb-3">How well did you know this?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleRating(0)}
                className="py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-80 transition-opacity"
              >
                Again
              </button>
              <button
                onClick={() => handleRating(2)}
                className="py-3 bg-orange-600 text-white rounded-lg font-medium hover:opacity-80 transition-opacity"
              >
                Hard
              </button>
              <button
                onClick={() => handleRating(4)}
                className="py-3 bg-blue-600 text-white rounded-lg font-medium hover:opacity-80 transition-opacity"
              >
                Good
              </button>
              <button
                onClick={() => handleRating(5)}
                className="py-3 bg-green-600 text-white rounded-lg font-medium hover:opacity-80 transition-opacity"
              >
                Easy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardReviewSession;
