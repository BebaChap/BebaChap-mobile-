// Hapa utaunganisha na API za M-Pesa, Tigo Pesa, Airtel Money
export const initiateMobilePayment = async (phone, amount, provider) => {
  // Mfano: POST kwa backend yako ambayo inaunganisha na Daraja API
  const res = await fetch('https://api.yourapp.com/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount, provider })
  });
  return res.json();
};