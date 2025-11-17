import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';

interface CommitResult {
  hash: string;
  branch: string;
  date: string;
  stats: {
    filesChanged: number;
    insertions: number;
    deletions: number;
  };
}

class GitService {
  private git: SimpleGit;

  constructor() {
    const repoPath = process.env.GIT_REPO_PATH || process.cwd();
    this.git = simpleGit(repoPath);
  }

  async commit(message: string, branch?: string): Promise<CommitResult> {
    try {
      if (branch) {
        const branches = await this.git.branchLocal();
        if (branches.all.includes(branch)) {
          await this.git.checkout(branch);
        } else {
          await this.git.checkoutLocalBranch(branch);
        }
      }

      await this.git.add('.');
      const commitResult = await this.git.commit(message);

      const status = await this.git.status();
      const diffSummary = await this.git.diffSummary(['HEAD~1', 'HEAD']);

      return {
        hash: commitResult.commit || '',
        branch: status.current || '',
        date: new Date().toISOString(),
        stats: {
          filesChanged: diffSummary.files.length,
          insertions: diffSummary.insertions,
          deletions: diffSummary.deletions,
        },
      };
    } catch (error: any) {
      throw new Error(`Git commit 실패: ${error.message}`);
    }
  }

  async push(branch?: string): Promise<void> {
    try {
      if (branch) {
        await this.git.push('origin', branch);
      } else {
        const status = await this.git.status();
        const currentBranch = status.current || 'main';
        await this.git.push('origin', currentBranch);
      }
    } catch (error: any) {
      throw new Error(`Git push 실패: ${error.message}`);
    }
  }

  async getRecentCommits(limit: number = 10) {
    try {
      const log = await this.git.log({ maxCount: limit });
      return log.all;
    } catch (error: any) {
      throw new Error(`Git log 조회 실패: ${error.message}`);
    }
  }
}

export const gitService = new GitService();

