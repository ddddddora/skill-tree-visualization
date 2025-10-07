import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Skill {
  id: string;
  title: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  dependencies: string[];
  branch: string;
  x?: number;
  y?: number;
}

interface SkillTreeVisualizationProps {
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
}

const SkillTreeVisualization = ({ skills, onSkillClick }: SkillTreeVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1200;
    const height = 800;
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const branches = ['Фронтенд', 'Бэкенд', 'Базы данных', 'DevOps'];
    const branchColors: Record<string, string> = {
      'Фронтенд': '#A53C37',
      'Бэкенд': '#3A3A3A',
      'Базы данных': '#8C8C8C',
      'DevOps': '#C9B8A0'
    };

    const skillsByBranch = branches.map(branch => ({
      branch,
      skills: skills.filter(s => s.branch === branch)
    }));

    const branchWidth = (width - margin.left - margin.right) / branches.length;
    const skillsWithPositions = skills.map((skill, idx) => {
      const branchIndex = branches.indexOf(skill.branch);
      const branchSkills = skills.filter(s => s.branch === skill.branch);
      const skillIndexInBranch = branchSkills.indexOf(skill);
      const verticalSpacing = (height - margin.top - margin.bottom) / (branchSkills.length + 1);

      return {
        ...skill,
        x: margin.left + branchIndex * branchWidth + branchWidth / 2,
        y: margin.top + (skillIndexInBranch + 1) * verticalSpacing
      };
    });

    const defs = svg.append('defs');
    
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const links: Array<{ source: typeof skillsWithPositions[0], target: typeof skillsWithPositions[0] }> = [];
    skillsWithPositions.forEach(skill => {
      skill.dependencies.forEach(depId => {
        const depSkill = skillsWithPositions.find(s => s.id === depId);
        if (depSkill) {
          links.push({ source: depSkill, target: skill });
        }
      });
    });

    const linkGroup = svg.append('g').attr('class', 'links');

    linkGroup.selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', d => {
        const sourceX = d.source.x!;
        const sourceY = d.source.y!;
        const targetX = d.target.x!;
        const targetY = d.target.y!;

        const midY = (sourceY + targetY) / 2;

        return `M ${sourceX} ${sourceY}
                L ${sourceX} ${midY}
                L ${targetX} ${midY}
                L ${targetX} ${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.target.status === 'locked') return '#D1D1D1';
        if (d.target.status === 'completed' && d.source.status === 'completed') return '#A53C37';
        return '#8C8C8C';
      })
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.target.status === 'locked' ? '5,5' : '0')
      .attr('opacity', 0.6);

    branches.forEach((branch, idx) => {
      svg.append('text')
        .attr('x', margin.left + idx * branchWidth + branchWidth / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('fill', branchColors[branch])
        .text(branch);
    });

    const nodeGroup = svg.append('g').attr('class', 'nodes');

    const nodes = nodeGroup.selectAll('g')
      .data(skillsWithPositions)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', d => d.status !== 'locked' ? 'pointer' : 'not-allowed')
      .on('click', (event, d) => {
        if (d.status !== 'locked') {
          onSkillClick(d.id);
        }
      });

    nodes.append('circle')
      .attr('r', d => {
        if (d.status === 'completed') return 35;
        if (d.status === 'in-progress') return 32;
        if (d.status === 'available') return 28;
        return 24;
      })
      .attr('fill', d => {
        if (d.status === 'completed') return branchColors[d.branch];
        if (d.status === 'in-progress') return '#FFFFFF';
        if (d.status === 'available') return '#F5F5F5';
        return '#E8E8E8';
      })
      .attr('stroke', d => {
        if (d.status === 'completed') return branchColors[d.branch];
        if (d.status === 'in-progress') return branchColors[d.branch];
        if (d.status === 'available') return branchColors[d.branch];
        return '#CCCCCC';
      })
      .attr('stroke-width', d => {
        if (d.status === 'in-progress') return 4;
        if (d.status === 'completed') return 3;
        return 2;
      })
      .attr('filter', d => d.status === 'in-progress' ? 'url(#glow)' : 'none')
      .style('transition', 'all 0.3s ease');

    nodes.filter(d => d.status === 'completed')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '20px')
      .attr('fill', '#FFFFFF')
      .text('★');

    nodes.filter(d => d.status === 'locked')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '16px')
      .attr('fill', '#999999')
      .text('🔒');

    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 50)
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('fill', d => d.status === 'locked' ? '#999999' : '#2A2A2A')
      .text(d => d.title.length > 15 ? d.title.substring(0, 15) + '...' : d.title);

    nodes.on('mouseenter', function(event, d) {
      if (d.status === 'locked') return;
      
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', (data: any) => {
          if (data.status === 'completed') return 40;
          if (data.status === 'in-progress') return 37;
          return 33;
        })
        .attr('stroke-width', 4);
    });

    nodes.on('mouseleave', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', (data: any) => {
          if (data.status === 'completed') return 35;
          if (data.status === 'in-progress') return 32;
          if (data.status === 'available') return 28;
          return 24;
        })
        .attr('stroke-width', (data: any) => {
          if (data.status === 'in-progress') return 4;
          if (data.status === 'completed') return 3;
          return 2;
        });
    });

    nodes.selectAll('circle')
      .transition()
      .delay((d, i) => i * 100)
      .duration(600)
      .attrTween('r', function(d: any) {
        const targetR = d.status === 'completed' ? 35 : 
                       d.status === 'in-progress' ? 32 : 
                       d.status === 'available' ? 28 : 24;
        const i = d3.interpolate(0, targetR);
        return (t) => i(t).toString();
      });

  }, [skills, onSkillClick]);

  return (
    <div className="w-full overflow-x-auto bg-background rounded-lg border border-border p-6">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '800px' }} />
    </div>
  );
};

export default SkillTreeVisualization;
