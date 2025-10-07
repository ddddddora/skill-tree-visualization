import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { SkillNode } from '@/pages/Builder';

interface CanvasNodeProps {
  node: SkillNode;
  x: number;
  y: number;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const CanvasNode = ({ node, x, y, isDragging, onMouseDown, onClick }: CanvasNodeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle2" size={16} className="text-green-500" />;
      case 'in-progress':
        return <Icon name="Clock" size={16} className="text-yellow-500" />;
      default:
        return <Icon name="Circle" size={16} className="text-gray-400" />;
    }
  };

  const isSection = node.children && node.children.length > 0;

  return (
    <Card
      className={`absolute cursor-move transition-shadow ${
        isDragging ? 'shadow-2xl scale-105' : 'shadow-md hover:shadow-lg'
      } ${isSection ? 'border-2 border-primary/50 bg-primary/5' : ''}`}
      style={{
        left: x,
        top: y,
        width: 250,
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(node.status)}
              <h3 className="font-semibold text-sm line-clamp-2">{node.name}</h3>
            </div>
            {node.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {node.description}
              </p>
            )}
          </div>
          {isSection && (
            <Badge variant="secondary" className="shrink-0">
              <Icon name="Folder" size={12} className="mr-1" />
              {node.children.length}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <Progress value={node.progress} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-medium">{node.progress}%</span>
          </div>
        </div>

        {node.dependencies && node.dependencies.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="GitBranch" size={12} />
            <span>{node.dependencies.length} зависимост(ей)</span>
          </div>
        )}

        {(node.resources && node.resources.length > 0) || node.notes ? (
          <div className="flex gap-1 pt-2 border-t">
            {node.resources && node.resources.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Icon name="Link" size={10} className="mr-1" />
                {node.resources.length}
              </Badge>
            )}
            {node.notes && (
              <Badge variant="outline" className="text-xs">
                <Icon name="FileText" size={10} className="mr-1" />
                Заметка
              </Badge>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default CanvasNode;
