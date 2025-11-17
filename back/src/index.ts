import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config';
import { db } from './db';
import { authRoutes } from './routes/auth';
import { taskRoutes } from './routes/tasks';
import { gitRoutes } from './routes/git';
import { chartRoutes } from './routes/charts';

const fastify = Fastify({
  logger: {
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      config.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

async function start() {
  try {
    await fastify.register(cors, {
      origin: config.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });

    await fastify.register(jwt, {
      secret: config.JWT_SECRET,
    });

    await db.initialize();

    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(taskRoutes, { prefix: '/api/tasks' });
    await fastify.register(gitRoutes, { prefix: '/api/git' });
    await fastify.register(chartRoutes, { prefix: '/api/charts' });

    // CSRF 토큰 엔드포인트
    fastify.get('/api/csrf-token', async (request, reply) => {
      const token = fastify.jwt.sign({ csrf: true, timestamp: Date.now() });
      return {
        csrfToken: token,
        expiresIn: 3600,
      };
    });

    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${config.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

