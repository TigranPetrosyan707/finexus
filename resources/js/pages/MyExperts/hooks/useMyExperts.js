import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';
import { formatExpertData } from '../../SearchExperts/utils';

export const useMyExperts = () => {
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadExperts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/experts/my-experts');
      const formatted = (data || []).map(formatExpertData);
      setExperts(formatted);
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

