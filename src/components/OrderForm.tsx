import React from 'react';
import { Order } from '../types/order';

interface OrderFormProps {
  formData: Partial<Order>;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  editingId,
  onSubmit,
  onChange,
}) => {
  return (
    <form className="p-4 bg-white rounded shadow" onSubmit={onSubmit}>
      <h2 className="text-lg font-bold mb-4">
        {editingId ? 'Editar Orden' : 'Nueva Orden'}
      </h2>
      <div className="grid gap-4">
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion || ''}
          onChange={onChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad || ''}
          onChange={onChange}
          className="p-2 border rounded"
          required
          min="1"
        />
        <select
          name="formaDePago"
          value={formData.formaDePago || 'Cash'}
          onChange={onChange}
          className="p-2 border rounded"
        >
          <option value="Cash">Efectivo</option>
          <option value="Transfer">Transferencia</option>
        </select>
        <select
          name="pago"
          value={formData.pago?.toString() || 'false'}
          onChange={onChange}
          className="p-2 border rounded"
        >
          <option value="true">Pago</option>
          <option value="false">No Pago</option>
        </select>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editingId ? 'Actualizar Orden' : 'Crear Orden'}
      </button>
    </form>
  );
};