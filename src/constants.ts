import { TariffFlag } from './types';

export const TARIFF_FLAGS: Record<TariffFlag, { label: string; extraPer100kWh: number; color: string; bg: string }> = {
  verde: { label: 'Bandeira Verde', extraPer100kWh: 0, color: 'text-green-600', bg: 'bg-green-100' },
  amarela: { label: 'Bandeira Amarela', extraPer100kWh: 1.88, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  vermelha1: { label: 'Bandeira Vermelha P1', extraPer100kWh: 4.46, color: 'text-red-500', bg: 'bg-red-100' },
  vermelha2: { label: 'Bandeira Vermelha P2', extraPer100kWh: 7.87, color: 'text-red-700', bg: 'bg-red-200' },
};

export const COMMON_APPLIANCES = [
  { name: 'Geladeira', quantity: 1, power: 150, hoursPerDay: 24, daysPerMonth: 30 },
  { name: 'Ar condicionado 9.000 BTUs', quantity: 1, power: 1000, hoursPerDay: 8, daysPerMonth: 30 },
  { name: 'Ar condicionado 12.000 BTUs', quantity: 1, power: 1364, hoursPerDay: 8, daysPerMonth: 30 },
  { name: 'Chuveiro elétrico', quantity: 1, power: 5500, hoursPerDay: 0.5, daysPerMonth: 30 },
  { name: 'TV 32"', quantity: 1, power: 180, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'TV 42"', quantity: 1, power: 280, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Máquina de lavar 10kg', quantity: 1, power: 1060, hoursPerDay: 1, daysPerMonth: 15 },
  { name: 'Lâmpada LED 9W', quantity: 1, power: 9, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Lâmpada LED 18W', quantity: 1, power: 18, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Lâmpada Incandescente 60W', quantity: 1, power: 60, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Ferro de passar automático', quantity: 1, power: 1000, hoursPerDay: 1, daysPerMonth: 8 },
  { name: 'Computador', quantity: 1, power: 250, hoursPerDay: 8, daysPerMonth: 30 },
  { name: 'Notebook', quantity: 1, power: 100, hoursPerDay: 8, daysPerMonth: 30 },
  { name: 'Ventilador / Circulador de Ar', quantity: 1, power: 100, hoursPerDay: 8, daysPerMonth: 30 },
  { name: 'Micro-ondas 30L', quantity: 1, power: 1110, hoursPerDay: 0.5, daysPerMonth: 30 },
  { name: 'Liquidificador', quantity: 1, power: 270, hoursPerDay: 0.2, daysPerMonth: 30 },
  { name: 'Batedeira', quantity: 1, power: 100, hoursPerDay: 0.5, daysPerMonth: 8 },
  { name: 'Cafeteira elétrica', quantity: 1, power: 550, hoursPerDay: 1, daysPerMonth: 30 },
  { name: 'Fritadeira (Air Fryer)', quantity: 1, power: 1500, hoursPerDay: 0.5, daysPerMonth: 15 },
  { name: 'Secador de cabelo', quantity: 1, power: 1200, hoursPerDay: 0.3, daysPerMonth: 15 },
  { name: 'Prancha alisadora (Chapinha)', quantity: 1, power: 300, hoursPerDay: 0.5, daysPerMonth: 15 },
  { name: 'Videogame (Console)', quantity: 1, power: 200, hoursPerDay: 3, daysPerMonth: 30 },
  { name: 'Freezer Vertical', quantity: 1, power: 120, hoursPerDay: 24, daysPerMonth: 30 },
  { name: 'Freezer Horizontal', quantity: 1, power: 150, hoursPerDay: 24, daysPerMonth: 30 },
  { name: 'Bomba d\'água 1/2 HP', quantity: 1, power: 373, hoursPerDay: 1, daysPerMonth: 30 },
  { name: 'Carregador de celular', quantity: 1, power: 10, hoursPerDay: 3, daysPerMonth: 30 },
];
