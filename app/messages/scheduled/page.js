'use client';

import Layout from '@/app/components/layout/Layout';
import MessageList from '@/app/components/messages/MessageList';
import { Toaster } from '@/app/components/ui/sonner';
import { useRouter } from 'next/navigation';

export default function ScheduledMessages() {
  const handleCreateNew = () => {
    // En una aplicación real, esto sería un hook de Next.js
    if (typeof window !== 'undefined') {
      window.location.href = '/messages/new';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mensajes Programados</h1>
            <p className="text-gray-600">Gestiona todos tus mensajes programados y enviados</p>
          </div>
        </div>

        <MessageList onCreateNew={handleCreateNew} />
      </div>
      <Toaster />
    </Layout>
  );
}
