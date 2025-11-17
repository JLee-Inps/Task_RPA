import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';
import { openaiService } from '../services/openaiService';

interface GitCommitBody {
  message: string;
  commit: {
    hash: string;
    branch: string;
    date: string;
    stats: {
      filesChanged: number;
      insertions: number;
      deletions: number;
    };
  };
  branch?: string;
}

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: '인증이 필요합니다.' });
  }
}

export async function gitRoutes(fastify: FastifyInstance) {
  // 로컬 스크립트에서 호출하는 엔드포인트 (인증 선택적)
  fastify.post<{ Body: GitCommitBody }>('/commit', async (request, reply) => {
    const { message, commit, branch } = request.body;

    if (!message || !commit) {
      return reply.code(400).send({ error: '커밋 메시지와 커밋 정보가 필요합니다.' });
    }

    let userId: number | null = null;

    // JWT 토큰이 있으면 사용자 정보 가져오기
    try {
      await request.jwtVerify();
      const user = request.user as any;
      userId = user.userId;
    } catch (err) {
      // 인증 실패 시 익명으로 처리하거나 기본 사용자 사용
      fastify.log.warn('인증되지 않은 커밋 요청');
    }

    try {
      const summary = await openaiService.summarizeCommit({
        hash: commit.hash,
        message,
        stats: commit.stats,
      });

      const pool = db.getPool();

      // Git 커밋 정보 저장
      if (userId) {
        await pool.execute(
          `INSERT INTO git_commits (user_id, commit_hash, branch, message, summary, files_changed, insertions, deletions, committed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE summary = VALUES(summary)`,
          [
            userId,
            commit.hash,
            commit.branch || branch || 'main',
            message,
            summary,
            commit.stats.filesChanged,
            commit.stats.insertions,
            commit.stats.deletions,
            new Date(commit.date),
          ]
        );

        // 업무 목록에 자동 추가
        const taskTitle = summary || message.substring(0, 100);
        await pool.execute(
          `INSERT INTO tasks (user_id, title, description, git_commit_hash, git_branch, git_summary, status)
           VALUES (?, ?, ?, ?, ?, ?, 'completed')
           ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
          [
            userId,
            taskTitle,
            `Git 커밋: ${message}`,
            commit.hash,
            commit.branch || branch || 'main',
            summary,
          ]
        );
      }

      return {
        success: true,
        summary,
        commit: commit.hash,
      };
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({ error: error.message || '커밋 정보 처리 중 오류가 발생했습니다.' });
    }
  });

  // 기존 트리거 엔드포인트는 제거하거나 유지 (선택사항)
  fastify.get('/commits', {
    preHandler: authenticate,
  }, async (request: FastifyRequest) => {
    const { userId } = request.user as any;
    const { limit = 50, offset = 0 } = request.query as any;

    const pool = db.getPool();
    const [commits] = await pool.execute(
      `SELECT * FROM git_commits 
       WHERE user_id = ? 
       ORDER BY committed_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    return { commits };
  });
}
