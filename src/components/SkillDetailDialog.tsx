import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SkillNode } from '@/pages/Builder';

interface SkillDetailDialogProps {
  node: SkillNode;
  onClose: () => void;
  onUpdate: (updates: Partial<SkillNode>) => void;
}

const SkillDetailDialog = ({ node, onClose, onUpdate }: SkillDetailDialogProps) => {
  const [formData, setFormData] = useState<Partial<SkillNode>>({
    name: node.name,
    description: node.description || '',
    status: node.status,
    progress: node.progress,
    resources: node.resources || [],
    notes: node.notes || '',
  });
  const [newResource, setNewResource] = useState('');

  const handleAddResource = () => {
    if (newResource.trim()) {
      setFormData({
        ...formData,
        resources: [...(formData.resources || []), newResource.trim()],
      });
      setNewResource('');
    }
  };

  const handleRemoveResource = (index: number) => {
    setFormData({
      ...formData,
      resources: formData.resources?.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать навык</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Не начато</SelectItem>
                  <SelectItem value="in-progress">В процессе</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Прогресс (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ресурсы для изучения</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddResource()}
              />
              <Button type="button" onClick={handleAddResource}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            {formData.resources && formData.resources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.resources.map((resource, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    <Icon name="Link" size={12} />
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {resource.length > 40 ? resource.substring(0, 40) + '...' : resource}
                    </a>
                    <button
                      onClick={() => handleRemoveResource(index)}
                      className="hover:text-destructive"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Ваши заметки о прогрессе, планах, дедлайнах..."
            />
          </div>

          {node.dependencies && node.dependencies.length > 0 && (
            <div className="space-y-2">
              <Label>Зависимости</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Icon name="GitBranch" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Этот навык требует завершения: {node.dependencies.join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDetailDialog;
