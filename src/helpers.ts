const formatter = (value: number, digits = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
  }).format(value);
};

export { formatter };
