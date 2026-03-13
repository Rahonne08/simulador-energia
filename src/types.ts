export interface Appliance {
  id: string;
  name: string;
  quantity: number;
  power: number; // Watts
  hoursPerDay: number;
  daysPerMonth: number;
}

export type TariffFlag = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

export interface BillConfig {
  tariff: number; // R$ per kWh
  flag: TariffFlag;
}
