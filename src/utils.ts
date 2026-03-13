import { Appliance, BillConfig } from './types';
import { TARIFF_FLAGS } from './constants';

export const calculateConsumption = (appliance: Appliance): number => {
  return (appliance.power * appliance.hoursPerDay * appliance.daysPerMonth * appliance.quantity) / 1000;
};

export const calculateTotalConsumption = (appliances: Appliance[]): number => {
  return appliances.reduce((total, app) => total + calculateConsumption(app), 0);
};

export const calculateBill = (totalConsumption: number, config: BillConfig): { 
  base: number; 
  extra: number; 
  icms: number;
  pis: number;
  cofins: number;
  totalTaxes: number;
  total: number; 
  discount: number;
  billedConsumption: number;
} => {
  let availabilityCostKwh = 30;
  if (config.connectionType === 'bifasico') availabilityCostKwh = 50;
  if (config.connectionType === 'trifasico') {
    if (config.isLowIncome && totalConsumption <= 80) {
      availabilityCostKwh = 80;
    } else {
      availabilityCostKwh = 100;
    }
  }

  // Faturamento pelo maior valor entre consumo e custo de disponibilidade (Art. 290)
  const billedConsumption = Math.max(totalConsumption, availabilityCostKwh);

  let base = 0;
  let discount = 0;

  if (config.isLowIncome) {
    if (billedConsumption <= 80) {
      base = 0;
      discount = billedConsumption * config.tariff;
    } else {
      base = (billedConsumption - 80) * config.tariff;
      discount = 80 * config.tariff;
    }
  } else {
    base = billedConsumption * config.tariff;
  }

  const flagExtra = TARIFF_FLAGS[config.flag].extraPer100kWh;
  let extra = 0;
  let extraDiscount = 0;
  
  if (config.isLowIncome) {
    if (billedConsumption <= 80) {
      extra = 0;
      extraDiscount = (billedConsumption / 100) * flagExtra;
    } else {
      extra = ((billedConsumption - 80) / 100) * flagExtra;
      extraDiscount = (80 / 100) * flagExtra;
    }
  } else {
    extra = (billedConsumption / 100) * flagExtra;
  }
  
  discount += extraDiscount;
  
  // Tax calculation (Cálculo por dentro)
  const taxBase = base + extra;
  const icmsRate = 0.23;
  const pisRate = 0.005288;
  const cofinsRate = 0.024410;
  
  // Total = Cost / (1 - ICMS - (1 - ICMS)*PIS - (1 - ICMS)*COFINS)
  const effectiveTaxRate = icmsRate + ((1 - icmsRate) * pisRate) + ((1 - icmsRate) * cofinsRate);
  const totalWithTaxes = taxBase / (1 - effectiveTaxRate);
  
  const icms = totalWithTaxes * icmsRate;
  const basePisCofins = totalWithTaxes - icms;
  const pis = basePisCofins * pisRate;
  const cofins = basePisCofins * cofinsRate;
  const totalTaxes = icms + pis + cofins;

  return {
    base,
    extra,
    icms,
    pis,
    cofins,
    totalTaxes,
    total: taxBase + totalTaxes,
    discount,
    billedConsumption
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
};
