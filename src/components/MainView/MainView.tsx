import React, { useState, useEffect } from 'react';
import { VocabularyCard } from '../Common/VocabularyCard';
import type { Vocabulary } from '../../types';
import { getVocabulary } from '../../utils/indexedDB';

export function MainView() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getVocabulary().then(data => {
      setVocabulary(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading vocabulary...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vocabulary.map(word => (
          <VocabularyCard
            key={word.id}
            vocabulary={word}
            showEnglish={true}
            showVietnamese={true}
            showPronunciation={true}
          />
        ))}
      </div>
    </div>
  );
} 