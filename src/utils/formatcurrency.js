export const formatcurrency = (amount, locale = 'sw-tz') => {
  return new intl.numberformat(locale, {
    style: 'currency',
    currency: 'tzs'
  }).format(amount);
};