import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { SkillTree } from './Builder';
import { TREE_TEMPLATES } from '@/lib/treeTemplates';

const MyTrees = () => {
  const navigate = useNavigate();
  const [trees, setTrees] = useState<SkillTree[]>(TREE_TEMPLATES);

  const handleCreateNew = () => {
    navigate('/builder');
  };

  const handleOpenTree = (treeId: string) => {
    navigate(`/builder/${treeId}`);
  };

  const handleDeleteTree = (treeId: string) => {
    setTrees(trees.filter(t => t.id !== treeId));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Мои деревья</h1>
          <p className="text-muted-foreground text-lg">
            Управляйте вашими деревьями навыков
          </p>
        </div>
        <Button size="lg" onClick={handleCreateNew}>
          <Icon name="Plus" size={20} className="mr-2" />
          Создать новое дерево
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trees.map((tree) => (
          <Card
            key={tree.id}
            className="p-6 hover:shadow-lg transition-all group cursor-pointer"
            onClick={() => handleOpenTree(tree.id)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                    {tree.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tree.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTree(tree.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс</span>
                  <span className="font-semibold">{tree.progress}%</span>
                </div>
                <Progress value={tree.progress} />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  <Icon name="Boxes" size={12} className="mr-1" />
                  {tree.nodes.length} разделов
                </Badge>
                <Badge variant="outline">
                  {tree.nodes.reduce((sum, node) => sum + (node.children?.length || 0), 0)} навыков
                </Badge>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  {formatDate(new Date())}
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={12} />
                  Обновлено сегодня
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Card
          className="p-6 border-dashed border-2 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-all group"
          onClick={handleCreateNew}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Icon name="Plus" size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Создать новое дерево</h3>
              <p className="text-sm text-muted-foreground">
                Начните с нуля или выберите шаблон
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyTrees;
