import { useState } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseCard from '../Expenses/ExpenseCard';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../types';
import { Search, SlidersHorizontal, Receipt } from 'lucide-react';
import type { Expense } from '../../types';

interface HistoryProps {
  onEdit: (expense: Expense) => void;
}

export default function HistoryPanel({ onEdit }: HistoryProps) {
  const { getFilteredExpenses, deleteExpense, loading } = useExpenses();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'' | 'expense' | 'income'>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const uniqueCategories = [...new Set(allCategories)];

  const filtered = getFilteredExpenses({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    category: category || undefined,
    type: (type as 'expense' | 'income') || undefined,
    searchQuery: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  const total = filtered.reduce((sum, e) => {
    return e.type === 'income' ? sum + e.amount : sum - e.amount;
  }, 0);

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
    <div className="history page-enter">
      <div className="history-header">
        <h1>Transaction History</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search transactions"
          id="search-transactions"
        />
      </div>

      <button
        className="btn-filter-toggle"
        onClick={() => setShowFilters(!showFilters)}
        id="toggle-filters-btn"
      >
        <SlidersHorizontal size={18} />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="filters-card" style={{ animation: 'fadeInUp 0.3s var(--ease-out)' }}>
          <h4>Filters</h4>
          <div className="filter-row">
            <input
              className="filter-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
              aria-label="Start date"
            />
            <input
              className="filter-input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
              aria-label="End date"
            />
          </div>
          <div className="filter-row">
            <select
              className="filter-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category filter"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="filter-input"
              value={type}
              onChange={(e) => setType(e.target.value as '' | 'expense' | 'income')}
              aria-label="Type filter"
            >
              <option value="">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="filter-row">
            <select
              className="filter-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              aria-label="Sort by"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <select
              className="filter-input"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              aria-label="Sort order"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>
      )}

      <div className="history-total">
        <span>Net Total ({filtered.length} items)</span>
        <span style={{ color: total >= 0 ? 'var(--success-600)' : 'var(--accent-600)' }}>
          {total >= 0 ? '+' : ''}${total.toFixed(2)}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Receipt size={36} />
          </div>
          <h3>No transactions found</h3>
          <p>{searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}</p>
        </div>
      ) : (
        <div className="expense-list" role="list">
          {filtered.map((expense, i) => (
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
    </div>
  );
}
