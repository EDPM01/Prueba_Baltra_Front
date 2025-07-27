# 🔧 Guía de Integración Backend - WhatsApp Scheduler

## 📋 Información del Proyecto

### Stack Tecnológico Completo
- **Frontend**: Next.js 15.4.4 + React 19.1.0 + Tailwind CSS + Shadcn/ui
- **Backend**: FastAPI (Python)
- **Base de Datos**: Supabase (PostgreSQL)
- **WhatsApp Integration**: WhatsApp-web.js
- **Deployment**: Vercel (Frontend) + Backend separado

---

## 🚀 APIs Requeridas para el Frontend

### 🔐 **Autenticación**
```http
POST /api/auth/login
POST /api/auth/logout  
POST /api/auth/refresh
GET  /api/auth/me
```

### 📨 **Gestión de Mensajes**
```http
# CRUD de mensajes
GET    /api/messages              # Lista paginada
POST   /api/messages              # Crear mensaje
GET    /api/messages/{id}         # Obtener mensaje
PUT    /api/messages/{id}         # Actualizar mensaje
DELETE /api/messages/{id}         # Eliminar mensaje

# Acciones de mensajes
POST   /api/messages/{id}/schedule # Programar envío
POST   /api/messages/{id}/pause    # Pausar mensaje
POST   /api/messages/{id}/resume   # Reanudar mensaje
POST   /api/messages/{id}/cancel   # Cancelar mensaje
POST   /api/messages/{id}/duplicate # Duplicar mensaje
GET    /api/messages/{id}/preview  # Vista previa

# Estadísticas
GET    /api/messages/{id}/stats    # Estadísticas de envío
GET    /api/messages/dashboard     # Dashboard stats
```

### 👥 **Gestión de Grupos y Contactos**
```http
# Grupos
GET    /api/groups                # Lista de grupos
POST   /api/groups                # Crear grupo
GET    /api/groups/{id}           # Obtener grupo
PUT    /api/groups/{id}           # Actualizar grupo
DELETE /api/groups/{id}           # Eliminar grupo

# Contactos
GET    /api/contacts              # Lista de contactos
POST   /api/contacts              # Crear contacto
POST   /api/contacts/import       # Importar CSV/Excel
PUT    /api/contacts/{id}         # Actualizar contacto
DELETE /api/contacts/{id}         # Eliminar contacto

# Relaciones grupo-contacto
GET    /api/groups/{id}/contacts  # Contactos del grupo
POST   /api/groups/{id}/contacts  # Agregar contactos
DELETE /api/groups/{id}/contacts/{contact_id} # Remover contacto
```

### 🔔 **Notificaciones**
```http
GET    /api/notifications         # Lista de notificaciones
POST   /api/notifications/mark-read/{id} # Marcar como leída
DELETE /api/notifications/{id}    # Eliminar notificación
GET    /api/notifications/unread-count # Contador no leídas
```

### 📊 **Analytics y Reportes**
```http
GET    /api/analytics/dashboard   # Métricas principales
GET    /api/analytics/messages    # Análisis de mensajes
GET    /api/analytics/groups      # Análisis de grupos
GET    /api/reports/export        # Exportar reportes
```

---

## 📡 **WebSocket Events (Real-time)**

### Conexión WebSocket
```javascript
// Conexión
ws://your-backend-url/ws/{user_id}

// Autenticación
{
  "type": "auth",
  "token": "jwt_token_here"
}
```

### Eventos que el Frontend Escucha
```javascript
// Estado de mensajes
{
  "type": "message_status_update",
  "message_id": "123",
  "status": "sending|sent|delivered|failed",
  "timestamp": "2025-01-27T10:00:00Z"
}

// Progreso de envío
{
  "type": "message_progress",
  "message_id": "123", 
  "sent": 50,
  "total": 100,
  "failed": 2
}

// Nuevas notificaciones
{
  "type": "new_notification",
  "notification": {
    "id": "456",
    "type": "success|error|warning|info",
    "title": "Mensaje enviado",
    "message": "El mensaje se envió correctamente",
    "timestamp": "2025-01-27T10:00:00Z"
  }
}

// Estado de WhatsApp
{
  "type": "whatsapp_status",
  "status": "connected|disconnected|qr_needed",
  "qr_code": "base64_qr_image" // solo si status = qr_needed
}
```

### Eventos que el Frontend Envía
```javascript
// Ping/Pong para mantener conexión
{
  "type": "ping"
}

// Suscribirse a actualizaciones de mensaje específico
{
  "type": "subscribe_message",
  "message_id": "123"
}

// Cancelar suscripción
{
  "type": "unsubscribe_message", 
  "message_id": "123"
}
```

---

## 📊 **Estructuras de Datos (JSON Schemas)**

### Mensaje
```json
{
  "id": "string",
  "content": "string",
  "scheduled_for": "2025-01-27T14:30:00Z",
  "status": "draft|scheduled|sending|sent|paused|cancelled|failed",
  "groups": [
    {
      "id": "string",
      "name": "string",
      "contact_count": 25
    }
  ],
  "created_at": "2025-01-27T10:00:00Z",
  "updated_at": "2025-01-27T10:00:00Z",
  "sent_at": "2025-01-27T14:30:00Z",
  "recipient_count": 100,
  "delivered_count": 95,
  "failed_count": 5,
  "created_by": "user_id"
}
```

