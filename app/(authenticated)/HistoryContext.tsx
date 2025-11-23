"use client";

import React, { createContext, useContext, useState } from 'react';

type HistoryContextType = {
  selectedHistoryItem: any | null;
  setSelectedHistoryItem: (item: any | null) => void;
  refreshHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children, onRefresh }: { children: React.ReactNode, onRefresh?: () => void }) {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);

  const refreshHistory = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <HistoryContext.Provider value={{ selectedHistoryItem, setSelectedHistoryItem, refreshHistory }}>
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
