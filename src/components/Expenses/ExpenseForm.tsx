import { useState } from 'react';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../types';
import type { Expense, ExpenseFormData } from '../../types';
import { format } from 'date-fns';
import { useCurrency } from '../../context/CurrencyContext';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onClose: () => void;
  editingExpense?: Expense | null;
}

export default function ExpenseForm({ onSubmit, onClose, editingExpense }: ExpenseFormProps) {
  const { currency } = useCurrency();
  const [type, setType] = useState<'expense' | 'income'>(editingExpense?.type ?? 'expense');
  const [amount, setAmount] = useState(editingExpense?.amount?.toString() ?? '');
  const [category, setCategory] = useState(editingExpense?.category ?? '');
  const [date, setDate] = useState(
    editingExpense ? format(editingExpense.date.toDate(), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [description, setDescription] = useState(editingExpense?.description ?? '');
  const [loading, setLoading] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    setLoading(true);
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        category,
        date,
        description,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Add transaction">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <h2>{editingExpense ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="type-toggle" role="radiogroup" aria-label="Transaction type">
            <button
              type="button"
              className={type === 'expense' ? 'active-expense' : ''}
              onClick={() => { setType('expense'); setCategory(''); }}
              role="radio"
              aria-checked={type === 'expense'}
            >
              Expense
            </button>
            <button
              type="button"
              className={type === 'income' ? 'active-income' : ''}
              onClick={() => { setType('income'); setCategory(''); }}
              role="radio"
              aria-checked={type === 'income'}
            >
              Income
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <div className="amount-input-wrapper">
              <span className="amount-prefix">
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'}
              </span>
              <input
                id="amount"
                className="form-input amount-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="date">Date</label>
              <input
                id="date"
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <input
              id="description"
              className="form-input"
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} id="expense-submit-btn">
            {loading ? 'Saving...' : editingExpense ? 'Update' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
