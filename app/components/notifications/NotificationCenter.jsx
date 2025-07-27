'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Send,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationItem = ({ notification, onDismiss, onAction }) => {
  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Clock,
    message: Send,
    system: Wifi
  };

  const colorMap = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    message: 'text-purple-600 bg-purple-50 border-purple-200',
    system: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  const Icon = iconMap[notification.type] || Bell;

  return (
    <div className={cn(
      'flex items-start space-x-3 p-4 border rounded-lg transition-all duration-300',
      colorMap[notification.type],
      'hover:shadow-md'
    )}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium">{notification.title}</p>
            {notification.message && (
              <p className="text-sm opacity-80 mt-1">{notification.message}</p>
            )}
            <p className="text-xs opacity-60 mt-2">
              {format(notification.timestamp, 'HH:mm - d MMM', { locale: es })}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(notification.id)}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {notification.action && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction(notification)}
            className="mt-3 text-xs"
          >
            {notification.action.label}
          </Button>
        )}

        {notification.progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span>Progreso</span>
              <span>{Math.round(notification.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-current h-2 rounded-full transition-all duration-300" 
                style={{ width: `${notification.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationCenter({ notifications = [], onDismiss, onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Simular cambios de conexión
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular pérdida de conexión ocasional
      if (Math.random() < 0.1) {
        setConnectionStatus('disconnected');
        setTimeout(() => setConnectionStatus('connected'), 3000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDismiss = (notificationId) => {
    onDismiss?.(notificationId);
  };

  const handleAction = (notification) => {
    onAction?.(notification);
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        handleDismiss(notification.id);
      }
    });
  };

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative",
          unreadCount > 0 && "text-blue-600"
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 min-w-0"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificaciones
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                
                {/* Estado de conexión */}
                <div className="flex items-center space-x-2">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground self-start p-0 h-auto"
                >
                  Marcar todas como leídas
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={handleDismiss}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
