"use client";

import React, { createContext, useContext, useState } from 'react';

type HistoryContextType = {
  selectedHistoryItem: any | null;
  setSelectedHistoryItem: (item: any | null) => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);

  return (
    <HistoryContext.Provider value={{ selectedHistoryItem, setSelectedHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
