const formatter = (value: number, digits: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
  }).format(value);
};

export { formatter };
