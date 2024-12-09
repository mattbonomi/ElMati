import React from 'react';
import { Order } from '../types/order';
import { OrderForm } from './OrderForm';
import { OrderCard } from './OrderCard';
import { db } from '../../firebase'; // Import from '../../firebase'
import { doc, updateDoc } from 'firebase/firestore';

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
  const handleMarkAsPaid = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { pago: true });
      // Puedes agregar aquí una actualización del estado local si es necesario
      console.log('Orden marcada como pagada:', orderId);
    } catch (error) {
      console.error('Error al marcar la orden como pagada:', error);
    }
  };

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
          >
            {/* Aquí agregamos el botón "Marcar como pago" */}
            <button onClick={() => handleMarkAsPaid(order.id)}>
              Marcar como pago
            </button>
          </OrderCard>
        ))}
      </div>
    </div>
  );
};