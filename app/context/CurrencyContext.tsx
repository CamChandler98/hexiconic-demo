import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

const GEM_KEY = "global-gems";

type CurrencyContextType = {
  gems: number;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  setGems: (amount: number) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [gems, setGems] = useState(0);

  // Load gems once on boot
  useEffect(() => {
    AsyncStorage.getItem(GEM_KEY).then(raw => {
      if (raw) setGems(Number(raw));
    });
  }, []);

  // Persist on change
  useEffect(() => {
    AsyncStorage.setItem(GEM_KEY, gems.toString());
  }, [gems]);

  const addGems = (amount: number) => {
    setGems(prev => prev + amount);
  };

  const spendGems = (amount: number) => {
    console.log(amount)
    if (gems < amount) return false;
    setGems(prev => prev - amount);
    return true;
  };

  return (
    <CurrencyContext.Provider value={{ gems, addGems, spendGems, setGems }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};