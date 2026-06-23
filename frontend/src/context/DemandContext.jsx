import React, { createContext, useContext, useState, useEffect } from 'react';

const DemandContext = createContext();

export const useDemand = () => {
  return useContext(DemandContext);
};

export const DemandProvider = ({ children }) => {
  const [demands, setDemands] = useState(() => {
    try {
      const stored = localStorage.getItem('stoneo_demands');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse demands from local storage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('stoneo_demands', JSON.stringify(demands));
  }, [demands]);

  const addDemand = (product) => {
    setDemands((prev) => {
      // Check if product already exists
      const exists = prev.find(p => p.name === product.name);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeDemand = (productName) => {
    setDemands((prev) => prev.filter(p => p.name !== productName));
  };

  const clearDemands = () => {
    setDemands([]);
  };

  return (
    <DemandContext.Provider value={{ demands, addDemand, removeDemand, clearDemands }}>
      {children}
    </DemandContext.Provider>
  );
};
