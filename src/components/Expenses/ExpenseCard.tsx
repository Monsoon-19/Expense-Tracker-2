import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import type { Expense } from '../../types';
import { getCategoryEmoji, getCategoryClass } from '../../utils/categories';

interface ExpenseCardProps {
  expense: Expense;
  index: number;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseCard({ expense, index, onEdit, onDelete }: ExpenseCardProps) {
  const dateStr = expense.date?.toDate
    ? format(expense.date.toDate(), 'MMM dd, yyyy')
    : '';

  const isIncome = expense.type === 'income';

  return (
    <div
      className="expense-card"
      style={{ animationDelay: `${index * 0.05}s` }}
      role="listitem"
      aria-label={`${expense.description} - ${isIncome ? '+' : '-'}$${expense.amount.toFixed(2)}`}
    >
      <div className={`expense-icon ${getCategoryClass(expense.category)}`} aria-hidden="true">
        {getCategoryEmoji(expense.category)}
      </div>
      <div className="expense-info">
        <div className="expense-name">{expense.description || expense.category}</div>
        <div className="expense-date">{dateStr}</div>
      </div>
      <div className={`expense-amount ${expense.type}`}>
        {isIncome ? '+' : '-'}${expense.amount.toFixed(2)}
      </div>
      <div className="expense-actions">
        <button
          className="expense-action-btn"
          onClick={(e) => { e.stopPropagation(); onEdit(expense); }}
          aria-label={`Edit ${expense.description}`}
        >
          <Pencil size={16} />
        </button>
        <button
          className="expense-action-btn delete"
          onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
          aria-label={`Delete ${expense.description}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
