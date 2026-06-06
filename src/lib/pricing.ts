import { Service } from './types';

// lib/pricing.ts
export const VEHICLES = [
  {
    id: 'boda',
    name: 'Boda Boda',
    image: require('../assets/boda.png'),
    pricePerKm: 800,
  },
  // ...
];
export const calculatePrice = (
  service: Service,
  distanceKm: number,
  isNight: boolean = false
) => {
  const formula = service.pricing_formula;
  let total = 0;

  if (formula.type === 'per_km' && service.price_per_km) {
    total = service.base_price + (distanceKm * service.price_per_km);
  } else if (formula.type === 'flat') {
    total = service.base_price;
  }

  // Weka minimum
  if (formula.minimum_price && total < formula.minimum_price) {
    total = formula.minimum_price;
  }

  // Ongeza usiku
  if (isNight && formula.night_surcharge) {
    total = total * formula.night_surcharge;
  }

  return Math.round(total);
}