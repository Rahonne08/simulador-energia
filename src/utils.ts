import { Appliance, BillConfig } from './types';
import { TARIFF_FLAGS } from './constants';
import { MARANHAO_CITIES } from './data/maranhaoCities';

export const calculateConsumption = (appliance: Appliance): number => {
  return (appliance.power * appliance.hoursPerDay * appliance.daysPerMonth * appliance.quantity) / 1000;
};

export const calculateTotalConsumption = (appliances: Appliance[]): number => {
  return appliances.reduce((total, app) => total + calculateConsumption(app), 0);
};

export const calculateBill = (totalConsumption: number, config: BillConfig): { 
  base: number; 
  extra: number; 
  cip: number; 
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
  
  const cityData = MARANHAO_CITIES.find(c => c.name === config.city);
  let cip = cityData ? cityData.cipValue : 15.00;

  // Codó CIP calculation based on the new law
  if (config.city === 'Codó') {
    // Assuming Residential class for the simulator
    if (totalConsumption <= 100) cip = 0.00;
    else if (totalConsumption <= 120) cip = 19.05;
    else if (totalConsumption <= 140) cip = 20.35;
    else if (totalConsumption <= 180) cip = 24.02; // Assuming 141-180 based on the table gap
    else if (totalConsumption <= 220) cip = 37.82;
    else if (totalConsumption <= 270) cip = 49.37;
    else if (totalConsumption <= 320) cip = 55.87;
    else if (totalConsumption <= 370) cip = 58.30;
    else if (totalConsumption <= 420) cip = 65.50;
    else if (totalConsumption <= 500) cip = 70.20;
    else if (totalConsumption <= 600) cip = 101.12;
    else if (totalConsumption <= 700) cip = 111.82;
    else if (totalConsumption <= 800) cip = 120.50;
    else if (totalConsumption <= 900) cip = 128.90;
    else if (totalConsumption <= 1000) cip = 135.60;
    else if (totalConsumption <= 1250) cip = 192.52;
    else if (totalConsumption <= 1500) cip = 202.60;
    else if (totalConsumption <= 2000) cip = 212.90;
    else if (totalConsumption <= 3000) cip = 263.24;
    else cip = 263.24; // Fallback for > 3000
  }
  
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
    cip,
    icms,
    pis,
    cofins,
    totalTaxes,
    total: taxBase + totalTaxes + cip,
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
