import { Appliance, BillConfig } from './types';
import { TARIFF_FLAGS } from './constants';

export const calculateConsumption = (appliance: Appliance): number => {
  return (appliance.power * appliance.hoursPerDay * appliance.daysPerMonth) / 1000;
};

export const calculateTotalConsumption = (appliances: Appliance[]): number => {
  return appliances.reduce((total, app) => total + calculateConsumption(app), 0);
};

export const calculateBill = (totalConsumption: number, config: BillConfig): { base: number; extra: number; total: number } => {
  const base = totalConsumption * config.tariff;
  const flagExtra = TARIFF_FLAGS[config.flag].extraPer100kWh;
  const extra = (totalConsumption / 100) * flagExtra;
  return {
    base,
    extra,
    total: base + extra,
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
};
