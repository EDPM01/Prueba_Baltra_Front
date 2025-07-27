'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Stats({ className }) {
  const stats = [
    {
      title: 'Mensajes Programados',
      value: '12',
      change: '+2',
      changeType: 'increase',
      description: 'Pendientes de envío',
      icon: 'clock',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Mensajes Enviados',
      value: '145',
      change: '+23',
      changeType: 'increase',
      description: 'Este mes',
      icon: 'check',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      title: 'Tasa de Entrega',
      value: '98.5%',
      change: '+1.2%',
      changeType: 'increase',
      description: 'Últimos 30 días',
      icon: 'trending',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Grupos Activos',
      value: '8',
      change: '0',
      changeType: 'neutral',
      description: 'Con contactos',
      icon: 'users',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200'
    }
  ];

  const getChangeIcon = (type) => {
    switch (type) {
      case 'increase':
        return <ArrowUpRight className="h-3 w-3" />;
      case 'decrease':
        return <ArrowDownRight className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'increase':
        return 'text-green-600 bg-green-100';
      case 'decrease':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <Card key={index} className={cn(
          "hover:shadow-md transition-shadow duration-200 border",
          stat.borderColor
        )}>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header con cambio */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                {stat.change !== '0' && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs flex items-center space-x-1 px-2 py-1",
                      getChangeColor(stat.changeType)
                    )}
                  >
                    {getChangeIcon(stat.changeType)}
                    <span>{stat.change}</span>
                  </Badge>
                )}
              </div>

              {/* Valor principal */}
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>

              {/* Indicador visual */}
              <div className={cn(
                "w-full h-1 rounded-full",
                stat.bgColor
              )} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
