export interface GameState {
  story: string;
  imagePrompt: string;
  inventory: string[];
  currentQuest: string;
  choices: string[];
}

export interface HistoryEntry {
  story: string;
  imageUrl: string;
}
