import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SkillTree, SkillNode } from '@/pages/Builder';
import SkillNodeCard from '@/components/SkillNodeCard';
import SkillDetailDialog from '@/components/SkillDetailDialog';
import ContextMenu from '@/components/ContextMenu';

interface TreeEditorProps {
  tree: SkillTree;
  onBack: () => void;
}

const TreeEditor = ({ tree: initialTree, onBack }: TreeEditorProps) => {
  const [tree, setTree] = useState<SkillTree>(initialTree);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: SkillNode;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, node: SkillNode) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node,
    });
  };

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNode(node);
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

    const updatedNodes = updateNode(tree.nodes);
    const newTree = recalculateProgress({ ...tree, nodes: updatedNodes });
    setTree(newTree);
  };

  const recalculateProgress = (currentTree: SkillTree): SkillTree => {
    const calculateNodeProgress = (node: SkillNode): SkillNode => {
      if (node.children && node.children.length > 0) {
        const updatedChildren = node.children.map(calculateNodeProgress);
        const totalProgress = updatedChildren.reduce((sum, child) => sum + child.progress, 0);
        const avgProgress = Math.round(totalProgress / updatedChildren.length);
        
        let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
        if (avgProgress === 100) status = 'completed';
        else if (avgProgress > 0) status = 'in-progress';

        return {
          ...node,
          children: updatedChildren,
          progress: avgProgress,
          status,
        };
      }
      return node;
    };

    const updatedNodes = currentTree.nodes.map(calculateNodeProgress);
    const totalProgress = updatedNodes.reduce((sum, node) => sum + node.progress, 0);
    const avgProgress = Math.round(totalProgress / updatedNodes.length);

    return {
      ...currentTree,
      nodes: updatedNodes,
      progress: avgProgress,
    };
  };

  const handleAddSkill = (parentNode: SkillNode) => {
    console.log('Add skill to:', parentNode.name);
  };

  const handleDeleteNode = (nodeId: string) => {
    const deleteFromNodes = (nodes: SkillNode[]): SkillNode[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) return false;
        if (node.children) {
          node.children = deleteFromNodes(node.children);
        }
        return true;
      });
    };

    const updatedNodes = deleteFromNodes(tree.nodes);
    const newTree = recalculateProgress({ ...tree, nodes: updatedNodes });
    setTree(newTree);
    setContextMenu(null);
  };

  const handleDuplicate = (node: SkillNode) => {
    console.log('Duplicate:', node.name);
    setContextMenu(null);
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      default:
        return 'Не начато';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-card p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{tree.name}</h1>
              <p className="text-sm text-muted-foreground">{tree.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Общий прогресс</div>
              <div className="flex items-center gap-3">
                <Progress value={tree.progress} className="w-32" />
                <span className="font-semibold text-lg">{tree.progress}%</span>
              </div>
            </div>
            <Button>
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {tree.nodes.map((node) => (
            <Card key={node.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{node.name}</h2>
                    <Badge className={getStatusColor(node.status)}>
                      {getStatusLabel(node.status)}
                    </Badge>
                    {node.category && (
                      <Badge variant="outline">{node.category}</Badge>
                    )}
                  </div>
                  {node.description && (
                    <p className="text-sm text-muted-foreground">{node.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Progress value={node.progress} className="w-24 mb-1" />
                    <span className="text-sm font-medium">{node.progress}%</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleContextMenu(e, node)}
                  >
                    <Icon name="MoreVertical" size={20} />
                  </Button>
                </div>
              </div>

              {node.children && node.children.length > 0 && (
                <div className="space-y-3 mt-4 pl-6 border-l-2">
                  {node.children.map((child) => (
                    <SkillNodeCard
                      key={child.id}
                      node={child}
                      onClick={() => handleNodeClick(child)}
                      onContextMenu={(e) => handleContextMenu(e, child)}
                    />
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleAddSkill(node)}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить навык
              </Button>
            </Card>
          ))}
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

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          actions={[
            {
              label: 'Изменить',
              icon: 'Edit',
              onClick: () => {
                setSelectedNode(contextMenu.node);
                setContextMenu(null);
              },
            },
            {
              label: 'Добавить навык',
              icon: 'Plus',
              onClick: () => {
                handleAddSkill(contextMenu.node);
                setContextMenu(null);
              },
            },
            {
              label: 'Дублировать',
              icon: 'Copy',
              onClick: () => handleDuplicate(contextMenu.node),
            },
            {
              label: 'Удалить',
              icon: 'Trash2',
              onClick: () => handleDeleteNode(contextMenu.node.id),
              variant: 'destructive',
            },
          ]}
        />
      )}
    </div>
  );
};

export default TreeEditor;
