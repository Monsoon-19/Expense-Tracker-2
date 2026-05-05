import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useExpenses } from './hooks/useExpenses';
import AuthPage from './components/Auth/AuthPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import NavBar from './components/Layout/NavBar';
import Dashboard from './components/Dashboard/Dashboard';
import HistoryPanel from './components/History/HistoryPanel';
import OverviewPage from './components/Overview/OverviewPage';
import ExpenseForm from './components/Expenses/ExpenseForm';
import type { Expense, ExpenseFormData } from './types';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  const { addExpense, updateExpense } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddClick = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await addExpense(data);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <main className="app-main">
                <Dashboard onEdit={handleEdit} />
              </main>
              <NavBar onAddClick={handleAddClick} />
              {showForm && (
                <ExpenseForm
                  onSubmit={handleSubmit}
                  onClose={handleCloseForm}
                  editingExpense={editingExpense}
                />
              )}
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <main className="app-main">
                <HistoryPanel onEdit={handleEdit} />
              </main>
              <NavBar onAddClick={handleAddClick} />
              {showForm && (
                <ExpenseForm
                  onSubmit={handleSubmit}
                  onClose={handleCloseForm}
                  editingExpense={editingExpense}
                />
              )}
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <main className="app-main">
                <OverviewPage />
              </main>
              <NavBar onAddClick={handleAddClick} />
              {showForm && (
                <ExpenseForm
                  onSubmit={handleSubmit}
                  onClose={handleCloseForm}
                  editingExpense={editingExpense}
                />
              )}
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
