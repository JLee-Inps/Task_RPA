import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';
import bcrypt from 'bcryptjs';
import { config } from '../config';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  // 관리자 로그인 (Mock 데이터와 호환)
  fastify.post<{ Body: LoginBody }>('/admin/login', async (request, reply) => {
    const { email, password } = request.body;

    // Mock 관리자 데이터 (개발용)
    const mockAdmins = [
      {
        email: 'admin@toss.com',
        password: 'admin123',
        id: 1,
        name: '시스템 관리자',
        role: 'super_admin',
      },
    ];

    const admin = mockAdmins.find(a => a.email === email && a.password === password);
    
    if (!admin) {
      return reply.code(401).send({ error: '관리자 이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = fastify.jwt.sign({ userId: admin.id, email: admin.email, role: 'admin' });

    return {
      admin: {
        id: admin.id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: [
          { id: '1', name: '사용자 관리', resource: 'users', action: 'all' },
          { id: '2', name: '대시보드 접근', resource: 'dashboard', action: 'read' },
          { id: '3', name: '시스템 설정', resource: 'settings', action: 'all' },
        ],
        department: 'IT팀',
        isActive: true,
      },
      token,
      refreshToken: `admin-refresh-${admin.id}-${Date.now()}`,
      expiresIn: 3600,
    };
  });

  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const { name, email, password } = request.body;

    const pool = db.getPool();
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return reply.code(400).send({ error: '이미 등록된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const insertResult = result as any;
    const userId = insertResult.insertId;

    const token = fastify.jwt.sign({ userId, email });

    return {
      user: { id: userId, name, email },
      token,
    };
  });

  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { email, password } = request.body;

    const pool = db.getPool();
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const userArray = users as any[];
    if (userArray.length === 0) {
      return reply.code(401).send({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = userArray[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return reply.code(401).send({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  });

  // 관리자 정보 조회
  fastify.get('/admin/me', {
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  }, async (request: FastifyRequest) => {
    const { userId, email } = request.user as any;

    // Mock 관리자 데이터
    const mockAdmins = [
      {
        email: 'admin@toss.com',
        id: 1,
        name: '시스템 관리자',
        role: 'super_admin',
      },
    ];

    const admin = mockAdmins.find(a => a.email === email);
    
    if (!admin) {
      return { admin: null };
    }

    return {
      admin: {
        id: admin.id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: [
          { id: '1', name: '사용자 관리', resource: 'users', action: 'all' },
          { id: '2', name: '대시보드 접근', resource: 'dashboard', action: 'read' },
          { id: '3', name: '시스템 설정', resource: 'settings', action: 'all' },
        ],
        department: 'IT팀',
        isActive: true,
      },
    };
  });

  fastify.get('/me', {
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  }, async (request: FastifyRequest) => {
    const { userId } = request.user as any;

    const pool = db.getPool();
    const [users] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    const userArray = users as any[];
    return { user: userArray[0] };
  });
}

