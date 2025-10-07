import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const goals = [
    {
      id: '1',
      name: 'Fullstack-разработчик на JavaScript',
      description: 'Путь от основ до профессионального fullstack разработчика',
      progress: 45,
      totalSkills: 12,
      completedSkills: 5,
      inProgressSkills: 2,
      color: '#8690a2',
      lastUpdated: '2 часа назад'
    },
    {
      id: '2',
      name: 'Python Data Science',
      description: 'От основ Python до машинного обучения',
      progress: 28,
      totalSkills: 15,
      completedSkills: 4,
      inProgressSkills: 1,
      color: '#ab9b8e',
      lastUpdated: '1 день назад'
    }
  ];

  const recentActivity = [
    { skill: 'React Hooks', action: 'Завершено', time: '2 часа назад', icon: 'CheckCircle2', color: 'text-green-600' },
    { skill: 'TypeScript', action: 'В процессе', time: '5 часов назад', icon: 'Clock', color: 'text-blue-600' },
    { skill: 'Node.js Express', action: 'Начато', time: '1 день назад', icon: 'Play', color: 'text-yellow-600' }
  ];

  const stats = [
    { label: 'Всего навыков', value: '27', icon: 'Target', color: 'bg-primary/10 text-primary' },
    { label: 'Завершено', value: '9', icon: 'CheckCircle2', color: 'bg-green-100 text-green-700' },
    { label: 'В процессе', value: '3', icon: 'Loader', color: 'bg-blue-100 text-blue-700' },
    { label: 'Активных дней', value: '24', icon: 'Flame', color: 'bg-orange-100 text-orange-700' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Обзор вашего прогресса в обучении</p>
        </div>
        <Button className="bg-primary" onClick={() => navigate('/builder')}>
          <Icon name="Plus" size={18} className="mr-2" />
          Новая цель
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <Icon name={stat.icon as any} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Ваши цели</h2>
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(`/builder?goal=${goal.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <CardDescription className="mt-1">{goal.description}</CardDescription>
                  </div>
                  <Badge variant="outline" style={{ borderColor: goal.color, color: goal.color }}>
                    {goal.progress}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={goal.progress} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Icon name="CheckCircle2" size={16} className="text-green-600" />
                      <span>{goal.completedSkills} завершено</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={16} className="text-blue-600" />
                      <span>{goal.inProgressSkills} в процессе</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">{goal.lastUpdated}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/builder?goal=${goal.id}`);
                  }}>
                    <Icon name="Edit" size={14} className="mr-2" />
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                    e.stopPropagation();
                    navigate('/statistics');
                  }}>
                    <Icon name="BarChart3" size={14} className="mr-2" />
                    Статистика
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full" onClick={() => navigate('/builder')}>
            <Icon name="Plus" size={16} className="mr-2" />
            Создать новую цель
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Недавняя активность</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity.color}`}>
                      <Icon name={activity.icon as any} size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.skill}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="TrendingUp" size={20} />
                Совет дня
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Вы отлично справляетесь! За последние 7 дней вы завершили 3 навыка. 
                Попробуйте начать изучение TypeScript — он отлично дополнит ваши знания JavaScript.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Calendar" size={20} />
                Календарь активности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-sm ${
                      idx % 3 === 0 
                        ? 'bg-primary/80' 
                        : idx % 5 === 0 
                        ? 'bg-primary/40' 
                        : 'bg-muted'
                    }`}
                    title={`День ${idx + 1}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                24 активных дня за последний месяц
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
