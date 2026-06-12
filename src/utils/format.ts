export const formatCurrency = (amount: number, currencyCode: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};
