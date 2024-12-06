import React from 'react';
import { Order } from '../types/order';
import { Icons } from './icons';

interface OrderStatsProps {
  orders: Order[];
}

export const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const completedOrders = orders.filter(order => order.estado === 'completado');
  const totalCompletedItems = completedOrders.reduce((sum, order) => sum + order.cantidad, 0);
  const canceledOrders = orders.filter(order => order.estado === 'cancelado');
  const totalPaidOrders = orders.filter(order => order.pago).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <Icons.Package className="w-8 h-8 text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">Total Órdenes</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <Icons.PackageCheck className="w-8 h-8 text-green-500" />
        <div>
          <p className="text-sm text-gray-500">Items Completados</p>
          <p className="text-2xl font-bold">{totalCompletedItems}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <Icons.PackageX className="w-8 h-8 text-red-500" />
        <div>
          <p className="text-sm text-gray-500">Órdenes Canceladas</p>
          <p className="text-2xl font-bold">{canceledOrders.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
        <Icons.DollarSign className="w-8 h-8 text-yellow-500" />
        <div>
          <p className="text-sm text-gray-500">Órdenes Pagadas</p>
          <p className="text-2xl font-bold">{totalPaidOrders}</p>
        </div>
      </div>
    </div>
  );
};