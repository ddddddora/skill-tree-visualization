import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { SkillTree } from '@/pages/Builder';

interface CreateTreeFormProps {
  onBack: () => void;
  onCreate: (tree: SkillTree) => void;
}

const CreateTreeForm = ({ onBack, onCreate }: CreateTreeFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'custom',
  });

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const newTree: SkillTree = {
      id: `tree-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      progress: 0,
      nodes: [],
    };

    onCreate(newTree);
  };

  const categories = [
    { value: 'custom', label: 'Пользовательское' },
    { value: 'programming', label: 'Программирование' },
    { value: 'design', label: 'Дизайн' },
    { value: 'data', label: 'Данные' },
    { value: 'business', label: 'Бизнес' },
    { value: 'languages', label: 'Языки' },
    { value: 'other', label: 'Другое' },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <Icon name="ArrowLeft" size={20} className="mr-2" />
        Назад
      </Button>

      <Card className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Создать дерево с нуля</h1>
          <p className="text-muted-foreground">
            Заполните основную информацию о вашем дереве навыков
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Название дерева <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Например: UX/UI Designer 2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Краткое и понятное название вашей цели
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Например: Изучить современный дизайн с нуля за 6 месяцев"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Опишите, чего вы хотите достичь с помощью этого дерева
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Выберите категорию для удобной организации
            </p>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <div>
              <p className="text-sm font-medium mb-1">Что дальше?</p>
              <p className="text-xs text-muted-foreground">
                После создания вы попадете на холст для построения дерева навыков
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleCreate}
              disabled={!formData.name.trim()}
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Создать дерево
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="Box" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Разделы</h3>
              <p className="text-xs text-muted-foreground">
                Организуйте навыки по категориям
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="GitBranch" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Связи</h3>
              <p className="text-xs text-muted-foreground">
                Создавайте зависимости между навыками
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="Target" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Прогресс</h3>
              <p className="text-xs text-muted-foreground">
                Отслеживайте свои достижения
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateTreeForm;
