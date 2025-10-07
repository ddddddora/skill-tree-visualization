import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ContextMenuAction {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  actions: ContextMenuAction[];
}

const ContextMenu = ({ x, y, onClose, actions }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <Card
        ref={menuRef}
        className="absolute min-w-[200px] shadow-lg"
        style={{ top: y, left: x }}
      >
        <div className="py-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-accent transition-colors ${
                action.variant === 'destructive' ? 'text-destructive hover:bg-destructive/10' : ''
              }`}
            >
              <Icon name={action.icon as any} size={16} />
              <span className="text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ContextMenu;
