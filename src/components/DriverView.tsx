import React from 'react';
import { Order } from '../types/order';
import { OrderCard } from './OrderCard';

interface DriverViewProps {
  orders: Order[];
  onStatusChange: (id: string) => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  orders,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
          isDriver
        />
      ))}
    </div>
  );
};
