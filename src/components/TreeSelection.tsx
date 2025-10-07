import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SkillTree } from '@/pages/Builder';
import { TREE_TEMPLATES } from '@/lib/treeTemplates';
import CreateTreeForm from './CreateTreeForm';

interface TreeSelectionProps {
  onSelect: (tree: SkillTree) => void;
}

const TreeSelection = ({ onSelect }: TreeSelectionProps) => {
  const [view, setView] = useState<'main' | 'templates' | 'import' | 'scratch'>('main');

  const handleTemplateSelect = (template: SkillTree) => {
    onSelect(template);
  };

  if (view === 'templates') {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setView('main')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Выберите шаблон</h1>
          <p className="text-muted-foreground">
            Готовые деревья навыков для быстрого старта
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TREE_TEMPLATES.map((template) => (
            <Card 
              key={template.id} 
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {template.nodes.length} навыков
                  </Badge>
                  <Badge variant="outline">
                    {template.progress}% готово
                  </Badge>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'import') {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setView('main')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="p-8 text-center">
          <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Импорт дерева</h2>
          <p className="text-muted-foreground mb-6">
            Загрузите файл JSON с вашим деревом навыков
          </p>
          <Button>
            <Icon name="FileUp" size={20} className="mr-2" />
            Выбрать файл
          </Button>
        </Card>
      </div>
    );
  }

  if (view === 'scratch') {
    return (
      <CreateTreeForm
        onBack={() => setView('main')}
        onCreate={onSelect}
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Создать новое дерево</h1>
          <p className="text-muted-foreground text-lg">
            Выберите способ создания дерева навыков
          </p>
        </div>

        <div className="grid gap-6">
          <Card 
            className="p-8 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setView('templates')}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="Layers" size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Выбрать из шаблонов</h3>
                <p className="text-muted-foreground">
                  Готовые деревья навыков: Python, Web, Design, Data Science и другие
                </p>
              </div>
              <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary" />
            </div>
          </Card>

          <Card 
            className="p-8 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setView('import')}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="Upload" size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Импортировать из файла</h3>
                <p className="text-muted-foreground">
                  Загрузите JSON файл с вашим сохранённым деревом
                </p>
              </div>
              <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary" />
            </div>
          </Card>

          <Card 
            className="p-8 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setView('scratch')}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name="Pencil" size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Создать с нуля</h3>
                <p className="text-muted-foreground">
                  Постройте собственное дерево навыков с полного нуля
                </p>
              </div>
              <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreeSelection;