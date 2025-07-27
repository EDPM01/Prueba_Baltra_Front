# 📱 WhatsApp Scheduler

Una aplicación web progresiva (PWA) completa para programar y gestionar el envío automático de mensajes de WhatsApp a grupos de contactos.

## 🚀 Características Principales

### 📨 **Gestión de Mensajes**
- ✅ Crear y programar mensajes para envío automático
- ✅ Vista previa de mensajes antes del envío
- ✅ Duplicar mensajes existentes
- ✅ Pausar/reanudar mensajes programados
- ✅ Historial completo de mensajes enviados
- ✅ Estadísticas de entrega (enviados, entregados, fallidos)

### 👥 **Gestión de Grupos y Contactos**
- ✅ Crear y organizar grupos de contactos
- ✅ Importar contactos desde archivos CSV/Excel
- ✅ Validación automática de números de teléfono
- ✅ Gestión individual de contactos
- ✅ Estadísticas por grupo

### 🔔 **Sistema de Notificaciones**
- ✅ Notificaciones en tiempo real
- ✅ Centro de notificaciones integrado
- ✅ Alertas de estado de mensajes
- ✅ Notificaciones push (PWA)

### 📱 **Diseño Responsivo y PWA**
- ✅ **100% Mobile-First**: Optimizado para dispositivos móviles
- ✅ **Progressive Web App**: Instalable en cualquier dispositivo
- ✅ **Navegación Adaptativa**: Sidebar en desktop, drawer en móvil
- ✅ **Animaciones Accesibles**: Respetan las preferencias del usuario
- ✅ **Modo Offline**: Funcionalidad básica sin conexión
- ✅ **Actualizaciones Automáticas**: Service Worker integrado

### ⚡ **Funcionalidades Avanzadas**
- ✅ **Custom Hooks**: Sistema completo de hooks reutilizables
- ✅ **Real-time Updates**: WebSocket para actualizaciones en vivo
- ✅ **Gestión de Estado**: State management robusto
- ✅ **Formularios Inteligentes**: Validación en tiempo real y auto-guardado
- ✅ **API Integration**: Manejo completo de APIs con retry y timeout
- ✅ **Wake Lock**: Prevenir suspensión durante operaciones importantes

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.4.4 con App Router
- **React**: 19.1.0 con hooks avanzados
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PWA**: Service Worker nativo
- **TypeScript**: JavaScript moderno con JSDoc

## 🏗️ Arquitectura del Proyecto

```
app/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de UI
│   │   ├── animations.jsx   # Sistema de animaciones
│   │   ├── loading.jsx      # Estados de carga
│   │   └── ...
│   ├── layout/          # Componentes de layout
│   │   ├── Sidebar.jsx      # Navegación desktop
│   │   ├── MobileNavigation.jsx  # Navegación móvil
│   │   └── Layout.jsx       # Layout principal
│   ├── messages/        # Componentes de mensajes
│   ├── groups/          # Componentes de grupos
│   ├── forms/           # Formularios especializados
│   └── notifications/   # Sistema de notificaciones
├── hooks/               # Custom hooks
│   ├── useApi.js           # Gestión de APIs
│   ├── useAdvancedForm.js  # Formularios avanzados
│   ├── useStorage.js       # LocalStorage y cache
│   ├── useListManager.js   # Gestión de listas
│   ├── useWebSocket.js     # WebSocket real-time
│   ├── useMessageManager.js # Gestión completa de mensajes
│   ├── useResponsive.js    # Responsive design
│   └── usePWA.js          # Progressive Web App
├── utils/               # Utilidades
├── (dashboard)/         # Páginas principales
└── globals.css         # Estilos globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd baltra_prueba
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

### Build para Producción

```bash
npm run build
npm run start
```

## 📱 Características PWA

### Instalación
- **Desktop**: Chrome mostrará un icono de instalación en la barra de direcciones
- **Mobile**: Usar "Agregar a pantalla de inicio" desde el menú del navegador
- **Automática**: La app mostrará un prompt de instalación cuando sea apropiado

### Funcionalidades Offline
- ✅ Cache de recursos estáticos
- ✅ Funcionalidad básica sin conexión
- ✅ Sincronización automática al reconectar
- ✅ Indicador de estado de conexión

### Actualizaciones
- ✅ Detección automática de nuevas versiones
- ✅ Prompt de actualización no intrusivo
- ✅ Actualización en background
- ✅ Reinicio automático tras actualización

## 🎨 Responsive Design

### Breakpoints
- **Mobile**: < 768px (diseño principal)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Navegación Adaptativa
- **Desktop**: Sidebar fijo lateral
- **Tablet/Mobile**: Drawer navigation con overlay
- **Header**: Se oculta automáticamente al hacer scroll en móvil

### Optimizaciones Móviles
- ✅ Touch targets de 44px mínimo
- ✅ Scroll suave y optimizado
- ✅ Safe areas para dispositivos con notch
- ✅ Orientación automática
- ✅ Zoom restringido para mejor UX

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_WS_URL=your_websocket_url

# PWA Configuration
NEXT_PUBLIC_APP_NAME="WhatsApp Scheduler"
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Personalización
- **Temas**: Configurables en `tailwind.config.js`
- **Componentes**: Extensibles en `components/ui/`
- **Hooks**: Reutilizables y combinables
- **Animaciones**: Configurables y accesibles

## 📊 Rendimiento

### Optimizaciones Implementadas
- ✅ **Lazy Loading**: Componentes y rutas
- ✅ **Code Splitting**: Bundle optimization
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Debouncing/Throttling**: En inputs y eventos
- ✅ **Memoization**: React.memo y useMemo
- ✅ **Service Worker**: Cache inteligente

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](repository-url/issues)
- **Discussions**: [GitHub Discussions](repository-url/discussions)
- **Email**: soporte@example.com

---

**Desarrollado con ❤️ usando Next.js y React**
