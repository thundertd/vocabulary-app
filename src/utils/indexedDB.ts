import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Vocabulary, PracticeResult } from '../types';

interface VocabularyDB extends DBSchema {
  vocabulary: {
    key: string;
    value: Vocabulary;
  };
  practiceResults: {
    key: string;
    value: PracticeResult;
  };
}

let db: IDBPDatabase<VocabularyDB> | null = null;

export async function initDB() {
  if (db) return db;

  db = await openDB<VocabularyDB>('vocabulary-app', 1, {
    upgrade(database) {
      // Create vocabulary store
      if (!database.objectStoreNames.contains('vocabulary')) {
        database.createObjectStore('vocabulary', { keyPath: 'id' });
      }

      // Create practice results store
      if (!database.objectStoreNames.contains('practiceResults')) {
        database.createObjectStore('practiceResults', { keyPath: 'resultId' });
      }
    },
  });

  return db;
}

export async function addVocabulary(vocabulary: Vocabulary[]) {
  const database = await initDB();
  const tx = database.transaction('vocabulary', 'readwrite');
  const store = tx.objectStore('vocabulary');

  for (const item of vocabulary) {
    await store.put(item);
  }

  await tx.done;
}

export async function getVocabulary(): Promise<Vocabulary[]> {
  const database = await initDB();
  const tx = database.transaction('vocabulary', 'readonly');
  const store = tx.objectStore('vocabulary');
  return store.getAll();
}

export async function addPracticeResult(result: PracticeResult) {
  const database = await initDB();
  const tx = database.transaction('practiceResults', 'readwrite');
  const store = tx.objectStore('practiceResults');
  await store.put(result);
  await tx.done;
}

export async function getPracticeResults(): Promise<PracticeResult[]> {
  const database = await initDB();
  const tx = database.transaction('practiceResults', 'readonly');
  const store = tx.objectStore('practiceResults');
  return store.getAll();
} 