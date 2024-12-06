import React from 'react';
import { Order } from '../types/order';
import { OrderForm } from './OrderForm';
import { OrderCard } from './OrderCard';

interface DispatcherViewProps {
  orders: Order[];
  formData: Partial<Order>;
  editingId: string | null;
  onFormSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
}

export const DispatcherView: React.FC<DispatcherViewProps> = ({
  orders,
  formData,
  editingId,
  onFormSubmit,
  onInputChange,
  onEdit,
  onCancel,
}) => {
  return (
    <div className="space-y-6">
      <OrderForm
        formData={formData}
        editingId={editingId}
        onSubmit={onFormSubmit}
        onChange={onInputChange}
      />
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
};