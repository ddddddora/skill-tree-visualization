import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Александр Иванов',
    email: 'alex@example.com',
    bio: 'Люблю изучать новые технологии и развивать навыки',
    avatar: '',
  });

  const stats = [
    { label: 'Деревьев навыков', value: 5, icon: 'TreePine' },
    { label: 'Навыков изучено', value: 42, icon: 'Target' },
    { label: 'Дней подряд', value: 12, icon: 'Flame' },
    { label: 'Достижений', value: 8, icon: 'Award' },
  ];

  const recentActivity = [
    { action: 'Завершен навык', name: 'React Hooks', date: '2 часа назад' },
    { action: 'Создано дерево', name: 'Fullstack разработка', date: '1 день назад' },
    { action: 'Начато изучение', name: 'TypeScript Advanced', date: '2 дня назад' },
  ];

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/20">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Icon name="User" size={48} className="text-primary/40 sm:w-16 sm:h-16" />
                )}
              </div>
              {editing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                >
                  <Icon name="Camera" size={16} />
                </Button>
              )}
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">О себе</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
                    <Button onClick={() => setEditing(true)} variant="outline" className="w-full sm:w-auto">
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2">{profile.email}</p>
                  <p className="text-sm sm:text-base text-foreground">{profile.bio}</p>
                </>
              )}

              {editing && (
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button onClick={handleSave} className="w-full sm:w-auto">
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)} className="w-full sm:w-auto">
                    Отмена
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={stat.icon as any} size={20} className="text-primary sm:w-6 sm:h-6" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Activity" size={20} />
              Недавняя активность
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Zap" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-primary">{activity.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Award" size={20} />
              Достижения
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { icon: 'Rocket', name: 'Первые шаги', desc: 'Создано первое дерево' },
                { icon: 'Target', name: 'Целеустремленный', desc: '10 навыков завершено' },
                { icon: 'Flame', name: 'Горячая полоса', desc: '7 дней подряд' },
                { icon: 'Star', name: 'Мастер', desc: '50% прогресса' },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon name={achievement.icon as any} size={20} className="text-primary sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center">{achievement.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1">
                    {achievement.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;