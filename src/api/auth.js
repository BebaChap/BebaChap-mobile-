// src/api/auth.js - MOCK API yenye roles zote
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const loginCustomer = async (phone) => {
  console.log('MOCK API: login customer na:', phone);
  return loginByRole(phone, 'customer');
};

export const loginVendor = async (phone) => {
  console.log('MOCK API: login vendor na:', phone);
  return loginByRole(phone, 'vendor');
};

export const loginByRole = async (phone, role) => {
  await delay(1500);
  if (!phone || phone.length < 10) throw new Error('Namba sio sahihi');
  return { success: true, data: { phone, role } };
};

export const verifyOTP = async (phone, otp, role = 'customer') => {
  console.log('MOCK API: verifyOTP called:', phone, otp, 'role:', role);
  await delay(1000);
  
  if (!otp || otp.length !== 6) throw new Error('OTP lazima iwe 6');
  
  return {
    success: true,
    message: 'Umefanikiwa',
    data: {
      user: {
        id: Date.now(),
        phone,
        name: 'Mtumiaji wa BeBachap',
        role: role, // <-- sasa inachukua driver/vendor/admin
        email: `${role}@bebachap.com`
      },
      token: 'mock-jwt-' + Date.now(),
    }
  };
};

export const registerCustomer = async (userData) => {
  return registerByRole({ ...userData, role: 'customer' });
};

export const registerByRole = async (userData) => {
  console.log('MOCK API: register', userData.role, 'na:', userData.phone);
  await delay(1500);
  return {
    success: true,
    data: {
      user: { id: Date.now(), ...userData },
      token: 'mock-jwt-' + Date.now(),
    }
  };
};

export const logout = async () => {
  await delay(500);
  return { success: true };
};