'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import { useBreakpoint, useScrollDirection } from '@/app/hooks/useResponsive';
import { cn } from '@/lib/utils';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, isDesktop } = useBreakpoint();
  const { scrollDirection } = useScrollDirection();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with responsive behavior */}
      <Header 
        onMenuClick={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        className={cn(
          "transition-transform duration-300",
          isMobile && scrollDirection === 'down' && "transform -translate-y-full"
        )}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        {isDesktop && (
          <Sidebar 
            isOpen={true} 
            onClose={() => {}}
            className="hidden lg:block"
          />
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <MobileNavigation 
            isOpen={isSidebarOpen} 
            onToggle={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 lg:ml-0",
          "transition-all duration-300"
        )}>
          <div className={cn(
            "p-4 lg:p-6",
            "pb-safe-bottom", // Safe area for mobile devices
            isMobile && "pb-20" // Extra padding for mobile
          )}>
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Indicator */}
      {isMobile && (
        <div className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-10",
          "transition-transform duration-300",
          scrollDirection === 'down' && "transform translate-y-full"
        )}>
          <div className="flex items-center justify-center text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Sistema conectado
          </div>
        </div>
      )}
    </div>
  );
}
