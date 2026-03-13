import { TariffFlag } from './types';

export const TARIFF_FLAGS: Record<TariffFlag, { label: string; extraPer100kWh: number; color: string; bg: string }> = {
  verde: { label: 'Bandeira Verde', extraPer100kWh: 0, color: 'text-green-600', bg: 'bg-green-100' },
  amarela: { label: 'Bandeira Amarela', extraPer100kWh: 1.88, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  vermelha1: { label: 'Bandeira Vermelha P1', extraPer100kWh: 4.46, color: 'text-red-500', bg: 'bg-red-100' },
  vermelha2: { label: 'Bandeira Vermelha P2', extraPer100kWh: 7.87, color: 'text-red-700', bg: 'bg-red-200' },
};

export const COMMON_APPLIANCES = [
  { name: 'Geladeira', power: 150, hoursPerDay: 24, daysPerMonth: 30 },
  { name: 'Ar condicionado', power: 1200, hoursPerDay: 8, daysPerMonth: 30 },
  { name: 'Chuveiro elétrico', power: 5500, hoursPerDay: 0.5, daysPerMonth: 30 },
  { name: 'TV', power: 120, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Máquina de lavar', power: 500, hoursPerDay: 1, daysPerMonth: 15 },
  { name: 'Lâmpada LED', power: 9, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Lâmpada Incandescente', power: 60, hoursPerDay: 5, daysPerMonth: 30 },
  { name: 'Ferro de passar', power: 1000, hoursPerDay: 1, daysPerMonth: 8 },
  { name: 'Computador', power: 250, hoursPerDay: 8, daysPerMonth: 30 },
];
