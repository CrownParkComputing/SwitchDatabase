import React, { createContext, useState, useContext, useEffect } from 'react';

const FilterContext = createContext();

export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFilters = localStorage.getItem('gameFilters');
      return savedFilters ? JSON.parse(savedFilters) : {
        searchTerm: '',
        yearFilter: new Date().getFullYear().toString(),
        monthFilter: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      };
    }
    return {
      searchTerm: '',
      yearFilter: new Date().getFullYear().toString(),
      monthFilter: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    };
  });

  useEffect(() => {
    localStorage.setItem('gameFilters', JSON.stringify(filters));
  }, [filters]);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};