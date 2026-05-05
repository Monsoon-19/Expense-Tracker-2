export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'Food & Dining': '🍔',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '💡',
    'Health & Fitness': '💪',
    'Travel': '✈️',
    'Education': '📚',
    'Personal Care': '💅',
    'Gifts & Donations': '🎁',
    'Investments': '📈',
    'Salary': '💰',
    'Freelance': '💻',
    'Business': '🏢',
    'Rental': '🏠',
    'Refund': '↩️',
    'Other': '📌',
  };
  return map[category] || '📌';
}

export function getCategoryClass(category: string): string {
  const map: Record<string, string> = {
    'Food & Dining': 'food',
    'Transportation': 'transport',
    'Shopping': 'shopping',
    'Entertainment': 'entertainment',
    'Bills & Utilities': 'bills',
    'Health & Fitness': 'health',
    'Travel': 'travel',
    'Education': 'education',
    'Salary': 'salary',
    'Freelance': 'freelance',
  };
  return map[category] || 'other';
}

export const CHART_COLORS = [
  '#7c3aed', '#f97316', '#22c55e', '#3b82f6',
  '#ec4899', '#eab308', '#06b6d4', '#8b5cf6',
  '#f43f5e', '#14b8a6', '#a855f7', '#64748b',
];
