import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: '인증이 필요합니다.' });
  }
}

export async function chartRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/stats', async (request: FastifyRequest) => {
    const { userId } = request.user as any;
    const { start_date, end_date } = request.query as any;

    const pool = db.getPool();
    let dateFilter = '';
    const params: any[] = [userId];

    if (start_date && end_date) {
      dateFilter = 'AND created_at BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    const [taskStats] = await pool.execute(
      `SELECT 
        status,
        COUNT(*) as count
       FROM tasks
       WHERE user_id = ? ${dateFilter}
       GROUP BY status`,
      params
    );

    const [priorityStats] = await pool.execute(
      `SELECT 
        priority,
        COUNT(*) as count
       FROM tasks
       WHERE user_id = ? ${dateFilter}
       GROUP BY priority`,
      params
    );

    const [dailyStats] = await pool.execute(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
       FROM tasks
       WHERE user_id = ? ${dateFilter}
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT 30`,
      params
    );

    const [gitStats] = await pool.execute(
      `SELECT 
        DATE(committed_at) as date,
        COUNT(*) as commit_count,
        SUM(files_changed) as total_files_changed,
        SUM(insertions) as total_insertions,
        SUM(deletions) as total_deletions
       FROM git_commits
       WHERE user_id = ? ${dateFilter.replace('created_at', 'committed_at')}
       GROUP BY DATE(committed_at)
       ORDER BY date DESC
       LIMIT 30`,
      params
    );

    return {
      taskStats,
      priorityStats,
      dailyStats,
      gitStats,
    };
  });

  fastify.get('/progress', async (request: FastifyRequest) => {
    const { userId } = request.user as any;
    const { days = 7 } = request.query as any;

    const pool = db.getPool();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const [progress] = await pool.execute(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
       FROM tasks
       WHERE user_id = ? AND created_at >= ?
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [userId, startDate]
    );

    return { progress };
  });
}

