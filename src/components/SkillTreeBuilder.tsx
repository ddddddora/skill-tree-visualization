import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SkillNode {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  resources: string[];
  notes: string;
  x: number;
  y: number;
  color: string;
}

interface SkillLink {
  source: string;
  target: string;
}

interface SkillLibraryItem {
  id: string;
  title: string;
  category: string;
  color: string;
}

const LIBRARY_SKILLS: SkillLibraryItem[] = [
  { id: 'html-css', title: 'HTML & CSS', category: 'Frontend', color: '#8690a2' },
  { id: 'javascript', title: 'JavaScript', category: 'Frontend', color: '#8690a2' },
  { id: 'typescript', title: 'TypeScript', category: 'Frontend', color: '#8690a2' },
  { id: 'react', title: 'React', category: 'Frontend', color: '#8690a2' },
  { id: 'vue', title: 'Vue.js', category: 'Frontend', color: '#8690a2' },
  { id: 'nodejs', title: 'Node.js', category: 'Backend', color: '#ab9b8e' },
  { id: 'python', title: 'Python', category: 'Backend', color: '#ab9b8e' },
  { id: 'postgresql', title: 'PostgreSQL', category: 'Database', color: '#d2c296' },
  { id: 'mongodb', title: 'MongoDB', category: 'Database', color: '#d2c296' },
  { id: 'docker', title: 'Docker', category: 'DevOps', color: '#b4d1d3' },
  { id: 'git', title: 'Git', category: 'DevOps', color: '#b4d1d3' }
];

