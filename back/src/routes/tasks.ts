import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';

// MySQL DATETIME 형식으로 변환 (YYYY-MM-DD HH:mm:ss)
const formatDateForMySQL = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

interface CreateTaskBody {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress?: number;
  scheduled_date?: string;
  parent_task_id?: number | null;
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
    const { status, start_date, end_date, parent_only } = request.query as any;

    const pool = db.getPool();
    let query = `
      SELECT t.*, 
        (SELECT COUNT(*) FROM task_schedules ts WHERE ts.task_id = t.id) as schedule_count,
        (SELECT COUNT(*) FROM tasks ct WHERE ct.parent_task_id = t.id) as children_count
      FROM tasks t
      WHERE t.user_id = ?
    `;
    const params: any[] = [userId];

    // parent_only가 true이면 최상위 업무만 조회
    if (parent_only === 'true' || parent_only === true) {
      query += ' AND t.parent_task_id IS NULL';
    }

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
    const { title, description, priority = 'medium', start_date, end_date, due_date, progress = 0, scheduled_date, parent_task_id } = request.body;

    const formattedStartDate = formatDateForMySQL(start_date);
    const formattedEndDate = formatDateForMySQL(end_date);
    const formattedDueDate = formatDateForMySQL(due_date);

    const pool = db.getPool();
    const [result] = await pool.execute(
      'INSERT INTO tasks (user_id, title, description, priority, start_date, end_date, due_date, progress, parent_task_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description || null, priority, formattedStartDate, formattedEndDate, formattedDueDate, progress, parent_task_id || null]
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

    // 데이터베이스에 실제로 존재하는 컬럼만 허용
    const allowedFields = [
      'title', 'description', 'status', 'priority',
      'start_date', 'end_date', 'due_date', 'progress',
      'git_commit_hash', 'git_branch', 'git_summary',
      'parent_task_id'
    ];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        if (['start_date', 'end_date', 'due_date'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(formatDateForMySQL(value as string));
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
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

  // 하위 업무 조회
  fastify.get<{ Params: { id: string } }>('/:id/children', async (request, reply) => {
    const { userId } = request.user as any;
    const { id } = request.params;

    const pool = db.getPool();

    // 먼저 부모 업무가 존재하고 현재 사용자의 것인지 확인
    const [tasks] = await pool.execute(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const taskArray = tasks as any[];
    if (taskArray.length === 0) {
      return reply.code(404).send({ error: '작업을 찾을 수 없습니다.' });
    }

    // 하위 업무 조회
    const [children] = await pool.execute(
      'SELECT * FROM tasks WHERE parent_task_id = ? AND user_id = ? ORDER BY created_at DESC',
      [id, userId]
    );

    return { tasks: children };
  });
}
