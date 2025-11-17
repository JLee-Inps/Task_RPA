import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  MYSQL_HOST: process.env.MYSQL_HOST || (process.env.NODE_ENV === 'production' ? 'localhost' : 'mysql'),
  MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '3306', 10),
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'task_rpa',
  MYSQL_USER: process.env.MYSQL_USER || 'taskuser',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'taskpassword',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

