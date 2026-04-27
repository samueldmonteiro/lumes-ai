import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AIProvider } from './ai.provider';

@Injectable()
export class GeminiProvider implements OnModuleInit, AIProvider {

  private ai: any;

  private readonly model: string;
  private readonly systemInstruction?: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('A variável de ambiente GEMINI_API_KEY não foi definida.');
    }

    this.model = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
    this.systemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION;
  }

  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const { GoogleGenAI } = await import('@google/genai');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async ask(prompt: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      ...(this.systemInstruction && {
        config: { systemInstruction: this.systemInstruction },
      }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (response?.text as string) ?? '';
  }
}