'use client';

import { useState } from 'react';
import { MessageSquare, Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import NotificationCenter from '@/app/components/notifications/NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Header({ onMenuClick, isSidebarOpen }) {
  // Datos mock de notificaciones para demo
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Mensaje enviado',
      message: 'El mensaje se envió exitosamente a 25 contactos',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Mensaje pausado',
      message: 'El envío fue pausado debido a límite de API',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
      read: false,
      action: {
        label: 'Reanudar',
        onClick: () => console.log('Reanudar envío')
      }
    },
    {
      id: 3,
      type: 'info',
      title: 'Recordatorio',
      message: 'Tienes 3 mensajes programados para mañana',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      read: false
    },
    {
      id: 4,
      type: 'error',
      title: 'Error de envío',
      message: 'No se pudo enviar mensaje al grupo "Clientes VIP"',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
      read: false,
      action: {
        label: 'Reintentar',
        onClick: () => console.log('Reintentar envío')
      }
    }
  ]);

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ).filter(notification => !notification.read || notification.id !== notificationId)
    );
  };

  const handleNotificationAction = (notification) => {
    if (notification.action?.onClick) {
      notification.action.onClick();
    }
    handleDismissNotification(notification.id);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left side - Logo and Menu */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 p-2 rounded-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">WhatsApp Scheduler</h1>
            <p className="text-sm text-gray-500">Gestiona tus mensajes programados</p>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Status indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Conectado</span>
        </div>

        {/* Active messages badge */}
        <div className="hidden sm:flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            3 activos
          </Badge>
        </div>

        {/* Notification Center */}
        <NotificationCenter
          notifications={notifications}
          onDismiss={handleDismissNotification}
          onAction={handleNotificationAction}
        />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
