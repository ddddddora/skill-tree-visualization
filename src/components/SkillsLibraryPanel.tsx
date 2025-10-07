import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { SKILLS_LIBRARY, SKILL_BRANCHES } from '@/lib/skillsLibrary';
import { SkillNode } from '@/pages/Builder';

interface SkillsLibraryPanelProps {
  onAddSkill: (skill: SkillNode) => void;
  onAddBranch: (skills: SkillNode[]) => void;
  onClose: () => void;
}

const SkillsLibraryPanel = ({ onAddSkill, onAddBranch, onClose }: SkillsLibraryPanelProps) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('programming');

  const filteredSkills = SKILLS_LIBRARY.find(cat => cat.id === selectedCategory)?.skills.filter(
    skill => skill.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const filteredBranches = SKILL_BRANCHES.filter(
    branch => branch.name.toLowerCase().includes(search.toLowerCase()) ||
              branch.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, skill: SkillNode) => {
    e.dataTransfer.setData('skill', JSON.stringify(skill));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[800px] h-[600px] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Библиотека навыков</h2>
            <p className="text-sm text-muted-foreground">
              Перетащите навыки на холст или кликните для добавления
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 border-b">
          <Input
            placeholder="Поиск навыков..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="skills" className="flex-1 flex flex-col">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="skills">
              <Icon name="Star" size={16} className="mr-2" />
              Навыки
            </TabsTrigger>
            <TabsTrigger value="branches">
              <Icon name="GitBranch" size={16} className="mr-2" />
              Готовые ветки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="flex-1 flex gap-4 p-6 pt-4">
            <div className="w-48 space-y-1">
              {SKILLS_LIBRARY.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon name={category.icon as any} size={16} className="mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>

            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 gap-3">
                {filteredSkills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="p-4 cursor-move hover:shadow-md transition-all"
                    draggable
                    onDragStart={(e) => handleDragStart(e, skill)}
                    onClick={() => onAddSkill({ ...skill, id: `${skill.id}-${Date.now()}` })}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{skill.name}</h3>
                      <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="branches" className="flex-1 p-6 pt-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {filteredBranches.map((branch) => (
                  <Card key={branch.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{branch.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {branch.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {branch.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onAddBranch(branch.skills.map(s => ({ ...s, id: `${s.id}-${Date.now()}` })))}
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить
                      </Button>
                    </div>
                    <div className="pt-3 border-t text-xs text-muted-foreground">
                      <Icon name="GitBranch" size={12} className="inline mr-1" />
                      {branch.skills.length} навыков с зависимостями
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SkillsLibraryPanel;
