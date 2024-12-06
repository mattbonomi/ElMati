import React from 'react';
import { Order } from '../types/order';
import {
  Clock,
  CheckCircle,
  Edit,
  XCircle,
} from 'lucide-react';

export const Icons = {
  Clock,
  CheckCircle,
  Edit,
  XCircle,
};

interface OrderCardProps {
  order: Order;
  onEdit?: (id: string) => void;
  onStatusChange?: (id: string) => void;
  onCancel?: (id: string) => void;
  isDriver?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onEdit,
  onStatusChange,
  onCancel,
  isDriver,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'text-yellow-600';
      case 'en-proceso':
        return 'text-blue-600';
      case 'completado':
        return 'text-green-600';
      case 'cancelado':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{order.direccion}</h3>
          <p className="text-sm text-gray-500">Cantidad: {order.cantidad}</p>
          <p className="text-sm text-gray-500">
            Forma de Pago:{' '}
            {order.formaDePago === 'Cash' ? 'Efectivo' : 'Transferencia'}
          </p>
          <p className="text-sm text-gray-500">
            Estado de Pago:{' '}
            <span
              className={`font-medium ${
                order.pago ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {order.pago ? 'Pago' : 'No Pago'}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Estado:{' '}
            <span className={`font-bold ${getStatusColor(order.estado)}`}>
              {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
            </span>
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          {isDriver && order.estado !== 'cancelado' && (
            <>
              {/* Status change button */}
              <button
                className={`px-4 py-2 text-white rounded flex items-center justify-center space-x-2 ${
                  order.estado === 'pendiente'
                    ? 'bg-blue-500 hover:bg-blue-700'
                    : order.estado === 'en-proceso'
                    ? 'bg-green-500 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={() => onStatusChange?.(order.id)}
                disabled={order.estado === 'completado'}
              >
                {order.estado === 'pendiente' && (
                  <Icons.Clock className="w-4 h-4" />
                )}
                {order.estado === 'en-proceso' && (
                  <Icons.CheckCircle className="w-4 h-4" />
                )}
                <span>
                  {order.estado === 'pendiente'
                    ? 'Iniciar'
                    : order.estado === 'en-proceso'
                    ? 'Completar'
                    : 'Finalizado'}
                </span>
              </button>
            </>
          )}

          {!isDriver &&
            order.estado !== 'completado' &&
            order.estado !== 'cancelado' && (
              <>
                <button
                  onClick={() => onEdit?.(order.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center justify-center space-x-2"
                >
                  <Icons.Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onCancel?.(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center space-x-2"
                >
                  <Icons.XCircle className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};
