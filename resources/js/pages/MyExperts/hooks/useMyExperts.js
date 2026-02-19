import { useState, useEffect, useCallback } from 'react';
import { myExpertsDB } from '../db';
import { db } from '../../../utils/database';

export const useMyExperts = () => {
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadExperts = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await db.get('currentUser');
      
      if (!currentUser || currentUser.role !== 'company') {
        setExperts([]);
        return;
      }

      const expertsData = await myExpertsDB.getExpertsForCompany(currentUser.id);
      setExperts(expertsData);
    } catch (error) {
      console.error('Error loading experts:', error);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  const filteredExperts = experts.filter(expert => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      expert.name.toLowerCase().includes(query) ||
      expert.profession.toLowerCase().includes(query) ||
      expert.specialties.some(specialty => specialty.toLowerCase().includes(query))
    );
  });

  return {
    loading,
    experts: filteredExperts,
    allExperts: experts,
    searchQuery,
    setSearchQuery,
    loadExperts,
  };
};

