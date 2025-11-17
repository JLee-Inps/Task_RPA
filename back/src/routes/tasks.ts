import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';

interface CreateTaskBody {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress?: number;
  scheduled_date?: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress?: number;
}

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: '인증이 필요합니다.' });
  }
}

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/list', async (request: FastifyRequest) => {
    const { userId } = request.user as any;
    const { status, start_date, end_date } = request.query as any;

    const pool = db.getPool();
    let query = `
      SELECT t.*, 
        (SELECT COUNT(*) FROM task_schedules ts WHERE ts.task_id = t.id) as schedule_count
      FROM tasks t
      WHERE t.user_id = ?
    `;
    const params: any[] = [userId];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (start_date) {
      query += ' AND t.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND t.created_at <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY t.created_at DESC';

    const [tasks] = await pool.execute(query, params);
    return { tasks };
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { userId } = request.user as any;
    const { id } = request.params;

    const pool = db.getPool();
    const [tasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const taskArray = tasks as any[];
    if (taskArray.length === 0) {
      return reply.code(404).send({ error: '작업을 찾을 수 없습니다.' });
    }

    const [schedules] = await pool.execute(
      'SELECT * FROM task_schedules WHERE task_id = ? ORDER BY scheduled_date',
      [id]
    );

    return {
      task: taskArray[0],
      schedules,
    };
  });

  fastify.post<{ Body: CreateTaskBody }>('/create', async (request) => {
    const { userId } = request.user as any;
    const { title, description, priority = 'medium', start_date, end_date, due_date, progress = 0, scheduled_date } = request.body;

    const pool = db.getPool();
    const [result] = await pool.execute(
      'INSERT INTO tasks (user_id, title, description, priority, start_date, end_date, due_date, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description || null, priority, start_date || null, end_date || null, due_date || null, progress]
    );

    const insertResult = result as any;
    const taskId = insertResult.insertId;

    if (scheduled_date) {
      await pool.execute(
        'INSERT INTO task_schedules (task_id, scheduled_date) VALUES (?, ?)',
        [taskId, scheduled_date]
      );
    }

    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);
    return { task: (tasks as any[])[0] };
  });

  fastify.put<{ Params: { id: string }; Body: UpdateTaskBody }>('/:id', async (request, reply) => {
    const { userId } = request.user as any;
    const { id } = request.params;
    const updates = request.body;

    const pool = db.getPool();
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return reply.code(400).send({ error: '수정할 필드가 없습니다.' });
    }

    values.push(id, userId);

    await pool.execute(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return { task: (tasks as any[])[0] };
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { userId } = request.user as any;
    const { id } = request.params;

    const pool = db.getPool();
    const [result] = await pool.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return reply.code(404).send({ error: '작업을 찾을 수 없습니다.' });
    }

    return { success: true };
  });
}

