import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface CanvasToolbarProps {
  onAddSection: () => void;
  onAddSkill: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale: number;
}

const CanvasToolbar = ({
  onAddSection,
  onAddSkill,
  onZoomIn,
  onZoomOut,
  onResetView,
  scale,
}: CanvasToolbarProps) => {
  return (
    <aside className="w-64 border-r bg-card/50 p-4 space-y-6">
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="Wrench" size={16} />
          Инструменты
        </h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddSection}
          >
            <Icon name="Box" size={16} className="mr-2" />
            Добавить раздел
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddSkill}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить навык
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="Library" size={16} />
          Библиотека
        </h2>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Icon name="Lightbulb" size={14} className="mr-2" />
            Готовые навыки
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Icon name="TreePine" size={14} className="mr-2" />
            Готовые ветки
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="Maximize2" size={16} />
          Вид
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
              className="flex-1"
            >
              <Icon name="ZoomOut" size={14} />
            </Button>
            <div className="px-2 text-sm font-medium">
              {Math.round(scale * 100)}%
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomIn}
              className="flex-1"
            >
              <Icon name="ZoomIn" size={14} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={onResetView}
          >
            <Icon name="Minimize2" size={14} className="mr-2" />
            Сбросить вид
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="Settings" size={16} />
          Действия
        </h2>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="Layout" size={14} className="mr-2" />
            Упорядочить дерево
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="Palette" size={14} className="mr-2" />
            Цвета разделов
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CanvasToolbar;
