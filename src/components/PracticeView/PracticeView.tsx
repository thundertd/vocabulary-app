import { useState, useEffect } from 'react';
import { VocabularyCard } from '../Common/VocabularyCard';
import { PracticeInput } from './PracticeInput';
import { useSettings } from '../../contexts/SettingsContext';
import type { Vocabulary, PracticeResult } from '../../types';
import { getVocabulary, addPracticeResult } from '../../utils/indexedDB';

export function PracticeView() {
  const { settings } = useSettings();
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceType, setPracticeType] = useState<'en-to-vi' | 'vi-to-en'>('en-to-vi');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    // Load vocabulary from IndexedDB
    getVocabulary().then(setVocabulary);
  }, []);

  useEffect(() => {
    if (vocabulary.length > 0) {
      // Randomly choose practice type
      setPracticeType(Math.random() < 0.5 ? 'en-to-vi' : 'vi-to-en');
      setStartTime(Date.now());
      setHintsRevealed(0);
    }
  }, [currentIndex, vocabulary]);

  const handleAnswer = async (answer: string) => {
    const currentWord = vocabulary[currentIndex];
    const isCorrect = practiceType === 'en-to-vi'
      ? answer.toLowerCase() === currentWord.english.toLowerCase()
      : answer.toLowerCase() === currentWord.vietnamese.toLowerCase();

    const result: PracticeResult = {
      resultId: `${currentWord.id}-${Date.now()}`,
      vocabularyId: currentWord.id,
      practiceType,
      userAnswer: answer,
      correctAnswer: practiceType === 'en-to-vi' ? currentWord.english : currentWord.vietnamese,
      isCorrect,
      timeTakenMs: Date.now() - startTime,
      timestamp: Date.now(),
      hintsRevealed
    };

    await addPracticeResult(result);
    
    // Save to Electron if available
    try {
      if (window.api && window.api.savePracticeResult) {
        await window.api.savePracticeResult(result);
      }
    } catch (error) {
      console.error('Error saving practice result:', error);
    }

    // Move to next word or end practice
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of practice session
      // TODO: Show results summary
    }
  };

  const handleHintRevealed = () => {
    setHintsRevealed(prev => prev + 1);
  };

  if (vocabulary.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading vocabulary...</p>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <VocabularyCard
          vocabulary={currentWord}
          showEnglish={practiceType === 'vi-to-en'}
          showVietnamese={practiceType === 'en-to-vi'}
          showPronunciation={true}
        />

        <PracticeInput
          correctAnswer={practiceType === 'en-to-vi' ? currentWord.english : currentWord.vietnamese}
          onAnswer={handleAnswer}
          hintInterval={settings.hintInterval}
          onHintRevealed={handleHintRevealed}
        />

        <div className="text-center text-gray-600">
          Word {currentIndex + 1} of {vocabulary.length}
        </div>
      </div>
    </div>
  );
} 