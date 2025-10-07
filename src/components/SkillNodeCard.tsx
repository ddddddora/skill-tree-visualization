import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SkillNode } from '@/pages/Builder';

interface SkillNodeCardProps {
  node: SkillNode;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const SkillNodeCard = ({ node, onClick, onContextMenu }: SkillNodeCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle2" size={20} className="text-green-500" />;
      case 'in-progress':
        return <Icon name="Clock" size={20} className="text-yellow-500" />;
      default:
        return <Icon name="Circle" size={20} className="text-gray-400" />;
    }
  };

  const isLocked = node.dependencies && node.dependencies.length > 0 && node.status === 'not-started';

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isLocked ? 'opacity-60' : ''
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {getStatusIcon(node.status)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{node.name}</h3>
              {isLocked && (
                <Icon name="Lock" size={16} className="text-muted-foreground" />
              )}
            </div>
            {node.description && (
              <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
            )}
            {node.dependencies && node.dependencies.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Icon name="GitBranch" size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Требует: {node.dependencies.length} навык(ов)
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {node.resources && node.resources.length > 0 && (
            <Badge variant="secondary">
              <Icon name="Link" size={12} className="mr-1" />
              {node.resources.length}
            </Badge>
          )}
          {node.notes && (
            <Badge variant="secondary">
              <Icon name="FileText" size={12} className="mr-1" />
              Заметка
            </Badge>
          )}
          <div className="text-right">
            <Progress value={node.progress} className="w-20 mb-1" />
            <span className="text-xs text-muted-foreground">{node.progress}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SkillNodeCard;
