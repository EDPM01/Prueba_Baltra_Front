import Layout from '@/app/components/layout/Layout';
import Stats from '@/app/components/dashboard/Stats';
import QuickActions from '@/app/components/dashboard/QuickActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import StatusBadge from '@/app/components/messages/StatusBadge';
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  Plus,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  // Datos de ejemplo para mensajes recientes
  const recentMessages = [
    {
      id: 1,
      content: 'Recordatorio: Reunión de equipo mañana a las 10:00 AM',
      scheduledFor: '2025-07-27 09:00',
      groups: ['Equipo Desarrollo', 'Managers'],
      status: 'scheduled'
    },
    {
      id: 2,
      content: 'Promoción especial: 50% de descuento en todos los productos',
      scheduledFor: '2025-07-27 14:00',
      groups: ['Clientes VIP'],
      status: 'scheduled'
    },
    {
      id: 3,
      content: 'Feliz cumpleaños! 🎉',
      scheduledFor: '2025-07-26 12:00',
      groups: ['Personal'],
      status: 'sent'
    },
    {
      id: 4,
      content: 'Actualización del sistema programada para esta noche',
      scheduledFor: '2025-07-25 20:00',
      groups: ['Equipo Desarrollo'],
      status: 'error'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido a tu panel de control de WhatsApp Scheduler
            </p>
          </div>
          <Button asChild className="mt-4 sm:mt-0">
            <Link href="/messages/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Mensaje
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <Stats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mensajes Recientes - 2 columnas en desktop */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Mensajes Recientes
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/messages/scheduled">
                      Ver todos
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Últimos mensajes programados y enviados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusBadge status={message.status} size="sm" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {message.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{message.scheduledFor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{message.groups.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/messages/scheduled">
                      Ver todos los mensajes
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Acciones Rápidas y Actividad */}
          <div className="space-y-6">
            {/* Próximo Envío */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximo Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Recordatorio de reunión
                      </p>
                      <p className="text-xs text-blue-700 mb-2">
                        Mañana a las 09:00 AM
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          Equipo Desarrollo
                        </Badge>
                        <span className="text-xs text-blue-600">8 contactos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen Semanal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">23</p>
                    <p className="text-xs text-gray-500">Enviados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-xs text-gray-500">Programados</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tasa de entrega</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <Link href="/messages/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Mensaje
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/messages/scheduled">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Programados
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/groups">
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Grupos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
