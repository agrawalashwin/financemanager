import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../config/constants';

const API_URL = API_CONFIG.BASE_URL;

const TransactionFormWrapper = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(`${API_URL}${API_CONFIG.ENDPOINTS.BUDGETS}?userId=${user.id}`);
        setBudgets(response.data || []);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        setBudgets([]);
      }
    };

    fetchBudgets();
  }, [user?.id]);

  return <TransactionForm budgets={budgets} />;
};

export default TransactionFormWrapper;