const SkillTreeBuilder = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [links, setLinks] = useState<SkillLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addNodeToCanvas = (librarySkill: SkillLibraryItem, dropX?: number, dropY?: number) => {
    const newNode: SkillNode = {
      id: `${librarySkill.id}-${Date.now()}`,
      title: librarySkill.title,
      description: '',
      status: 'not-started',
      difficulty: 'medium',
      resources: [],
      notes: '',
      x: dropX || 400 + Math.random() * 200,
      y: dropY || 200 + Math.random() * 200,
      color: librarySkill.color
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeClick = (nodeId: string) => {
    if (isLinkMode) {
      if (!linkSource) {
        setLinkSource(nodeId);
      } else if (linkSource !== nodeId) {
        setLinks([...links, { source: linkSource, target: nodeId }]);
        setLinkSource(null);
        setIsLinkMode(false);
      }
    } else {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        setIsEditDialogOpen(true);
      }
    }
  };

  const updateNode = (updatedNode: SkillNode) => {
    setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n));
    setSelectedNode(null);
    setIsEditDialogOpen(false);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setLinks(links.filter(l => l.source !== nodeId && l.target !== nodeId));
    setIsEditDialogOpen(false);
  };

  const deleteLink = (source: string, target: string) => {
    setLinks(links.filter(l => !(l.source === source && l.target === target)));
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 1400;
    const height = 800;

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');
    const glowFilter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const linkGroup = svg.append('g').attr('class', 'links');

    linkGroup.selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target);
        if (!sourceNode || !targetNode) return '';

        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const dr = Math.sqrt(dx * dx + dy * dy);

        return `M ${sourceNode.x} ${sourceNode.y} Q ${(sourceNode.x + targetNode.x) / 2} ${(sourceNode.y + targetNode.y) / 2 - 50} ${targetNode.x} ${targetNode.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#8690a2')
      .attr('stroke-width', 3)
      .attr('opacity', 0.4)
      .attr('marker-end', 'url(#arrowhead)')
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        event.stopPropagation();
        if (confirm('Удалить связь?')) {
          deleteLink(d.source, d.target);
        }
      });

    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 40)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#8690a2')
      .attr('opacity', 0.6);

    const hexagonPath = (size: number) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return `M ${points.join(' L ')} Z`;
    };

    const nodeGroup = svg.append('g').attr('class', 'nodes');

    const drag = d3.drag<SVGGElement, SkillNode>()
      .on('start', function(event, d) {
        d3.select(this).raise();
      })
      .on('drag', function(event, d) {
        d.x = event.x;
        d.y = event.y;
        d3.select(this).attr('transform', `translate(${d.x}, ${d.y})`);
        
        linkGroup.selectAll('path').attr('d', (linkData: any) => {
          const sourceNode = nodes.find(n => n.id === linkData.source);
          const targetNode = nodes.find(n => n.id === linkData.target);
          if (!sourceNode || !targetNode) return '';
          return `M ${sourceNode.x} ${sourceNode.y} Q ${(sourceNode.x + targetNode.x) / 2} ${(sourceNode.y + targetNode.y) / 2 - 50} ${targetNode.x} ${targetNode.y}`;
        });
      })
      .on('end', function(event, d) {
        setNodes(prev => prev.map(n => n.id === d.id ? { ...n, x: d.x, y: d.y } : n));
      });

    const nodeElements = nodeGroup.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'move')
      .call(drag as any);

    nodeElements.append('path')
      .attr('d', hexagonPath(40))
      .attr('fill', d => {
        if (d.status === 'completed') return d.color;
        if (d.status === 'in-progress') return '#FFFFFF';
        return '#F5F5F5';
      })
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.status === 'in-progress' ? 5 : 3)
      .attr('filter', d => d.status === 'in-progress' ? 'url(#node-glow)' : 'none')
      .on('click', (event, d) => {
        event.stopPropagation();
        handleNodeClick(d.id);
      });

    nodeElements.filter(d => d.status === 'completed')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.4em')
      .attr('font-size', '24px')
      .attr('fill', '#FFFFFF')
      .attr('font-weight', 'bold')
      .text('✓');

    nodeElements.filter(d => d.status === 'in-progress')
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 15)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .append('animateTransform')
      .attr('attributeName', 'transform')
      .attr('type', 'rotate')
      .attr('from', '0 0 0')
      .attr('to', '360 0 0')
      .attr('dur', '3s')
      .attr('repeatCount', 'indefinite');

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 60)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#4A4A4A')
      .text(d => d.title.length > 12 ? d.title.substring(0, 12) + '...' : d.title);

    const difficultyIcons: Record<string, string> = {
      'easy': '🟢',
      'medium': '🟡',
      'hard': '🔴'
    };

    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -55)
      .attr('font-size', '16px')
      .text(d => difficultyIcons[d.difficulty]);

  }, [nodes, links, isLinkMode]);

  return (
    <div className="flex h-screen bg-background">
      {isSidebarOpen && (
        <Card className="w-80 rounded-none border-r border-border flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Библиотека навыков</span>
              <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                <Icon name="ChevronLeft" size={20} />
              </Button>
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {['Frontend', 'Backend', 'Database', 'DevOps'].map(category => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">{category}</h3>
                  <div className="space-y-2">
                    {LIBRARY_SKILLS.filter(s => s.category === category).map(skill => (
                      <Button
                        key={skill.id}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => addNodeToCanvas(skill)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: skill.color }}
                          />
                          <span className="flex-1">{skill.title}</span>
                          <Icon name="Plus" size={16} className="text-muted-foreground" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(true)}>
                  <Icon name="PanelLeftOpen" size={18} className="mr-2" />
                  Библиотека
                </Button>
              )}
              <h2 className="text-xl font-bold">Конструктор дерева навыков</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                Узлов: {nodes.length}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Связей: {links.length}
              </Badge>
              <Button
                variant={isLinkMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsLinkMode(!isLinkMode);
                  setLinkSource(null);
                }}
                className={isLinkMode ? 'bg-primary' : ''}
              >
                <Icon name="Link" size={16} className="mr-2" />
                {isLinkMode ? (linkSource ? 'Выберите цель связи' : 'Выберите источник') : 'Создать связь'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-gradient-to-br from-background to-muted/20 relative">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Icon name="MousePointerClick" size={48} className="mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold text-foreground">Начните строить дерево навыков</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Добавьте навыки из библиотеки слева или создайте свои
                  </p>
                </div>
              </div>
            </div>
          )}
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать навык</DialogTitle>
          </DialogHeader>
          {selectedNode && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="node-title">Название</Label>
                <Input
                  id="node-title"
                  value={selectedNode.title}
                  onChange={(e) => setSelectedNode({ ...selectedNode, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="node-desc">Описание</Label>
                <Textarea
                  id="node-desc"
                  value={selectedNode.description}
                  onChange={(e) => setSelectedNode({ ...selectedNode, description: e.target.value })}
                  placeholder="Например: Vue.js - фреймворк для создания интерфейсов"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="node-status">Статус</Label>
                  <Select
                    value={selectedNode.status}
                    onValueChange={(value: any) => setSelectedNode({ ...selectedNode, status: value })}
                  >
                    <SelectTrigger id="node-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Не начато</SelectItem>
                      <SelectItem value="in-progress">В процессе</SelectItem>
                      <SelectItem value="completed">Завершено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="node-difficulty">Сложность</Label>
                  <Select
                    value={selectedNode.difficulty}
                    onValueChange={(value: any) => setSelectedNode({ ...selectedNode, difficulty: value })}
                  >
                    <SelectTrigger id="node-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Легкий</SelectItem>
                      <SelectItem value="medium">🟡 Средний</SelectItem>
                      <SelectItem value="hard">🔴 Сложный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="node-resources">Ресурсы (ссылки через запятую)</Label>
                <Input
                  id="node-resources"
                  value={selectedNode.resources.join(', ')}
                  onChange={(e) => setSelectedNode({ 
                    ...selectedNode, 
                    resources: e.target.value.split(',').map(r => r.trim()).filter(r => r) 
                  })}
                  placeholder="https://vuejs.org, https://stepik.org/course/123"
                />
              </div>
              <div>
                <Label htmlFor="node-notes">Заметки</Label>
                <Textarea
                  id="node-notes"
                  value={selectedNode.notes}
                  onChange={(e) => setSelectedNode({ ...selectedNode, notes: e.target.value })}
                  placeholder="Прошел курс на Stepik, осталось сделать проект..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-primary" onClick={() => updateNode(selectedNode)}>
                  Сохранить изменения
                </Button>
                <Button variant="destructive" onClick={() => deleteNode(selectedNode.id)}>
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillTreeBuilder;
