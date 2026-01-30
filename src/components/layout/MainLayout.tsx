import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Sidebar 
        isDark={isDark} 
        onToggleTheme={toggleTheme} 
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />
      <div className={`transition-all duration-300 ${collapsed ? 'pl-[72px]' : 'pl-60'}`}>
        <Header title={title} subtitle={subtitle || ''} />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
