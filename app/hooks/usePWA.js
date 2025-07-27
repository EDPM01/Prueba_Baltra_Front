'use client';

import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verificar si está en modo standalone (PWA instalada)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
    };

    checkStandalone();

    // Listener para el evento de instalación
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // Listener para cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return false;

    try {
      const result = await installPrompt.prompt();
      const outcome = await result.userChoice;
      
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  };

  return {
    installPrompt,
    isInstalled,
    isStandalone,
    canInstall: !!installPrompt,
    installApp
  };
};

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateConnectionType = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    // Eventos de conexión
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Información de conexión (si está disponible)
    if ('connection' in navigator) {
      const connection = navigator.connection;
      updateConnectionType();
      
      connection.addEventListener('change', updateConnectionType);
      
      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        connection.removeEventListener('change', updateConnectionType);
      };
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    connectionType,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g'
  };
};

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

export const useServiceWorker = () => {
  const [registration, setRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);

        // Verificar actualizaciones
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            }
          });
        });
      });

      // Listener para cuando se activa un nuevo SW
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const updateApp = async () => {
    if (!registration || !updateAvailable) return;

    setIsUpdating(true);
    
    try {
      const waitingWorker = registration.waiting;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      console.error('Error updating app:', error);
      setIsUpdating(false);
    }
  };

  return {
    registration,
    updateAvailable,
    isUpdating,
    updateApp,
    isSupported: 'serviceWorker' in navigator
  };
};

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsActive(true);

        lock.addEventListener('release', () => {
          setIsActive(false);
          setWakeLock(null);
        });

        return true;
      } catch (error) {
        console.error('Wake lock failed:', error);
        return false;
      }
    }
    return false;
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
        return true;
      } catch (error) {
        console.error('Failed to release wake lock:', error);
        return false;
      }
    }
    return false;
  };

  return {
    isSupported: 'wakeLock' in navigator,
    isActive,
    requestWakeLock,
    releaseWakeLock
  };
};

// Componente InstallPrompt
export const InstallPrompt = ({ onInstall, onDismiss }) => {
  const { canInstall, installApp } = usePWA();

  if (!canInstall) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      onInstall?.();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Instalar App</h3>
          <p className="text-sm text-gray-600 mt-1">
            Agrega esta aplicación a tu pantalla de inicio para un acceso rápido.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex space-x-2 mt-3">
        <button
          onClick={handleInstall}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700"
        >
          Instalar
        </button>
        <button
          onClick={onDismiss}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
};

// Componente NetworkStatus
export const NetworkStatus = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 text-center py-2 text-white text-sm ${
      isOnline ? 'bg-orange-500' : 'bg-red-500'
    }`}>
      {isOnline 
        ? 'Conexión lenta detectada' 
        : 'Sin conexión a internet'
      }
    </div>
  );
};

// Componente UpdatePrompt
export const UpdatePrompt = () => {
  const { updateAvailable, isUpdating, updateApp } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Actualización disponible</h3>
          <p className="text-sm opacity-90">
            Hay una nueva versión de la aplicación disponible.
          </p>
        </div>
        <button
          onClick={updateApp}
          disabled={isUpdating}
          className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          {isUpdating ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
    </div>
  );
};
