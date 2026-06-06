export type Service = {
  id: string;
  name: string;
  name_en: string;
  service_type: 'bodaboda' | 'taxi' | 'bajaji';
  base_price: number;
  price_per_km: number | null;
  pricing_formula: {
    type: 'per_km' | 'flat';
    minimum_price?: number;
    night_surcharge?: number;
    waiting_price_per_min?: number;
  }
}