export type Role = 'dispatcher' | 'driver';
export type OrderStatus = 'pendiente' | 'en-proceso' | 'completado' | 'cancelado';

export interface Order {
  id: string;
  timestamp: number; // Changed to number
  direccion: string;
  cantidad: number;
  formaDePago: 'Cash' | 'Transferencia'; 
  pago: boolean;
  estado: OrderStatus;
  mapUrl?: string;
}
