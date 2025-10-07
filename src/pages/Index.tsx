import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type SkillStatus = 'locked' | 'available' | 'in-progress' | 'completed';
type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface Skill {
  id: string;
  title: string;
  description: string;
  status: SkillStatus;
  difficulty: SkillDifficulty;
  progress: number;
  resources: string[];
  dependencies: string[];
  branch: string;
}

interface Goal {
  id: string;
  name: string;
  description: string;
  branches: string[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'skills' | 'progress' | 'community'>('dashboard');
  const [selectedGoal, setSelectedGoal] = useState<string>('fullstack');
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  const [goals] = useState<Goal[]>([
    {
      id: 'fullstack',
      name: 'Fullstack-разработчик на JavaScript',
      description: 'Путь от основ до профессионального fullstack разработчика',
      branches: ['Фронтенд', 'Бэкенд', 'Базы данных', 'DevOps']
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      title: 'HTML & CSS',
      description: 'Основы веб-разработки: разметка и стилизация',
      status: 'completed',
      difficulty: 'beginner',
      progress: 100,
      resources: ['MDN Web Docs', 'CSS-Tricks'],
      dependencies: [],
      branch: 'Фронтенд'
    },
    {
      id: '2',
      title: 'JavaScript ES6+',
      description: 'Современный JavaScript: синтаксис, функции, асинхронность',
      status: 'in-progress',
      difficulty: 'intermediate',
      progress: 65,
      resources: ['JavaScript.info', 'You Don\'t Know JS'],
      dependencies: ['1'],
      branch: 'Фронтенд'
    },
    {
      id: '3',
      title: 'React',
      description: 'Библиотека для создания пользовательских интерфейсов',
      status: 'available',
      difficulty: 'intermediate',
      progress: 0,
      resources: ['React Docs', 'Epic React'],
      dependencies: ['2'],
      branch: 'Фронтенд'
    },
    {
      id: '4',
      title: 'TypeScript',
      description: 'Типизированный JavaScript для больших проектов',
      status: 'locked',
      difficulty: 'intermediate',
      progress: 0,
      resources: ['TypeScript Handbook'],
      dependencies: ['2'],
      branch: 'Фронтенд'
    },
    {
      id: '5',
      title: 'Node.js',
      description: 'JavaScript на сервере',
      status: 'locked',
      difficulty: 'intermediate',
      progress: 0,
      resources: ['Node.js Docs', 'Node.js Design Patterns'],
      dependencies: ['2'],
      branch: 'Бэкенд'
    },
    {
      id: '6',
      title: 'PostgreSQL',
      description: 'Реляционная база данных',
      status: 'locked',
      difficulty: 'intermediate',
      progress: 0,
      resources: ['PostgreSQL Tutorial'],
      dependencies: [],
      branch: 'Базы данных'
    },
    {
      id: '7',
      title: 'Docker',
      description: 'Контейнеризация приложений',
      status: 'locked',
      difficulty: 'advanced',
      progress: 0,
      resources: ['Docker Docs'],
      dependencies: ['5'],
      branch: 'DevOps'
    }
  ]);

  const getStatusIcon = (status: SkillStatus) => {
    switch (status) {
      case 'completed':
        return <Icon name="Star" className="text-accent" size={20} />;
      case 'in-progress':
        return <Icon name="GitBranch" className="text-secondary" size={20} />;
      case 'available':
        return <Icon name="Unlock" className="text-primary" size={20} />;
      case 'locked':
        return <Icon name="Lock" className="text-muted-foreground" size={20} />;
    }
  };

  const getStatusLabel = (status: SkillStatus) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      case 'available':
        return 'Доступно';
      case 'locked':
        return 'Заблокировано';
    }
  };

  const getDifficultyColor = (difficulty: SkillDifficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-secondary text-secondary-foreground';
      case 'intermediate':
        return 'bg-[hsl(var(--olive))] text-background';
      case 'advanced':
        return 'bg-primary text-primary-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: SkillDifficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
    }
  };

  const updateSkillStatus = (skillId: string, newStatus: SkillStatus, newProgress: number) => {
    setSkills(skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, status: newStatus, progress: newProgress }
        : skill
    ));
  };

  const calculateOverallProgress = () => {
    const totalSkills = skills.length;
    const completedSkills = skills.filter(s => s.status === 'completed').length;
    const inProgressSkills = skills.filter(s => s.status === 'in-progress');
    const inProgressTotal = inProgressSkills.reduce((sum, s) => sum + s.progress, 0);
    
    return Math.round(((completedSkills * 100 + inProgressTotal) / totalSkills));
  };

  const getSkillsByBranch = (branch: string) => {
    return skills.filter(s => s.branch === branch);
  };

  const currentGoal = goals.find(g => g.id === selectedGoal);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TreePine" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Skill Tree</h1>
                <p className="text-sm text-muted-foreground">Твой путь к мастерству</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-2 bg-card border border-border rounded-full px-2 py-1">
              {(['dashboard', 'skills', 'progress', 'community'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'dashboard' && 'Dashboard'}
                  {tab === 'skills' && 'Skills'}
                  {tab === 'progress' && 'Progress'}
                  {tab === 'community' && 'Community'}
                </button>
              ))}
            </nav>

            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Icon name="Share2" size={16} className="mr-2" />
              Поделиться
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Target" size={20} className="text-primary" />
                    Общий прогресс
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold">{calculateOverallProgress()}%</span>
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        Level {Math.floor(calculateOverallProgress() / 10)}
                      </Badge>
                    </div>
                    <Progress value={calculateOverallProgress()} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="CheckCircle2" size={20} className="text-secondary" />
                    Завершено
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-secondary">
                    {skills.filter(s => s.status === 'completed').length}
                    <span className="text-lg text-muted-foreground"> / {skills.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Flame" size={20} className="text-accent" />
                    В процессе
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-accent">
                    {skills.filter(s => s.status === 'in-progress').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Текущая цель</h2>
                <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Новая цель
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать новую цель</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal-name">Название</Label>
                        <Input id="goal-name" placeholder="Например: Backend разработчик на Python" />
                      </div>
                      <div>
                        <Label htmlFor="goal-desc">Описание</Label>
                        <Textarea id="goal-desc" placeholder="Опишите вашу цель..." />
                      </div>
                      <Button className="w-full bg-primary">Создать</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-xl">{currentGoal?.name}</CardTitle>
                  <CardDescription>{currentGoal?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentGoal?.branches.map((branch) => (
                      <Badge key={branch} variant="outline" className="bg-card">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Ветки навыков</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentGoal?.branches.map((branch) => {
                  const branchSkills = getSkillsByBranch(branch);
                  const completedCount = branchSkills.filter(s => s.status === 'completed').length;
                  const branchProgress = (completedCount / branchSkills.length) * 100;

                  return (
                    <Card key={branch} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{branch}</CardTitle>
                          <Badge variant="secondary">
                            {completedCount}/{branchSkills.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={branchProgress} className="mb-3" />
                        <div className="space-y-2">
                          {branchSkills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-2 text-sm">
                              {getStatusIcon(skill.status)}
                              <span className={skill.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                                {skill.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Дерево навыков</h2>
              <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить навык
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать новый навык</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="skill-name">Название</Label>
                      <Input id="skill-name" placeholder="Например: Vue.js" />
                    </div>
                    <div>
                      <Label htmlFor="skill-desc">Описание</Label>
                      <Textarea id="skill-desc" placeholder="Опишите навык..." />
                    </div>
                    <div>
                      <Label htmlFor="skill-branch">Ветка</Label>
                      <Select>
                        <SelectTrigger id="skill-branch">
                          <SelectValue placeholder="Выберите ветку" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentGoal?.branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="skill-difficulty">Сложность</Label>
                      <Select>
                        <SelectTrigger id="skill-difficulty">
                          <SelectValue placeholder="Выберите уровень" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Начальный</SelectItem>
                          <SelectItem value="intermediate">Средний</SelectItem>
                          <SelectItem value="advanced">Продвинутый</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-primary">Создать навык</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card 
                  key={skill.id} 
                  className={`transition-all hover:scale-105 ${
                    skill.status === 'locked' ? 'opacity-50' : ''
                  } ${
                    skill.status === 'in-progress' ? 'ring-2 ring-secondary animate-pulse-glow' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{skill.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(skill.difficulty)}>
                            {getDifficultyLabel(skill.difficulty)}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(skill.status)}
                            {getStatusLabel(skill.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{skill.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {skill.status !== 'locked' && (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-medium">{skill.progress}%</span>
                          </div>
                          <Progress value={skill.progress} className="h-2" />
                        </div>

                        {skill.resources.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Ресурсы:</p>
                            <div className="flex flex-wrap gap-1">
                              {skill.resources.map((resource, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {skill.status === 'available' && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-secondary text-secondary-foreground"
                              onClick={() => updateSkillStatus(skill.id, 'in-progress', 0)}
                            >
                              Начать изучение
                            </Button>
                          )}
                          {skill.status === 'in-progress' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1"
                                onClick={() => updateSkillStatus(skill.id, 'in-progress', Math.min(skill.progress + 25, 100))}
                              >
                                +25%
                              </Button>
                              {skill.progress === 100 && (
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-accent text-accent-foreground animate-unlock"
                                  onClick={() => updateSkillStatus(skill.id, 'completed', 100)}
                                >
                                  Завершить
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}

                    {skill.status === 'locked' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Lock" size={16} />
                        <span>Требуются навыки: {skill.dependencies.map(d => skills.find(s => s.id === d)?.title).join(', ')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Прогресс обучения</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>График развития</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentGoal?.branches.map((branch) => {
                    const branchSkills = getSkillsByBranch(branch);
                    const completedCount = branchSkills.filter(s => s.status === 'completed').length;
                    const branchProgress = (completedCount / branchSkills.length) * 100;

                    return (
                      <div key={branch}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{branch}</span>
                          <span className="text-muted-foreground">{Math.round(branchProgress)}%</span>
                        </div>
                        <Progress value={branchProgress} className="h-3" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Завершенные навыки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skills.filter(s => s.status === 'completed').map((skill) => (
                    <div key={skill.id} className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <Icon name="Star" className="text-accent" size={24} />
                      <div className="flex-1">
                        <p className="font-medium">{skill.title}</p>
                        <p className="text-sm text-muted-foreground">{skill.branch}</p>
                      </div>
                      <Badge className={getDifficultyColor(skill.difficulty)}>
                        {getDifficultyLabel(skill.difficulty)}
                      </Badge>
                    </div>
                  ))}
                  {skills.filter(s => s.status === 'completed').length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Пока нет завершенных навыков. Начните изучение!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Сообщество</h2>
            
            <Card className="border-primary bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Share2" size={24} />
                  Поделись своим прогрессом
                </CardTitle>
                <CardDescription>
                  Покажи друзьям свое дерево навыков и мотивируй их начать обучение
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input value="https://skilltree.app/user/my-profile" readOnly className="flex-1" />
                  <Button className="bg-accent text-accent-foreground">
                    <Icon name="Copy" size={16} className="mr-2" />
                    Копировать
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-xl font-semibold mb-4">Популярные деревья навыков</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Frontend мастер', user: '@alexdev', skills: 24, progress: 87 },
                  { name: 'Python Data Science', user: '@dataScientist', skills: 18, progress: 73 },
                  { name: 'Mobile разработчик', user: '@mobileguru', skills: 21, progress: 65 }
                ].map((tree, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <Icon name="User" className="text-primary-foreground" size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{tree.name}</CardTitle>
                          <CardDescription>{tree.user}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">{tree.skills} навыков</span>
                        <span className="text-sm font-medium">{tree.progress}%</span>
                      </div>
                      <Progress value={tree.progress} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
