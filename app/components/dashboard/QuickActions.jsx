'use client';

import { 
  Plus, 
  Calendar, 
  Users, 
  MessageSquare,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import Link from 'next/link';

export default function QuickActions({ className }) {
  const actions = [
    {
      title: 'Crear Mensaje',
      description: 'Programa un nuevo mensaje',
      icon: Plus,
      href: '/messages/new',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      title: 'Ver Programados',
      description: 'Gestionar mensajes pendientes',
      icon: Calendar,
      href: '/messages/scheduled',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      title: 'Gestionar Grupos',
      description: 'Administrar contactos',
      icon: Users,
      href: '/groups',
      color: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-white'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Mensaje enviado',
      target: 'Equipo Desarrollo',
      time: 'Hace 2 horas',
      status: 'success'
    },
    {
      id: 2,
      action: 'Mensaje programado',
      target: 'Clientes VIP',
      time: 'Hace 4 horas',
      status: 'scheduled'
    },
    {
      id: 3,
      action: 'Grupo creado',
      target: 'Marketing Team',
      time: 'Ayer',
      status: 'info'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'info':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  asChild
                  className={`w-full justify-between h-auto p-4 ${action.color}`}
                >
                  <Link href={action.href}>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Actividad Reciente
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/activity">
                  Ver todo
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.target}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status).replace('text-', 'bg-').replace('800', '600')}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Próximo mensaje programado
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900">
                    Recordatorio de reunión
                  </p>
                  <p className="text-xs text-blue-700">
                    Mañana a las 09:00 AM
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Para Equipo Desarrollo (8 contactos)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
