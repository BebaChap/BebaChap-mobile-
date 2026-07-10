export const isvalidphonetz = (phone) => {
  const regex = /^(\+255|0)[67]\d{8}$/;
  return regex.test(phone);
};

export const isvalidemail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isvalidprice = (price) => {
  const num = number(price);
  return!isnan(num) && num > 0;
};

export const isrequired = (value) => {
  return value!== null && value!== undefined && value.tostring().trim()!== '';
};

export const validateproduct = (product) => {
  const errors = {};
  if (!isrequired(product.name)) errors.name = 'jina la bidhaa linahitajika';
  if (!isvalidprice(product.price)) errors.price = 'weka bei sahihi';
  if (!product.image) errors.image = 'chagua picha ya bidhaa';
  return {
    isvalid: object.keys(errors).length === 0,
    errors
  };
};