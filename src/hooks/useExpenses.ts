import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import type { Expense, ExpenseFormData } from '../types';

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const expensesRef = collection(db!, 'users', user.uid, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseList: Expense[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];
      setExpenses(expenseList);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addExpense = useCallback(
    async (data: ExpenseFormData) => {
      if (!user || !db) return;
      const expensesRef = collection(db!, 'users', user.uid, 'expenses');
      await addDoc(expensesRef, {
        ...data,
        amount: Number(data.amount),
        date: Timestamp.fromDate(new Date(data.date)),
        createdAt: Timestamp.now(),
      });
    },
    [user]
  );

  const updateExpense = useCallback(
    async (id: string, data: ExpenseFormData) => {
      if (!user || !db) return;
      const expenseRef = doc(db!, 'users', user.uid, 'expenses', id);
      await updateDoc(expenseRef, {
        ...data,
        amount: Number(data.amount),
        date: Timestamp.fromDate(new Date(data.date)),
      });
    },
    [user]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (!user || !db) return;
      const expenseRef = doc(db!, 'users', user.uid, 'expenses', id);
      await deleteDoc(expenseRef);
    },
    [user]
  );

  const getFilteredExpenses = useCallback(
    (filters: {
      startDate?: string;
      endDate?: string;
      category?: string;
      type?: 'expense' | 'income';
      sortBy?: 'date' | 'amount';
      sortOrder?: 'asc' | 'desc';
    }) => {
      let filtered = [...expenses];

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        filtered = filtered.filter((e) => e.date.toDate() >= start);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59);
        filtered = filtered.filter((e) => e.date.toDate() <= end);
      }
      if (filters.category) {
        filtered = filtered.filter((e) => e.category === filters.category);
      }
      if (filters.type) {
        filtered = filtered.filter((e) => e.type === filters.type);
      }

      const sortBy = filters.sortBy || 'date';
      const sortOrder = filters.sortOrder || 'desc';
      filtered.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = a.date.toDate().getTime() - b.date.toDate().getTime();
        } else {
          comparison = a.amount - b.amount;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });

      return filtered;
    },
    [expenses]
  );

  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    totalIncome,
    totalExpenses,
    balance,
  };
}
