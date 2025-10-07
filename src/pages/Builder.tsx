import { useState } from 'react';
import TreeSelection from '@/components/TreeSelection';
import TreeEditor from '@/components/TreeEditor';

export interface SkillNode {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  description?: string;
  resources?: string[];
  notes?: string;
  dependencies?: string[];
  category?: string;
  children?: SkillNode[];
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  progress: number;
  nodes: SkillNode[];
}

const Builder = () => {
  const [selectedTree, setSelectedTree] = useState<SkillTree | null>(null);

  const handleTreeSelect = (tree: SkillTree) => {
    setSelectedTree(tree);
  };

  const handleBack = () => {
    setSelectedTree(null);
  };

  return (
    <div className="h-full">
      {!selectedTree ? (
        <TreeSelection onSelect={handleTreeSelect} />
      ) : (
        <TreeEditor tree={selectedTree} onBack={handleBack} />
      )}
    </div>
  );
};

export default Builder;
