import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import { useExpenses } from '../../hooks/useExpenses';
import { useCurrency } from '../../context/CurrencyContext';
import ExpenseCard from '../Expenses/ExpenseCard';
import { TrendingUp, TrendingDown, LogOut, Receipt } from 'lucide-react';
import type { Expense } from '../../types';

interface DashboardProps {
  onEdit: (expense: Expense) => void;
}

export default function Dashboard({ onEdit }: DashboardProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { expenses, balance, totalIncome, totalExpenses, deleteExpense, loading } = useExpenses();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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
      <div className="dashboard-bg"></div>
      <div className="dashboard-header" ref={dropdownRef} style={{ position: 'relative' }}>
        <div className="greeting">
          <h2 className="text-white-80">{getGreeting()}</h2>
          <h1 className="text-white">{displayName}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="icon-btn-white" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <button
            className="avatar-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Profile menu"
            id="profile-btn"
          >
            {initial}
          </button>
        </div>

        {showDropdown && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-item" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 14, marginBottom: 4 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
            </div>
            <div className="profile-dropdown-item" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '8px' }}>Currency:</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as any)}
                style={{ 
                  background: 'var(--bg-app)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '6px', 
                  padding: '4px' 
                }}
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="JPY">¥ JPY</option>
              </select>
            </div>
            <button className="profile-dropdown-item danger" onClick={handleLogout} id="logout-btn">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Balance Card area */}
      <section className="balance-section" aria-label="Balance summary">
        <div className="balance-label text-white-80">Total Balance</div>
        <div className="balance-amount text-white">{formatCurrency(balance, currency)}</div>
        
        <div className="balance-row">
          <div className="balance-card-white">
            <div className="balance-icon-circle income" aria-hidden="true">
              <TrendingUp size={20} color="var(--success-500)" />
            </div>
            <div>
              <div className="balance-item-label">Income</div>
              <div className="balance-item-amount">{formatCurrency(totalIncome, currency)}</div>
            </div>
          </div>
          <div className="balance-card-white">
            <div className="balance-icon-circle expense" aria-hidden="true">
              <TrendingDown size={20} color="var(--danger-500)" />
            </div>
            <div>
              <div className="balance-item-label">Expenses</div>
              <div className="balance-item-amount">{formatCurrency(totalExpenses, currency)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section aria-label="Recent transactions">
        <div className="section-header">
          <h3>Transactions History</h3>
          {expenses.length > 8 && (
            <a href="/history" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              See all
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
