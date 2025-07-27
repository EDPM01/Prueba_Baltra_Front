import Layout from '@/app/components/layout/Layout';
import MessageForm from '@/app/components/forms/MessageForm';
import { Toaster } from '@/app/components/ui/sonner';

export default function NewMessage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Mensaje</h1>
            <p className="text-gray-600">Programa un mensaje para enviar por WhatsApp</p>
          </div>
        </div>

        <MessageForm />
      </div>
      <Toaster />
    </Layout>
  );
}
