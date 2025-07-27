'use client';

import { useState } from 'react';
import { Check, ChevronDown, Users, X, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { cn } from '@/lib/utils';

// Datos de ejemplo de grupos
const mockGroups = [
  {
    id: '1',
    name: 'Equipo Desarrollo',
    description: 'Desarrolladores y programadores',
    contactCount: 8,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Equipo de marketing y ventas',
    contactCount: 12,
    color: 'bg-green-100 text-green-800'
  },
  {
    id: '3',
    name: 'Clientes VIP',
    description: 'Clientes premium y corporativos',
    contactCount: 25,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: '4',
    name: 'Managers',
    description: 'Gerentes y directivos',
    contactCount: 6,
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: '5',
    name: 'Personal',
    description: 'Contactos personales',
    contactCount: 15,
    color: 'bg-gray-100 text-gray-800'
  },
  {
    id: '6',
    name: 'Proveedores',
    description: 'Proveedores y socios comerciales',
    contactCount: 18,
    color: 'bg-yellow-100 text-yellow-800'
  }
];

export default function GroupSelector({ value = [], onChange, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedGroups = mockGroups.filter(group => value.includes(group.id));

  const handleGroupToggle = (groupId) => {
    const newValue = value.includes(groupId)
      ? value.filter(id => id !== groupId)
      : [...value, groupId];
    
    onChange?.(newValue);
  };

  const removeGroup = (groupId) => {
    const newValue = value.filter(id => id !== groupId);
    onChange?.(newValue);
  };

  const clearAll = () => {
    onChange?.([]);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Grupos de Destinatarios</Label>
      
      {/* Selector Principal */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between min-h-[40px] h-auto py-2",
              error && "border-red-500"
            )}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-left">
                {value.length === 0
                  ? "Seleccionar grupos..."
                  : `${value.length} grupo${value.length !== 1 ? 's' : ''} seleccionado${value.length !== 1 ? 's' : ''}`
                }
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-4 space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de Grupos */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => {
                  const isSelected = value.includes(group.id);
                  return (
                    <div
                      key={group.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        isSelected 
                          ? "bg-green-50 border-green-200" 
                          : "hover:bg-gray-50 border-gray-200"
                      )}
                      onClick={() => handleGroupToggle(group.id)}
                    >
                      <div className={cn(
                        "w-4 h-4 border-2 rounded flex items-center justify-center",
                        isSelected 
                          ? "bg-green-600 border-green-600" 
                          : "border-gray-300"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{group.name}</span>
                          <Badge variant="secondary" className={group.color}>
                            {group.contactCount}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron grupos</p>
                </div>
              )}
            </div>

            {/* Acciones */}
            {value.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="w-full"
                >
                  Limpiar selección
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Grupos Seleccionados */}
      {selectedGroups.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Grupos Seleccionados:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedGroups.map((group) => (
              <Badge
                key={group.id}
                variant="secondary"
                className={cn(group.color, "flex items-center space-x-1 pr-1")}
              >
                <span>{group.name}</span>
                <span className="text-xs">({group.contactCount})</span>
                <button
                  onClick={() => removeGroup(group.id)}
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Total de contactos: {selectedGroups.reduce((sum, group) => sum + group.contactCount, 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
