import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { SkillTree, SkillNode } from '@/pages/Builder';
import CanvasNode from './CanvasNode';
import CanvasToolbar from './CanvasToolbar';
import SkillDetailDialog from './SkillDetailDialog';
import SkillsLibraryPanel from './SkillsLibraryPanel';

interface CanvasEditorProps {
  tree: SkillTree;
  onBack: () => void;
}

interface CanvasNodePosition {
  id: string;
  x: number;
  y: number;
  node: SkillNode;
}

const CanvasEditor = ({ tree: initialTree, onBack }: CanvasEditorProps) => {
  const [tree, setTree] = useState<SkillTree>(initialTree);
  const [nodes, setNodes] = useState<CanvasNodePosition[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLibrary, setShowLibrary] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tree.nodes.length === 0) {
      return;
    }

    const positioned: CanvasNodePosition[] = [];
    let yOffset = 100;

    tree.nodes.forEach((node, index) => {
      positioned.push({
        id: node.id,
        x: 400,
        y: yOffset,
        node,
      });

      if (node.children) {
        node.children.forEach((child, childIndex) => {
          positioned.push({
            id: child.id,
            x: 700 + childIndex * 250,
            y: yOffset + childIndex * 150,
            node: child,
          });
        });
      }

      yOffset += (node.children?.length || 1) * 150 + 100;
    });

    setNodes(positioned);
  }, [tree.nodes]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const nodePos = nodes.find(n => n.id === nodeId);
    if (!nodePos) return;

    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - nodePos.x,
      y: e.clientY - nodePos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode) return;

    setNodes(nodes.map(node => {
      if (node.id === draggingNode) {
        return {
          ...node,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleAddSection = () => {
    const newSection: SkillNode = {
      id: `section-${Date.now()}`,
      name: 'Новый раздел',
      status: 'not-started',
      progress: 0,
      children: [],
    };

    setTree({
      ...tree,
      nodes: [...tree.nodes, newSection],
    });
  };

  const handleAddSkill = (parentId?: string) => {
    const newSkill: SkillNode = {
      id: `skill-${Date.now()}`,
      name: 'Новый навык',
      status: 'not-started',
      progress: 0,
    };

    if (parentId) {
      const updateNodes = (nodes: SkillNode[]): SkillNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newSkill],
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateNodes(node.children),
            };
          }
          return node;
        });
      };

      setTree({
        ...tree,
        nodes: updateNodes(tree.nodes),
      });
    } else {
      setTree({
        ...tree,
        nodes: [...tree.nodes, newSkill],
      });
    }
  };

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.5));
  };

  const handleResetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const updateNodeInTree = (nodeId: string, updates: Partial<SkillNode>) => {
    const updateNode = (nodes: SkillNode[]): SkillNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    setTree({
      ...tree,
      nodes: updateNode(tree.nodes),
    });
  };

  const handleAddSkillFromLibrary = (skill: SkillNode) => {
    setTree({
      ...tree,
      nodes: [...tree.nodes, skill],
    });
  };

  const handleAddBranchFromLibrary = (skills: SkillNode[]) => {
    setTree({
      ...tree,
      nodes: [...tree.nodes, ...skills],
    });
  };

  const handleAutoArrange = () => {
    const arranged: CanvasNodePosition[] = [];
    const levelWidth = 300;
    const levelHeight = 200;
    
    const arranged Map = new Map<string, { level: number; index: number }>();
    const getLevel = (node: SkillNode, currentLevel: number = 0): number => {
      if (!node.dependencies || node.dependencies.length === 0) {
        return currentLevel;
      }
      const depLevels = node.dependencies
        .map(depId => {
          const depInfo = arrangedMap.get(depId);
          return depInfo ? depInfo.level + 1 : currentLevel;
        });
      return Math.max(...depLevels, currentLevel);
    };

    const levels: SkillNode[][] = [];
    tree.nodes.forEach(node => {
      const level = getLevel(node);
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
      arrangedMap.set(node.id, { level, index: levels[level].length - 1 });
    });

    levels.forEach((levelNodes, levelIndex) => {
      levelNodes.forEach((node, nodeIndex) => {
        arranged.push({
          id: node.id,
          x: 100 + levelIndex * levelWidth,
          y: 100 + nodeIndex * levelHeight,
          node,
        });
      });
    });

    setNodes(arranged);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const skillData = e.dataTransfer.getData('skill');
    if (skillData) {
      const skill = JSON.parse(skillData);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newSkill = {
          ...skill,
          id: `${skill.id}-${Date.now()}`,
        };
        setTree({
          ...tree,
          nodes: [...tree.nodes, newSkill],
        });
      }
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const drawConnections = () => {
    const connections: JSX.Element[] = [];

    nodes.forEach(nodePos => {
      if (nodePos.node.dependencies) {
        nodePos.node.dependencies.forEach(depId => {
          const depPos = nodes.find(n => n.id === depId);
          if (depPos) {
            connections.push(
              <line
                key={`${depPos.id}-${nodePos.id}`}
                x1={depPos.x + 125}
                y1={depPos.y + 50}
                x2={nodePos.x}
                y2={nodePos.y + 50}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
              />
            );
          }
        });
      }
    });

    return connections;
  };

  if (nodes.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
            <h1 className="text-xl font-bold">{tree.name}</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Icon name="Sparkles" size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Пустой холст</h2>
            <p className="text-muted-foreground mb-6">
              Начните создавать свое дерево навыков, добавив первый раздел или навык
            </p>
            <div className="space-y-3">
              <Button className="w-full" onClick={handleAddSection}>
                <Icon name="Box" size={18} className="mr-2" />
                Добавить раздел
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleAddSkill()}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить навык
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowLibrary(true)}>
                <Icon name="Library" size={18} className="mr-2" />
                Библиотека навыков
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <CanvasToolbar
        onAddSection={handleAddSection}
        onAddSkill={() => handleAddSkill()}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        scale={scale}
      />

      <div className="flex-1 flex flex-col">
        <div className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-xl font-bold">{tree.name}</h1>
              <p className="text-xs text-muted-foreground">{tree.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Экспорт
            </Button>
            <Button size="sm">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-grid-pattern"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
            }}
          >
            {drawConnections()}
          </svg>

          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: '0 0',
            }}
          >
            {nodes.map((nodePos) => (
              <CanvasNode
                key={nodePos.id}
                node={nodePos.node}
                x={nodePos.x}
                y={nodePos.y}
                isDragging={draggingNode === nodePos.id}
                onMouseDown={(e) => handleMouseDown(e, nodePos.id)}
                onClick={() => handleNodeClick(nodePos.node)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedNode && (
        <SkillDetailDialog
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={(updates) => {
            updateNodeInTree(selectedNode.id, updates);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
};

export default CanvasEditor;