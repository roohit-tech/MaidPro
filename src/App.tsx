import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ProviderApp } from './components/provider/ProviderApp';
import { CustomerApp } from './components/customer/CustomerApp';
import { AdminPanel } from './components/admin/AdminPanel';

function AppContent() {
  const { role } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1">
        {role === 'provider' && <ProviderApp />}
        {role === 'customer' && <CustomerApp />}
        {role === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
