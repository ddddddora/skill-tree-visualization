-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица деревьев навыков
CREATE TABLE skill_trees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT false,
    template_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска деревьев пользователя
CREATE INDEX idx_skill_trees_user_id ON skill_trees(user_id);
CREATE INDEX idx_skill_trees_category ON skill_trees(category);

-- Таблица навыков (узлов дерева)
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER NOT NULL REFERENCES skill_trees(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level INTEGER DEFAULT 1,
    required_points INTEGER DEFAULT 0,
    position_x DECIMAL(10, 2),
    position_y DECIMAL(10, 2),
    icon VARCHAR(100),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для поиска навыков в дереве
CREATE INDEX idx_skills_tree_id ON skills(tree_id);

-- Таблица зависимостей между навыками
CREATE TABLE skill_dependencies (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    required_skill_id INTEGER NOT NULL REFERENCES skills(id),
    UNIQUE(skill_id, required_skill_id)
);

-- Индексы для быстрого поиска зависимостей
CREATE INDEX idx_skill_deps_skill_id ON skill_dependencies(skill_id);
CREATE INDEX idx_skill_deps_required_id ON skill_dependencies(required_skill_id);

-- Таблица прогресса пользователей
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    status VARCHAR(50) DEFAULT 'locked',
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- Индексы для прогресса
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_skill_id ON user_progress(skill_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- Таблица достижений
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    tree_id INTEGER NOT NULL REFERENCES skill_trees(id),
    achievement_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для достижений пользователя
CREATE INDEX idx_achievements_user_id ON achievements(user_id);

-- Таблица статистики по дням
CREATE TABLE daily_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    tree_id INTEGER REFERENCES skill_trees(id),
    date DATE NOT NULL,
    skills_unlocked INTEGER DEFAULT 0,
    skills_completed INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    UNIQUE(user_id, tree_id, date)
);

-- Индексы для статистики
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, date);
CREATE INDEX idx_daily_stats_tree_id ON daily_stats(tree_id);

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Профили пользователей SkillTree';
COMMENT ON TABLE skill_trees IS 'Деревья навыков пользователей';
COMMENT ON TABLE skills IS 'Узлы (навыки) в деревьях';
COMMENT ON TABLE skill_dependencies IS 'Связи между навыками (какой навык требует другой)';
COMMENT ON TABLE user_progress IS 'Прогресс пользователей по навыкам';
COMMENT ON TABLE achievements IS 'Достижения пользователей';
COMMENT ON TABLE daily_stats IS 'Ежедневная статистика активности';
