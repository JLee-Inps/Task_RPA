-- tasks 테이블 전체 스키마
-- 이 파일은 수시로 업데이트될 수 있습니다.
-- 
-- 사용법:
--   mysql -u taskuser -p task_rpa < tasks_table_schema.sql
-- 또는 MySQL 클라이언트에서:
--   source tasks_table_schema.sql

-- tasks 테이블 생성 (기존 테이블이 있으면 삭제 후 재생성)
DROP TABLE IF EXISTS task_schedules;
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  git_commit_hash VARCHAR(255),
  git_branch VARCHAR(255),
  git_summary TEXT,
  start_date DATETIME COMMENT '업무 시작일',
  end_date DATETIME COMMENT '업무 종료일',
  due_date DATETIME COMMENT '마감일',
  progress INT DEFAULT 0 COMMENT '진행률 (0-100)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date),
  INDEX idx_progress (progress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- task_schedules 테이블 생성
CREATE TABLE task_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  scheduled_date DATETIME NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_scheduled_date (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- git_commits 테이블 생성 (기존 테이블이 있으면 삭제 후 재생성)
DROP TABLE IF EXISTS git_commits;

CREATE TABLE git_commits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  commit_hash VARCHAR(255) UNIQUE NOT NULL,
  branch VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  summary TEXT,
  files_changed INT DEFAULT 0,
  insertions INT DEFAULT 0,
  deletions INT DEFAULT 0,
  committed_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_committed_at (committed_at),
  INDEX idx_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

