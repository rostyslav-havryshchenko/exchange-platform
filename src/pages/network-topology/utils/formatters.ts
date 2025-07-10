/**
 * Utility functions for formatting data in charts and displays
 */

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
};

export const formatPriceShort = (price: number) => {
  if (price >= 1e9) {
    return `$${(price / 1e9).toFixed(1)}B`;
  } else if (price >= 1e6) {
    return `$${(price / 1e6).toFixed(1)}M`;
  } else if (price >= 1e3) {
    return `$${(price / 1e3).toFixed(1)}k`;
  } else {
    return `$${price.toFixed(2)}`;
  }
};

export const formatDate = (timestamp: number, timePeriod: string) => {
  const date = new Date(timestamp);
  if (timePeriod === '1' || timePeriod === '24') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timePeriod === '7') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};