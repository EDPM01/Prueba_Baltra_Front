import { z } from 'zod';

// Esquema para validar mensajes
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'El mensaje es requerido')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
  
  scheduledDate: z
    .date()
    .refine(date => date > new Date(), {
      message: 'La fecha debe ser futura'
    }),
  
  groups: z
    .array(z.string())
    .min(1, 'Debe seleccionar al menos un grupo')
});

// Esquema para validar grupos
export const groupSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del grupo es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  
  description: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional(),
  
  contacts: z
    .array(z.string())
    .min(1, 'Debe agregar al menos un contacto')
});

// Esquema para validar contactos
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido')
});

export default {
  messageSchema,
  groupSchema,
  contactSchema
};
