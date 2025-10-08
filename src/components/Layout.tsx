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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/my-trees', label: 'Мои деревья', icon: 'Folder' },
    { path: '/builder', label: 'Конструктор', icon: 'TreePine' },
    { path: '/statistics', label: 'Статистика', icon: 'BarChart3' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <header className="md:hidden sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="8" fill="hsl(var(--primary))" opacity="0.1"/>
            <rect x="12" y="10" width="20" height="26" rx="2" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
            <path d="M12 32H32" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="19" cy="16" r="2.5" fill="hsl(var(--primary))" opacity="0.6"/>
            <circle cx="25" cy="16" r="2.5" fill="hsl(var(--primary))" opacity="0.6"/>
            <circle cx="22" cy="20" r="3" fill="hsl(var(--primary))" opacity="0.8"/>
            <path d="M22 23V28" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M18 18L22 20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
            <path d="M26 18L22 20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h1 className="text-lg font-bold">SkillTree</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
        </Button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-background/95 backdrop-blur">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon name={item.icon as any} size={18} className="mr-3" />
                {item.label}
              </Button>
            ))}
            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
              >
                <Icon name="User" size={18} className="mr-3" />
                Профиль
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  setShowShareDialog(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon name="Share2" size={18} className="mr-3" />
                Поделиться
              </Button>
            </div>
          </nav>
        </div>
      )}

      <aside className="hidden md:flex w-64 border-r border-border bg-card/50 flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="hsl(var(--primary))" opacity="0.1"/>
              <rect x="12" y="10" width="20" height="26" rx="2" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
              <path d="M12 32H32" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="19" cy="16" r="2.5" fill="hsl(var(--primary))" opacity="0.6"/>
              <circle cx="25" cy="16" r="2.5" fill="hsl(var(--primary))" opacity="0.6"/>
              <circle cx="22" cy="20" r="3" fill="hsl(var(--primary))" opacity="0.8"/>
              <path d="M22 23V28" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M18 18L22 20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 18L22 20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
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
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
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