'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useState, useEffect } from 'react';
import { Toaster } from '@/app/components/ui/sonner';
import Sidebar from '@/app/components/layout/Sidebar';
import MobileNavigation from '@/app/components/layout/MobileNavigation';
import { NetworkStatus, UpdatePrompt, InstallPrompt } from '@/app/hooks/usePWA';
import { useBreakpoint, useScrollDirection } from '@/app/hooks/useResponsive';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const { isMobile, isTablet } = useBreakpoint();
  const { isScrollingDown, scrollY } = useScrollDirection();

  // Auto-cerrar sidebar en desktop cuando cambia el tamaño
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setSidebarOpen(false);
    }
  }, [isMobile, isTablet]);

  // Header que se oculta al hacer scroll en móvil
  const showHeader = !isMobile || !isScrollingDown || scrollY < 100;

  return (
    <html lang="es" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WhatsApp Scheduler" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn(
        inter.className,
        "h-full bg-gray-50 overflow-hidden",
        // Safe area para iOS
        "supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]",
        "supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]",
        "supports-[padding:max(0px)]:pl-[env(safe-area-inset-left)]",
        "supports-[padding:max(0px)]:pr-[env(safe-area-inset-right)]"
      )}>
        {/* Componentes PWA */}
        <NetworkStatus />
        <UpdatePrompt />
        
        {/* Install Prompt */}
        {showInstallPrompt && (
          <InstallPrompt
            onInstall={() => setShowInstallPrompt(false)}
            onDismiss={() => setShowInstallPrompt(false)}
          />
        )}

        <div className="h-full flex">
          {/* Sidebar Desktop */}
          {!isMobile && !isTablet && (
            <div className="w-64 flex-shrink-0">
              <Sidebar />
            </div>
          )}

          {/* Mobile Navigation */}
          {(isMobile || isTablet) && (
            <MobileNavigation
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header */}
            {(isMobile || isTablet) && (
              <header className={cn(
                "bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between transition-transform duration-300",
                "sticky top-0 z-40",
                !showHeader && "transform -translate-y-full"
              )}>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
                  aria-label="Abrir menú"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  WhatsApp Scheduler
                </h1>
                
                <div className="w-10" /> {/* Spacer for centering */}
              </header>
            )}

            {/* Page Content */}
            <main className={cn(
              "flex-1 overflow-auto",
              isMobile && "pb-16", // Espacio para navigation bottom
              // Scroll behavior mejorado
              "scroll-smooth focus:scroll-auto"
            )}>
              <div className={cn(
                "h-full",
                !isMobile && !isTablet && "p-6",
                (isMobile || isTablet) && "p-4"
              )}>
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Overlay para mobile sidebar */}
        {sidebarOpen && (isMobile || isTablet) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Toast Notifications */}
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: isMobile ? '14px' : '16px',
            },
          }}
        />

        {/* Loading indicator global (se puede usar con context) */}
        <div id="loading-portal" />
      </body>
    </html>
  );
}
