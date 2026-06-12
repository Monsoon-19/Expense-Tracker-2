import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseCard from '../Expenses/ExpenseCard';
import { TrendingUp, TrendingDown, LogOut, Receipt } from 'lucide-react';
import type { Expense } from '../../types';

interface DashboardProps {
  onEdit: (expense: Expense) => void;
}

export default function Dashboard({ onEdit }: DashboardProps) {
  const { user, logout } = useAuth();
  const { expenses, balance, totalIncome, totalExpenses, deleteExpense, loading } = useExpenses();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const recentExpenses = expenses.slice(0, 8);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      await deleteExpense(id);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '50vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard page-enter">
      <div className="dashboard-header" ref={dropdownRef} style={{ position: 'relative' }}>
        <div className="greeting">
          <h2>{getGreeting()} 👋</h2>
          <h1>{displayName}</h1>
        </div>
        <button
          className="avatar-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Profile menu"
          id="profile-btn"
        >
          {initial}
        </button>

        {showDropdown && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-item" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: 14, marginBottom: 4 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
            </div>
            <button className="profile-dropdown-item danger" onClick={logout} id="logout-btn">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Balance Card */}
      <section className="balance-card" aria-label="Balance summary">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount">{formatCurrency(balance)}</div>
        <div className="balance-row">
          <div className="balance-item">
            <div className="balance-icon income" aria-hidden="true">
              <TrendingUp />
            </div>
            <div>
              <div className="balance-item-label">Income</div>
              <div className="balance-item-amount">{formatCurrency(totalIncome)}</div>
            </div>
          </div>
          <div className="balance-item">
            <div className="balance-icon expense" aria-hidden="true">
              <TrendingDown />
            </div>
            <div>
              <div className="balance-item-label">Expenses</div>
              <div className="balance-item-amount">{formatCurrency(totalExpenses)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section aria-label="Recent transactions">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          {expenses.length > 8 && (
            <a href="/history" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              View all
            </a>
          )}
        </div>

        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Receipt size={36} />
            </div>
            <h3>No transactions yet</h3>
            <p>Tap the + button to add your first transaction</p>
          </div>
        ) : (
          <div className="expense-list" role="list">
            {recentExpenses.map((expense, i) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                index={i}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
