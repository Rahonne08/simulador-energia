export interface Appliance {
  id: string;
  name: string;
  quantity: number;
  power: number; // Watts
  hoursPerDay: number;
  daysPerMonth: number;
}

export type TariffFlag = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

export type ConnectionType = 'monofasico' | 'bifasico' | 'trifasico';

export interface BillConfig {
  tariff: number; // R$ per kWh
  flag: TariffFlag;
  isLowIncome: boolean;
  connectionType: ConnectionType;
}
