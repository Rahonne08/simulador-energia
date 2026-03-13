import { Appliance, BillConfig } from './types';
import { TARIFF_FLAGS } from './constants';
import { MARANHAO_CITIES } from './data/maranhaoCities';

export const calculateConsumption = (appliance: Appliance): number => {
  return (appliance.power * appliance.hoursPerDay * appliance.daysPerMonth * appliance.quantity) / 1000;
};

export const calculateTotalConsumption = (appliances: Appliance[]): number => {
  return appliances.reduce((total, app) => total + calculateConsumption(app), 0);
};

export const calculateBill = (totalConsumption: number, config: BillConfig): { base: number; extra: number; cip: number; total: number; discount: number } => {
  let base = 0;
  let discount = 0;
  let billedConsumption = totalConsumption;

  if (config.isLowIncome) {
    if (totalConsumption <= 80) {
      billedConsumption = 0;
      base = 0;
      discount = totalConsumption * 0.74;
    } else {
      billedConsumption = totalConsumption - 80;
      base = billedConsumption * 0.74;
      discount = 80 * 0.74;
    }
  } else {
    base = totalConsumption * config.tariff;
  }

  const flagExtra = TARIFF_FLAGS[config.flag].extraPer100kWh;
  const extra = (billedConsumption / 100) * flagExtra;
  
  const cityData = MARANHAO_CITIES.find(c => c.name === config.city);
  const cip = cityData ? cityData.cipValue : 15.00;
  
  return {
    base,
    extra,
    cip,
    total: base + extra + cip,
    discount
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
};
