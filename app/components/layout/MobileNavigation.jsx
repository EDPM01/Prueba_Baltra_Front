'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  Users, 
  Settings,
  Plus,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    badge: null
  },
  {
    name: 'Nuevo Mensaje',
    href: '/messages/new',
    icon: Plus,
    badge: null,
    highlight: true
  },
  {
    name: 'Programados',
    href: '/messages/scheduled',
    icon: Calendar,
    badge: 3
  },
  {
    name: 'Grupos',
    href: '/groups',
    icon: Users,
    badge: null
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    badge: null
  }
];

export default function MobileNavigation({ isOpen, onToggle }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">WhatsApp</h1>
              <p className="text-sm text-gray-500">Scheduler</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onToggle}
                className={cn(
                  "flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors",
                  isActive 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "text-gray-700 hover:bg-gray-50",
                  item.highlight && !isActive && "bg-green-600 text-white hover:bg-green-700"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn(
                    "h-5 w-5",
                    item.highlight && !isActive && "text-white"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </div>
                
                {item.badge && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      isActive && "bg-green-600 text-white",
                      item.highlight && !isActive && "bg-white text-green-600"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Conectado</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Última sincronización: hace 2 min
          </p>
        </div>
      </div>
    </>
  );
}
