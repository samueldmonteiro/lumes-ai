import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { LLMProvider } from './llm.provider';

@Injectable()
export class GeminiProvider implements OnModuleInit, LLMProvider {
  private ai: any;
  private readonly model: string;
  private readonly systemInstruction?: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'A variável de ambiente GEMINI_API_KEY não foi definida.',
      );
    }

    this.model = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
    this.systemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION;
  }

  async onModuleInit(): Promise<void> {
    const { GoogleGenAI } = await import('@google/genai');

    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async ask(prompt: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      ...(this.systemInstruction && {
        config: { systemInstruction: this.systemInstruction },
      }),
    });

    return (response?.text as string) ?? '';
  }
}
