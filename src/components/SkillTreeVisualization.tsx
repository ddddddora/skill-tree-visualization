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
    const margin = { top: 80, right: 60, bottom: 60, left: 60 };

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const branches = ['Фронтенд', 'Бэкенд', 'Базы данных', 'DevOps'];
    const branchColors: Record<string, string> = {
      'Фронтенд': '#8690a2',
      'Бэкенд': '#ab9b8e',
      'Базы данных': '#d2c296',
      'DevOps': '#b4d1d3'
    };

    const branchWidth = (width - margin.left - margin.right) / branches.length;
    const skillsWithPositions = skills.map((skill) => {
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
      .attr('stdDeviation', '5')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    branches.forEach((branch, idx) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${idx}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', branchColors[branch])
        .attr('stop-opacity', 0.15);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', branchColors[branch])
        .attr('stop-opacity', 0.05);
    });

    branches.forEach((branch, idx) => {
      svg.append('rect')
        .attr('x', margin.left + idx * branchWidth + branchWidth * 0.15)
        .attr('y', margin.top - 20)
        .attr('width', branchWidth * 0.7)
        .attr('height', height - margin.top - margin.bottom + 20)
        .attr('fill', `url(#gradient-${idx})`)
        .attr('rx', 12);

      svg.append('text')
        .attr('x', margin.left + idx * branchWidth + branchWidth / 2)
        .attr('y', 35)
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('font-weight', '700')
        .attr('fill', branchColors[branch])
        .attr('letter-spacing', '0.5px')
        .text(branch);
    });

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
        const sourceY = d.source.y! + 50;
        const targetX = d.target.x!;
        const targetY = d.target.y! - 50;

        const midY = (sourceY + targetY) / 2;

        return `M ${sourceX} ${sourceY}
                C ${sourceX} ${midY},
                  ${targetX} ${midY},
                  ${targetX} ${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.target.status === 'locked') return '#CCCCCC';
        if (d.target.status === 'completed' && d.source.status === 'completed') {
          return branchColors[d.target.branch];
        }
        return branchColors[d.target.branch];
      })
      .attr('stroke-width', d => d.target.status === 'locked' ? 1.5 : 2.5)
      .attr('stroke-dasharray', d => d.target.status === 'locked' ? '8,4' : '0')
      .attr('opacity', d => d.target.status === 'locked' ? 0.3 : 0.5);

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

    nodes.append('path')
      .attr('d', d => {
        if (d.status === 'completed') return hexagonPath(42);
        if (d.status === 'in-progress') return hexagonPath(38);
        if (d.status === 'available') return hexagonPath(34);
        return hexagonPath(30);
      })
      .attr('fill', d => {
        if (d.status === 'completed') return branchColors[d.branch];
        if (d.status === 'in-progress') return '#FFFFFF';
        if (d.status === 'available') return '#F8F8F8';
        return '#EEEEEE';
      })
      .attr('stroke', d => {
        if (d.status === 'locked') return '#CCCCCC';
        return branchColors[d.branch];
      })
      .attr('stroke-width', d => {
        if (d.status === 'in-progress') return 5;
        if (d.status === 'completed') return 3;
        return 2.5;
      })
      .attr('filter', d => d.status === 'in-progress' ? 'url(#glow)' : 'none')
      .attr('opacity', d => d.status === 'locked' ? 0.4 : 1)
      .style('transition', 'all 0.3s ease');

    nodes.filter(d => d.status === 'completed')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.4em')
      .attr('font-size', '26px')
      .attr('fill', '#FFFFFF')
      .attr('font-weight', 'bold')
      .text('✦');

    nodes.filter(d => d.status === 'locked')
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 12)
      .attr('fill', '#DDDDDD')
      .attr('stroke', '#CCCCCC')
      .attr('stroke-width', 1.5);

    nodes.filter(d => d.status === 'locked')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '14px')
      .attr('fill', '#999999')
      .text('🔒');

    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 60)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', d => d.status === 'locked' ? '#AAAAAA' : '#4A4A4A')
      .text(d => d.title.length > 16 ? d.title.substring(0, 16) + '...' : d.title);

    nodes.on('mouseenter', function(event, d) {
      if (d.status === 'locked') return;
      
      d3.select(this).select('path')
        .transition()
        .duration(250)
        .attr('d', () => {
          if (d.status === 'completed') return hexagonPath(48);
          if (d.status === 'in-progress') return hexagonPath(44);
          return hexagonPath(40);
        })
        .attr('stroke-width', 5);
    });

    nodes.on('mouseleave', function(event, d) {
      d3.select(this).select('path')
        .transition()
        .duration(250)
        .attr('d', () => {
          if (d.status === 'completed') return hexagonPath(42);
          if (d.status === 'in-progress') return hexagonPath(38);
          if (d.status === 'available') return hexagonPath(34);
          return hexagonPath(30);
        })
        .attr('stroke-width', () => {
          if (d.status === 'in-progress') return 5;
          if (d.status === 'completed') return 3;
          return 2.5;
        });
    });

    nodes.selectAll('path')
      .transition()
      .delay((d, i) => i * 80)
      .duration(500)
      .attrTween('d', function(d: any) {
        const targetSize = d.status === 'completed' ? 42 : 
                         d.status === 'in-progress' ? 38 : 
                         d.status === 'available' ? 34 : 30;
        const i = d3.interpolate(0, targetSize);
        return (t) => hexagonPath(i(t));
      });

  }, [skills, onSkillClick]);

  return (
    <div className="w-full overflow-x-auto bg-card rounded-xl border-2 border-border p-6 shadow-sm">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '800px' }} />
    </div>
  );
};

export default SkillTreeVisualization;
