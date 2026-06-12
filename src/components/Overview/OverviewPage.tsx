import { useMemo, useState } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { format, endOfWeek, endOfMonth, eachWeekOfInterval, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { CHART_COLORS } from '../../utils/categories';
import { formatCurrency } from '../../utils/format';
import { useCurrency } from '../../context/CurrencyContext';

export default function OverviewPage() {
  const { expenses, totalIncome, totalExpenses, loading } = useExpenses();
  const { currency } = useCurrency();
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
        return { name: `W${i + 1}`, Income: income, Expenses: exp };
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

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '50vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="overview page-enter">
      <div className="overview-header" style={{ marginBottom: 20 }}>
        <h2>Statistics</h2>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-icon income" aria-hidden="true">
            <TrendingUp size={22} color="var(--success-500)" />
          </div>
          <div className="summary-card-label">Income</div>
          <div className="summary-card-amount" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-icon expense" aria-hidden="true">
            <TrendingDown size={22} color="var(--danger-500)" />
          </div>
          <div className="summary-card-label">Expenses</div>
          <div className="summary-card-amount" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(totalExpenses, currency)}
          </div>
        </div>
      </div>

      {/* Statistics Chart */}
      <div className="chart-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Analytics</h3>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value as any)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '8px', 
              border: '1px solid var(--gray-200)',
              background: 'var(--bg-card)',
              outline: 'none',
              fontSize: '0.85rem'
            }}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 16px' }}>
            <div className="empty-state-icon">
              <Receipt size={28} />
            </div>
            <h3>No data yet</h3>
            <p>Add some transactions to see your statistics</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#737373' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: 'var(--shadow-lg)',
                  fontSize: 13,
                }}
                formatter={(value) => [`${formatCurrency(Number(value), currency)}`]}
              />
              <Area type="monotone" dataKey="Expenses" stroke="var(--primary-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
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
