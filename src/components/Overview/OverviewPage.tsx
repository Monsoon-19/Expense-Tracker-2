import { useMemo, useState } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachWeekOfInterval, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { CHART_COLORS } from '../../utils/categories';

export default function OverviewPage() {
  const { expenses, totalIncome, totalExpenses } = useExpenses();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  // Weekly chart data (last 4 weeks)
  const chartData = useMemo(() => {
    const now = new Date();
    if (period === 'weekly') {
      const weeks = eachWeekOfInterval({
        start: subMonths(now, 1),
        end: now,
      });
      return weeks.slice(-4).map((weekStart, i) => {
        const weekEnd = endOfWeek(weekStart);
        const weekExpenses = expenses.filter((e) => {
          const d = e.date.toDate();
          return isWithinInterval(d, { start: weekStart, end: weekEnd });
        });
        const income = weekExpenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
        const exp = weekExpenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
        return { name: `Week ${i + 1}`, Income: income, Expenses: exp };
      });
    } else {
      const months = eachMonthOfInterval({
        start: subMonths(now, 5),
        end: now,
      });
      return months.map((monthStart) => {
        const monthEnd = endOfMonth(monthStart);
        const monthExpenses = expenses.filter((e) => {
          const d = e.date.toDate();
          return isWithinInterval(d, { start: monthStart, end: monthEnd });
        });
        const income = monthExpenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
        const exp = monthExpenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
        return { name: format(monthStart, 'MMM'), Income: income, Expenses: exp };
      });
    }
  }, [expenses, period]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const maxAmount = entries[0]?.[1] || 1;
    return entries.map(([name, amount], i) => ({
      name,
      amount,
      percentage: (amount / maxAmount) * 100,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [expenses]);

  return (
    <div className="overview page-enter">
      <div className="overview-header">
        <h1>Overview</h1>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-icon income" aria-hidden="true">
            <TrendingDown size={22} />
          </div>
          <div className="summary-card-label">Total Income</div>
          <div className="summary-card-amount" style={{ color: 'var(--success-600)' }}>
            ${totalIncome.toFixed(2)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-icon expense" aria-hidden="true">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Total Expenses</div>
          <div className="summary-card-amount" style={{ color: 'var(--accent-600)' }}>
            ${totalExpenses.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Statistics Chart */}
      <div className="chart-card">
        <h3>Statistics</h3>
        <div className="chart-period">
          <button
            className={`period-btn ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} tick={{ fill: '#737373' }} />
            <YAxis fontSize={12} tick={{ fill: '#737373' }} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                fontSize: 13,
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
            />
            <Legend />
            <Bar dataKey="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Expenses" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <div className="category-list">
            {categoryBreakdown.map((cat) => (
              <div className="category-item" key={cat.name}>
                <div className="category-dot" style={{ background: cat.color }} />
                <div className="category-info">
                  <div className="category-name">{cat.name}</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${cat.percentage}%`, background: cat.color }}
                    />
                  </div>
                </div>
                <div className="category-amount">${cat.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
