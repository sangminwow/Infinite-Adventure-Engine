import React, { useState, useEffect, useCallback } from 'react';
import type { HistoryEntry } from './types';
import { getNextStep, generateImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import StoryDisplay from './components/StoryDisplay';
import ChoiceButtons from './components/ChoiceButtons';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [currentQuest, setCurrentQuest] = useState<string>('');
  const [choices, setChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const processTurn = useCallback(async (choice: string) => {
    setIsLoading(true);
    setIsImageLoading(true);
    setError(null);

    const storyHistoryText = history.map(h => h.story).join('\n\n');

    try {
      const gameState = await getNextStep(storyHistoryText, inventory, currentQuest, choice);
      
      setInventory(gameState.inventory);
      setCurrentQuest(gameState.currentQuest);
      setChoices(gameState.choices);

      // Generate the new image in parallel
      const imageUrlPromise = generateImage(gameState.imagePrompt);

      // Update story part of the history first
      const newHistoryEntry = {
        story: gameState.story,
        imageUrl: '', // temp value
      };
      setHistory(prev => [...prev, newHistoryEntry]);

      const newImageUrl = await imageUrlPromise;
      
      // Now update the last history entry with the correct image URL
      setHistory(prev => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].imageUrl = newImageUrl;
        return updatedHistory;
      });

    } catch (e: any) {
      setError(e.message || '알 수 없는 오류가 발생했습니다.');
      // Keep old choices available on error to let user retry
    } finally {
      setIsLoading(false);
      setIsImageLoading(false);
    }
  }, [history, inventory, currentQuest]);
  
  useEffect(() => {
    // Initial game start
    processTurn("모험이 시작됩니다...");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChoice = (choice: string) => {
    processTurn(choice);
  };
  
  const currentTurn = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            무한 어드벤처 엔진
          </h1>
          <p className="text-gray-400 mt-2">당신의 이야기가 쓰여지기를 기다리고 있습니다.</p>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6 text-center">
            <strong>오류:</strong> {error}
          </div>
        )}

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow flex flex-col gap-6">
            <StoryDisplay 
                story={currentTurn?.story ?? ''} 
                imageUrl={currentTurn?.imageUrl ?? null} 
                isImageLoading={isImageLoading}
            />
            {isLoading && history.length > 0 ? (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg flex items-center justify-center gap-3">
                <LoadingSpinner />
                <span className="text-gray-400">이야기꾼이 생각 중입니다...</span>
              </div>
            ) : (
              <ChoiceButtons choices={choices} onChoice={handleChoice} isLoading={isLoading} />
            )}
          </div>
          <Sidebar inventory={inventory} quest={currentQuest} />
        </main>
      </div>
    </div>
  );
};

export default App;