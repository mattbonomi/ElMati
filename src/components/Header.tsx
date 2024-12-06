import React from 'react';
import { Role } from '../types/order';

interface HeaderProps {
  role: Role;
  onRoleChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onRoleChange }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {role === 'dispatcher' ? 'Dispatcher View' : 'Driver View'}
        </h1>
        <button
          onClick={onRoleChange}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Switch to {role === 'dispatcher' ? 'Driver' : 'Dispatcher'}
        </button>
      </div>
    </header>
  );
};