import React from 'react';
import type { Vocabulary } from '../../types';

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  showEnglish?: boolean;
  showVietnamese?: boolean;
  showPronunciation?: boolean;
}

export function VocabularyCard({
  vocabulary,
  showEnglish = true,
  showVietnamese = true,
  showPronunciation = true
}: VocabularyCardProps) {
  const speakWord = () => {
    if (vocabulary.audio) {
      const audio = new Audio(vocabulary.audio);
      audio.play();
    } else {
      const utterance = new SpeechSynthesisUtterance(vocabulary.english);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {vocabulary.image && (
        <img
          src={vocabulary.image}
          alt={vocabulary.english}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="space-y-2">
        {showEnglish && (
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800">{vocabulary.english}</h3>
            <button
              onClick={speakWord}
              className="p-2 text-blue-600 hover:text-blue-800"
            >
              <i className="fas fa-volume-up"></i>
            </button>
          </div>
        )}
        
        {showPronunciation && (
          <p className="text-gray-600 italic">{vocabulary.pronunciation}</p>
        )}
        
        {showVietnamese && (
          <p className="text-lg text-gray-700">{vocabulary.vietnamese}</p>
        )}
      </div>
    </div>
  );
} 