#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3001';
const JWT_TOKEN = process.env.JWT_TOKEN || '';

class TaskRPAMCPServer {
  private server: Server;
  private apiClient: any;

  constructor() {
    this.server = new Server(
      {
        name: 'task-rpa-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // API 클라이언트 설정
    this.apiClient = axios.create({
      baseURL: API_URL,
      headers: JWT_TOKEN ? { Authorization: `Bearer ${JWT_TOKEN}` } : {},
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // 도구 목록 제공
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_markdown_file',
            description: '작업 내용을 정리해서 마크다운 파일로 생성합니다. 파일 생성 후 자동으로 업무 목록에 추가됩니다.',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: '생성할 마크다운 파일명 (예: work-summary.md)',
                },
                content: {
                  type: 'string',
                  description: '마크다운 파일 내용',
                },
                title: {
                  type: 'string',
                  description: '업무 제목 (파일명을 기본값으로 사용)',
                },
                description: {
                  type: 'string',
                  description: '업무 설명 (파일 내용을 기본값으로 사용)',
                },
              },
              required: ['filename', 'content'],
            },
          },
          {
            name: 'create_task_from_file',
            description: '생성된 파일을 읽어서 업무 목록에 추가합니다.',
            inputSchema: {
              type: 'object',
              properties: {
                filepath: {
                  type: 'string',
                  description: '읽을 파일 경로',
                },
                title: {
                  type: 'string',
                  description: '업무 제목 (파일명을 기본값으로 사용)',
                },
              },
              required: ['filepath'],
            },
          },
        ],
      };
    });

    // 도구 실행
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_markdown_file':
            return await this.createMarkdownFile(args as any);

          case 'create_task_from_file':
            return await this.createTaskFromFile(args as any);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `오류 발생: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async createMarkdownFile(args: {
    filename: string;
    content: string;
    title?: string;
    description?: string;
  }) {
    const { filename, content, title, description } = args;

    // 파일명 확장자 확인
    const filepath = filename.endsWith('.md') ? filename : `${filename}.md`;

    // 현재 작업 디렉토리에 파일 생성
    const currentDir = process.cwd();
    const fullPath = path.join(currentDir, filepath);

    try {
      // 파일 생성
      await fs.writeFile(fullPath, content, 'utf-8');

      // 업무 생성
      const taskTitle = title || path.basename(filepath, '.md');
      const taskDescription = description || content.substring(0, 500);

      const taskResult = await this.createTask({
        title: taskTitle,
        description: taskDescription,
        filepath: fullPath,
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ 마크다운 파일이 생성되었습니다: ${fullPath}\n✅ 업무가 생성되었습니다: ${taskResult.task?.id || 'N/A'}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`파일 생성 실패: ${error.message}`);
    }
  }

  private async createTaskFromFile(args: { filepath: string; title?: string }) {
    const { filepath, title } = args;

    try {
      // 파일 읽기
      const content = await fs.readFile(filepath, 'utf-8');
      const filename = path.basename(filepath);

      // 업무 생성
      const taskTitle = title || path.basename(filepath, path.extname(filepath));
      const taskDescription = content.substring(0, 500);

      const taskResult = await this.createTask({
        title: taskTitle,
        description: taskDescription,
        filepath: filepath,
      });

      return {
        content: [
          {
            type: 'text',
            text: `✅ 파일을 읽어서 업무를 생성했습니다.\n파일: ${filepath}\n업무 ID: ${taskResult.task?.id || 'N/A'}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`파일 읽기 실패: ${error.message}`);
    }
  }

  private async createTask(data: {
    title: string;
    description: string;
    filepath: string;
  }) {
    try {
      const response = await this.apiClient.post('/api/tasks/create', {
        title: data.title,
        description: `${data.description}\n\n파일 경로: ${data.filepath}`,
        priority: 'medium',
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `API 오류: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        );
      }
      throw new Error(`API 호출 실패: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Task RPA MCP Server가 시작되었습니다.');
  }
}

const server = new TaskRPAMCPServer();
server.run().catch(console.error);

