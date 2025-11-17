import OpenAI from 'openai';
import { config } from '../config';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    if (!config.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY가 설정되지 않았습니다. GPT 기능이 제한됩니다.');
    }
    this.client = new OpenAI({
      apiKey: config.OPENAI_API_KEY || 'dummy-key',
    });
  }

  async summarizeCommit(commitData: {
    hash: string;
    message: string;
    stats: {
      filesChanged: number;
      insertions: number;
      deletions: number;
    };
  }): Promise<string> {
    if (!config.OPENAI_API_KEY) {
      return commitData.message.substring(0, 50);
    }
    try {
      const prompt = `다음 Git 커밋 정보를 바탕으로 간결하고 명확한 업무 요약을 작성해주세요. 
한국어로 작성하고, 50자 이내로 요약해주세요.

커밋 메시지: ${commitData.message}
변경된 파일 수: ${commitData.stats.filesChanged}
추가된 라인: ${commitData.stats.insertions}
삭제된 라인: ${commitData.stats.deletions}

요약:`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 Git 커밋 내용을 간결하게 요약하는 전문가입니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || commitData.message;
    } catch (error: any) {
      console.error('OpenAI 요약 실패:', error);
      return commitData.message.substring(0, 50);
    }
  }

  async summarizeTask(description: string): Promise<string> {
    if (!config.OPENAI_API_KEY) {
      return description.substring(0, 30);
    }
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 업무 내용을 간결하게 요약하는 전문가입니다.',
          },
          {
            role: 'user',
            content: `다음 업무 내용을 30자 이내로 요약해주세요:\n\n${description}`,
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || description.substring(0, 30);
    } catch (error: any) {
      console.error('OpenAI 요약 실패:', error);
      return description.substring(0, 30);
    }
  }
}

export const openaiService = new OpenAIService();

