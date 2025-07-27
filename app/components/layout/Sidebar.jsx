'use client';

import { 
  Home, 
  MessageCircle, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
    badge: null
  },
  {
    title: 'Nuevo Mensaje',
    href: '/messages/new',
    icon: Plus,
    badge: null
  },
  {
    title: 'Mensajes Programados',
    href: '/messages/scheduled',
    icon: Calendar,
    badge: 5
  },
  {
    title: 'Mensajes Enviados',
    href: '/messages/sent',
    icon: MessageCircle,
    badge: null
  },
  {
    title: 'Grupos',
    href: '/groups',
    icon: Users,
    badge: null
  },
  {
    title: 'Estadísticas',
    href: '/stats',
    icon: BarChart3,
    badge: null
  },
  {
    title: 'Configuración',
    href: '/settings',
    icon: Settings,
    badge: null
  }
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 w-64 z-50 transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">WhatsApp Scheduler</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Acceso Rápido</h3>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              size="sm"
              asChild
            >
              <Link href="/messages/new">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Mensaje
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
