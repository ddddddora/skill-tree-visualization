import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareDialog from './ShareDialog';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showShareDialog, setShowShareDialog] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/my-trees', label: 'Мои деревья', icon: 'Folder' },
    { path: '/builder', label: 'Конструктор', icon: 'TreePine' },
    { path: '/statistics', label: 'Статистика', icon: 'BarChart3' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="hsl(var(--primary))" opacity="0.1"/>
              <rect x="10" y="14" width="24" height="20" rx="2" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none"/>
              <path d="M22 14V10" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 34L22 30L34 34" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 24V28" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 20L22 24L26 20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="22" cy="10" r="2" fill="hsl(var(--primary))"/>
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
          <Button variant="ghost" className="w-full justify-start" onClick={() => setShowShareDialog(true)}>
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

      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        treeId="my-profile"
        treeName="Мой профиль"
      />
    </div>
  );
};

export default Layout;