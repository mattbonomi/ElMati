export type Role = 'dispatcher' | 'driver';
export type OrderStatus = 'pendiente' | 'en-proceso' | 'completado' | 'cancelado';

export interface Order {
  id: string;
  direccion: string;
  cantidad: number;
  formaDePago: 'Cash' | 'Transfer';
  pago: boolean; // Payment status
  estado: OrderStatus;
  mapUrl: string;
  timestamp: number;
}
