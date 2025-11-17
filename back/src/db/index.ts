import mysql from 'mysql2/promise';
import { config } from '../config';

let pool: mysql.Pool | null = null;

export const db = {
  async initialize() {
    pool = mysql.createPool({
      host: config.MYSQL_HOST,
      port: config.MYSQL_PORT,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await this.createTables();
  },

  async createTables() {
    if (!pool) throw new Error('Database not initialized');

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        git_commit_hash VARCHAR(255),
        git_branch VARCHAR(255),
        git_summary TEXT,
        start_date DATETIME,
        end_date DATETIME,
        due_date DATETIME,
        progress INT DEFAULT 0 COMMENT '진행률 (0-100)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_start_date (start_date),
        INDEX idx_end_date (end_date)
      )
    `);

    // 기존 테이블에 컬럼 추가 (컬럼이 없을 경우에만 추가)
    try {
      const [columns] = await pool.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'tasks' 
        AND COLUMN_NAME IN ('start_date', 'end_date', 'progress')
      `);
      
      const existingColumns = (columns as any[]).map((col: any) => col.COLUMN_NAME);
      
      if (!existingColumns.includes('start_date')) {
        await pool.execute(`ALTER TABLE tasks ADD COLUMN start_date DATETIME AFTER git_summary`);
      }
      if (!existingColumns.includes('end_date')) {
        await pool.execute(`ALTER TABLE tasks ADD COLUMN end_date DATETIME AFTER start_date`);
      }
      if (!existingColumns.includes('progress')) {
        await pool.execute(`ALTER TABLE tasks ADD COLUMN progress INT DEFAULT 0 COMMENT '진행률 (0-100)' AFTER end_date`);
      }
    } catch (error: any) {
      console.warn('테이블 스키마 업데이트 중 오류 (무시 가능):', error.message);
    }

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS task_schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        scheduled_date DATETIME NOT NULL,
        reminder_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        INDEX idx_task_id (task_id),
        INDEX idx_scheduled_date (scheduled_date)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS git_commits (
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
        INDEX idx_committed_at (committed_at)
      )
    `);
  },

  getPool() {
    if (!pool) throw new Error('Database not initialized');
    return pool;
  },

  async close() {
    if (pool) {
      await pool.end();
      pool = null;
    }
  },
};

