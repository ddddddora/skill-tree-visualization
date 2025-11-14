import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareDialog from './ShareDialog';
import AuthDialog from './AuthDialog';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

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
          <img 
            src="https://cdn.poehali.dev/files/08644768-6677-4e7c-b42b-cd8a6c5fb5f9.png" 
            alt="SkillTree Logo" 
            width="32" 
            height="32" 
            className="rounded-lg transition-all duration-300 hover:brightness-110 hover:scale-105"
            style={{ filter: 'hue-rotate(20deg) saturate(0.8) brightness(1.1)' }}
          />
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
              {user ? (
                <>
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
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive" 
                    onClick={() => {
                      setUser(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon name="LogOut" size={18} className="mr-3" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setShowAuthDialog(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon name="LogIn" size={18} className="mr-3" />
                  Войти
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      <aside className="hidden md:flex w-64 border-r border-border bg-card/50 flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/08644768-6677-4e7c-b42b-cd8a6c5fb5f9.png" 
              alt="SkillTree Logo" 
              width="44" 
              height="44" 
              className="rounded-xl transition-all duration-300 hover:brightness-110 hover:scale-105 cursor-pointer"
              style={{ filter: 'hue-rotate(20deg) saturate(0.8) brightness(1.1)' }}
            />
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
          {user ? (
            <>
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
                <Icon name="User" size={18} className="mr-3" />
                Профиль
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setShowShareDialog(true)}>
                <Icon name="Share2" size={18} className="mr-3" />
                Поделиться
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => setUser(null)}>
                <Icon name="LogOut" size={18} className="mr-3" />
                Выйти
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={() => setShowAuthDialog(true)}>
              <Icon name="LogIn" size={18} className="mr-3" />
              Войти
            </Button>
          )}
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

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuth={(email) => setUser(email)}
      />
    </div>
  );
};

export default Layout;