'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { IAppContextType } from '../interface/main.interface';

const AppContext = createContext<IAppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBgDark, setIsBgDark] = useState<boolean>(false);
  const [isOverflowYHidden, setIsOverflowYHidden] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.querySelector('body');
      if (body) {
        if (isOverflowYHidden) {
          body.style.overflowY = 'hidden';
        } else {
          body.style.overflowY = 'auto';
        }
      }
    }
  }, [isOverflowYHidden]);

  return (
    <AppContext.Provider
      value={{ isBgDark, setIsBgDark, setIsOverflowYHidden }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within a AppProvider');
  }
  return context;
};
