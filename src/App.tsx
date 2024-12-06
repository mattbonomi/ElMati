import React, { useState } from 'react';
import { Order, OrderStatus, Role } from './types/order';
import { Header } from './components/Header';
import { OrderStats } from './components/OrderStats';
import { TabNavigation } from './components/TabNavigation';
import { DispatcherView } from './components/DispatcherView';
import { DriverView } from './components/DriverView';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('dispatcher');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      direccion: 'Av. Corrientes 1234, CABA',
      cantidad: 2,
      formaDePago: 'Cash',
      pago: false, // Initially set to 'No Pago'
      estado: 'pendiente',
      mapUrl: '',
      timestamp: Date.now(),
    },
    // Add more orders as needed
  ]);
  const [activeTab, setActiveTab] = useState<OrderStatus>('pendiente');
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => order.estado === activeTab);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pago'
          ? value === 'true'
          : name === 'cantidad'
          ? Number(value)
          : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.direccion?.trim()) return;

    setOrders((prev) => {
      if (editingId) {
        return prev.map((order) =>
          order.id === editingId ? { ...order, ...formData } : order
        );
      }

      const newOrder: Order = {
        id: (prev.length + 1).toString(),
        direccion: formData.direccion || '',
        cantidad: formData.cantidad || 0,
        formaDePago:
          (formData.formaDePago as 'Cash' | 'Transfer') || 'Cash',
        pago: Boolean(formData.pago),
        estado: 'pendiente',
        mapUrl: '',
        timestamp: Date.now(),
      };
      return [...prev, newOrder];
    });

    setFormData({});
    setEditingId(null);
  };

  const handleStatusChange = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;

        const statusMap: Record<OrderStatus, OrderStatus> = {
          pendiente: 'en-proceso',
          'en-proceso': 'completado',
          completado: 'completado',
          cancelado: 'cancelado',
        };

        const newStatus = statusMap[order.estado];

        // Automatically set 'pago' to true when order is completed
        const isCompleted = newStatus === 'completado';
        return {
          ...order,
          estado: newStatus,
          pago: isCompleted ? true : order.pago,
        };
      })
    );
  };

  const handleCancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, estado: 'cancelado' } : order
      )
    );
  };

  const handleEdit = (id: string) => {
    const orderToEdit = orders.find((o) => o.id === id);
    if (orderToEdit) {
      setFormData(orderToEdit);
      setEditingId(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        role={role}
        onRoleChange={() =>
          setRole(role === 'dispatcher' ? 'driver' : 'dispatcher')
        }
      />

      <main className="max-w-7xl mx-auto py-8 px-4">
        <OrderStats orders={orders} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {role === 'dispatcher' ? (
          <DispatcherView
            orders={filteredOrders}
            formData={formData}
            editingId={editingId}
            onFormSubmit={handleFormSubmit}
            onInputChange={handleInputChange}
            onEdit={handleEdit}
            onCancel={handleCancelOrder}
          />
        ) : (
          <DriverView
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
};

export default App;
