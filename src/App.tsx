import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Role } from './types/order';
import { Header } from './components/Header';
import { OrderStats } from './components/OrderStats';
import { DispatcherView } from './components/DispatcherView';
import { DriverView } from './components/DriverView';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('dispatcher');
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCol = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersCol);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.direccion?.trim()) return;

    try {
      if (editingId) {
        // Update existing order
        const { id, ...rest } = formData;
        const orderRef = doc(db, 'orders', editingId);
        await updateDoc(orderRef, rest);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === editingId ? { ...order, ...rest } : order,
          ),
        );
      } else {
        // Create new order
        const newOrder: Order = {
          direccion: formData.direccion || '',
          cantidad: formData.cantidad || 0,
          formaDePago: (formData.formaDePago as 'Cash' | 'Transferencia') || 'Cash',
          pago: Boolean(formData.pago),
          estado: 'pendiente',
          mapUrl: '',
          timestamp: Date.now(),
          id: ''
        };
        const docRef = await addDoc(collection(db, 'orders'), newOrder);
        setOrders((prev) => [...prev, { ...newOrder, id: docRef.id }]);
    }

      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error adding/updating document: ', error);
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const orderRef = doc(db, 'orders', id);
      const orderToUpdate = orders.find((order) => order.id === id);

      if (orderToUpdate) {
        const statusMap: Record<OrderStatus, OrderStatus> = {
          pendiente: 'en-proceso',
          'en-proceso': 'completado',
          completado: 'completado',
          cancelado: 'cancelado',
        };
        const newStatus = statusMap[orderToUpdate.estado];
        const isCompleted = newStatus === 'completado';

        await updateDoc(orderRef, {
          estado: newStatus,
          pago: isCompleted ? true : orderToUpdate.pago,
        });

        setOrders((prev) =>
          prev.map((order) =>
            order.id === id
              ? {
                  ...order,
                  estado: newStatus,
                  pago: isCompleted ? true : order.pago,
                }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
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
          setRole((prevRole) =>
            prevRole === 'dispatcher' ? 'driver' : 'dispatcher',
          )
        }
      />

      <main className="max-w-7xl mx-auto py-8 px-4">
        <OrderStats orders={orders} />

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {role === 'dispatcher' ? (
              <DispatcherView
                orders={orders}
                formData={formData}
                editingId={editingId}
                onFormSubmit={handleFormSubmit}
                onInputChange={handleInputChange}
                onEdit={handleEdit}
                onCancel={handleCancelOrder}
              />
            ) : (
              <DriverView
                orders={orders}
                onStatusChange={handleStatusChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;