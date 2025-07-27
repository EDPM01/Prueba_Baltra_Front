'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Calendar } from '@/app/components/ui/calendar';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
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
import { getMinSelectableDate } from '@/app/utils/dateUtils';

export default function DateTimePicker({ value, onChange, error }) {
  const [date, setDate] = useState(value?.date);
  const [time, setTime] = useState(value?.time || '12:00');

  const minDate = getMinSelectableDate();

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    updateDateTime(selectedDate, time);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
    updateDateTime(date, newTime);
  };

  const updateDateTime = (selectedDate, selectedTime) => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      onChange?.({
        date: selectedDate,
        time: selectedTime,
        dateTime: dateTime
      });
    }
  };

  // Generar opciones de tiempo cada 15 minutos
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Fecha y Hora de Envío</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Fecha */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  error && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < minDate}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Selector de Hora */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Hora</Label>
          <Select value={time} onValueChange={handleTimeChange}>
            <SelectTrigger className={cn(error && "border-red-500")}>
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((timeOption) => (
                <SelectItem key={timeOption} value={timeOption}>
                  {timeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Información adicional */}
      {date && time && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Programado para: {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })} a las {time}
            </span>
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