### Grupo
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "contact_count": 25,
  "created_at": "2025-01-27T10:00:00Z",
  "updated_at": "2025-01-27T10:00:00Z",
  "created_by": "user_id"
}
```

### Contacto
```json
{
  "id": "string",
  "name": "string",
  "phone": "+1234567890",
  "email": "optional@email.com",
  "is_active": true,
  "groups": ["group_id_1", "group_id_2"],
  "created_at": "2025-01-27T10:00:00Z",
  "updated_at": "2025-01-27T10:00:00Z"
}
```

### Notificación
```json
{
  "id": "string",
  "type": "success|error|warning|info",
  "title": "string",
  "message": "string",
  "is_read": false,
  "related_entity_type": "message|group|contact",
  "related_entity_id": "string",
  "created_at": "2025-01-27T10:00:00Z"
}
```

---

## 🔄 **Flujo de Trabajo Típico**

### 1. Creación de Mensaje
```mermaid
sequenceDiagram
    Frontend->>Backend: POST /api/messages
    Backend->>DB: Guardar mensaje (status: draft)
    Backend->>Frontend: Mensaje creado
    Frontend->>Backend: POST /api/messages/{id}/schedule
    Backend->>WhatsApp: Validar conexión
    Backend->>DB: Actualizar status (scheduled)
    Backend->>Frontend: WS: message_status_update
```

### 2. Envío de Mensaje
```mermaid
sequenceDiagram
    Backend->>WhatsApp: Iniciar envío masivo
    Backend->>Frontend: WS: message_status_update (sending)
    loop Por cada contacto
        Backend->>WhatsApp: Enviar mensaje individual
        Backend->>Frontend: WS: message_progress
    end
    Backend->>DB: Actualizar estadísticas finales
    Backend->>Frontend: WS: message_status_update (sent)
```

---

## ⚙️ **Configuraciones Requeridas**

### Variables de Entorno Backend
```env
# Base de datos
DATABASE_URL=postgresql://user:pass@host:port/db
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE_HOURS=24

# WhatsApp
WHATSAPP_SESSION_PATH=/path/to/sessions
WHATSAPP_PUPPETEER_ARGS=--no-sandbox

# Redis (para cache y jobs)
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

### Headers CORS Necesarios
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
```

---

## 📱 **Consideraciones para PWA**

### Cache Headers
```http
# Para recursos estáticos del API
Cache-Control: public, max-age=31536000, immutable

# Para datos dinámicos
Cache-Control: no-cache, must-revalidate

# Para endpoints de usuario
Cache-Control: private, max-age=300
```

### Offline Support
- Implementar endpoint para sincronización: `POST /api/sync`
- Permitir operaciones diferidas cuando el frontend vuelva online
- Queue de acciones pendientes en el backend

---

## 🚦 **Códigos de Estado HTTP**

### Respuestas Exitosas
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `204 No Content` - Eliminación exitosa

### Errores del Cliente  
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto de datos
- `422 Unprocessable Entity` - Validación fallida

### Errores del Servidor
- `500 Internal Server Error` - Error interno
- `502 Bad Gateway` - Error de WhatsApp API
- `503 Service Unavailable` - Servicio temporalmente no disponible

---

## 🔧 **Validaciones Requeridas**

### Números de Teléfono
```python
# Formato esperado: +[código_país][número]
# Ejemplos válidos: +56912345678, +1234567890
import re

def validate_phone(phone):
    pattern = r'^\+[1-9]\d{1,14}$'
    return re.match(pattern, phone) is not None
```

### Contenido de Mensajes
- Longitud máxima: 4096 caracteres
- No permitir HTML/scripts
- Sanitizar caracteres especiales
- Detectar y prevenir spam

### Fechas de Programación
- No permitir fechas pasadas
- Máximo 1 año en el futuro
- Respetar zona horaria del usuario

---

## 📊 **Métricas y Monitoring**

### Endpoints de Health Check
```http
GET /api/health              # Estado general
GET /api/health/db           # Estado base de datos  
GET /api/health/whatsapp     # Estado WhatsApp
GET /api/health/redis        # Estado Redis
```

### Métricas a Trackear
- Tiempo de respuesta API
- Tasa de éxito de envío de mensajes
- Conexiones WebSocket activas
- Uso de memoria y CPU
- Errores de WhatsApp-web.js

---

## 🔒 **Seguridad**

### Autenticación JWT
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rate Limiting
- Envío de mensajes: 10 por minuto por usuario
- Creación de grupos: 5 por minuto por usuario
- Login attempts: 5 por 15 minutos por IP

### Validación de Permisos
- Los usuarios solo pueden ver/editar sus propios recursos
- Admins pueden ver todos los recursos
- Logs de auditoría para acciones críticas

---

## 🧪 **Testing del API**

### Endpoints Críticos para Testear
1. **Autenticación**: Login/logout/refresh
2. **CRUD Mensajes**: Crear, listar, editar, eliminar
3. **Programación**: Schedule/pause/resume/cancel
4. **WebSocket**: Conexión y eventos en tiempo real
5. **Importación**: CSV/Excel de contactos

### Casos de Prueba
- Validación de datos inválidos
- Manejo de errores de WhatsApp
- Reconexión automática WebSocket
- Límites de rate limiting
- Recuperación ante fallos de red

---

## 📞 **Contacto y Soporte**

### Para el Equipo Backend
- **Slack**: #backend-whatsapp-scheduler
- **Email**: backend-team@company.com
- **Documentación API**: http://backend-url/docs
- **Swagger UI**: http://backend-url/swagger

### Recursos Adicionales
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WhatsApp-web.js Guide](https://github.com/pedroslopez/whatsapp-web.js)
- [Supabase Docs](https://supabase.com/docs)
- [WebSocket RFC](https://tools.ietf.org/html/rfc6455)

---

**⚡ Esta documentación será actualizada conforme evolucione el proyecto**
