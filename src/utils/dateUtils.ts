export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const getDateRangeForPastDays = (days: number): string[] => {
  const dates = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};