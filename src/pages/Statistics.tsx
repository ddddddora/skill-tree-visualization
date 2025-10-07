import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const Statistics = () => {
  const skillsByCategory = [
    { category: 'Frontend', total: 8, completed: 5, inProgress: 2, notStarted: 1, color: '#8690a2' },
    { category: 'Backend', total: 6, completed: 2, inProgress: 1, notStarted: 3, color: '#ab9b8e' },
    { category: 'Database', total: 4, completed: 1, inProgress: 0, notStarted: 3, color: '#d2c296' },
    { category: 'DevOps', total: 3, completed: 1, inProgress: 0, notStarted: 2, color: '#b4d1d3' }
  ];

  const timeSpent = [
    { skill: 'JavaScript ES6+', hours: 42, difficulty: 'medium', status: 'completed' },
    { skill: 'React', hours: 38, difficulty: 'medium', status: 'in-progress' },
    { skill: 'TypeScript', hours: 28, difficulty: 'medium', status: 'in-progress' },
    { skill: 'Node.js', hours: 24, difficulty: 'medium', status: 'completed' },
    { skill: 'PostgreSQL', hours: 18, difficulty: 'hard', status: 'not-started' }
  ];

  const achievements = [
    { title: 'Первый шаг', description: 'Завершили первый навык', icon: 'Award', unlocked: true },
    { title: 'Марафонец', description: '7 дней подряд активности', icon: 'Flame', unlocked: true },
    { title: 'Эксперт Frontend', description: 'Завершили все навыки Frontend', icon: 'Trophy', unlocked: false },
    { title: 'Полиглот', description: 'Изучили 3+ языка программирования', icon: 'Languages', unlocked: false }
  ];

  const monthlyProgress = [
    { month: 'Янв', skills: 2 },
    { month: 'Фев', skills: 3 },
    { month: 'Мар', skills: 4 },
    { month: 'Апр', skills: 5 },
    { month: 'Май', skills: 3 },
    { month: 'Июн', skills: 6 }
  ];

  const maxSkills = Math.max(...monthlyProgress.map(m => m.skills));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Статистика</h1>
        <p className="text-muted-foreground mt-1">Аналитика вашего прогресса в обучении</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Target" size={18} className="text-primary" />
              Общий прогресс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">45%</span>
                <span className="text-sm text-muted-foreground">завершено</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-sm text-muted-foreground">9 из 20 навыков освоено</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Clock" size={18} className="text-green-700" />
              Время обучения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-green-700">150</span>
                <span className="text-sm text-muted-foreground">часов</span>
              </div>
              <p className="text-sm text-muted-foreground">~25 часов в месяц</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-transparent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Flame" size={18} className="text-orange-700" />
              Серия активности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-orange-700">24</span>
                <span className="text-sm text-muted-foreground">дня</span>
              </div>
              <p className="text-sm text-muted-foreground">Лучший результат: 31 день</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Прогресс по месяцам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 gap-3">
                {monthlyProgress.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative flex-1 flex items-end">
                      <div 
                        className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${(item.skills / maxSkills) * 100}%` }}
                        title={`${item.skills} навыков`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                    <Badge variant="secondary" className="text-xs">{item.skills}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Вы освоили <span className="font-semibold text-foreground">23 навыка</span> за последние 6 месяцев
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="PieChart" size={20} />
              Навыки по категориям
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsByCategory.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-medium">{cat.category}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {cat.completed}/{cat.total}
                    </span>
                  </div>
                  <Progress 
                    value={(cat.completed / cat.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Timer" size={20} />
            Время на изучение навыков
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeSpent.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{item.skill}</span>
                    {item.difficulty === 'easy' && <Badge variant="secondary" className="text-xs">🟢 Легкий</Badge>}
                    {item.difficulty === 'medium' && <Badge variant="secondary" className="text-xs">🟡 Средний</Badge>}
                    {item.difficulty === 'hard' && <Badge variant="secondary" className="text-xs">🔴 Сложный</Badge>}
                  </div>
                  <Progress value={(item.hours / 50) * 100} className="h-1.5" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{item.hours}ч</p>
                  {item.status === 'completed' && (
                    <Icon name="CheckCircle2" size={16} className="text-green-600 mx-auto mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Award" size={20} />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-muted/20 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Icon name={achievement.icon as any} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="mt-2">Получено</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
