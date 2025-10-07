import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/builder', label: 'Конструктор', icon: 'TreePine' },
    { path: '/statistics', label: 'Статистика', icon: 'BarChart3' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="22" cy="22" r="21" fill="hsl(var(--primary))" opacity="0.1"/>
              <path d="M22 10L24 16H20L22 10Z" fill="hsl(var(--primary))"/>
              <circle cx="22" cy="18" r="2.5" fill="hsl(var(--primary))"/>
              <path d="M22 20L20 26L16 28" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 20L22 26L22 30" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M22 20L24 26L28 28" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="28" r="2.5" fill="hsl(var(--secondary))"/>
              <circle cx="22" cy="30" r="3" fill="hsl(var(--accent))"/>
              <circle cx="28" cy="28" r="2.5" fill="hsl(var(--muted))"/>
            </svg>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SkillTree</h1>
              <p className="text-xs text-muted-foreground">Визуализация роста</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
            >
              <Icon name={item.icon as any} size={18} className="mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
            <Icon name="User" size={18} className="mr-3" />
            Профиль
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Icon name="Share2" size={18} className="mr-3" />
            Поделиться
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
