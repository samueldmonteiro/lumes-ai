import 'dotenv/config';
import { OnModuleInit } from '@nestjs/common';
import { LLMProvider } from './llm.provider';
export declare class GeminiProvider implements OnModuleInit, LLMProvider {
    private ai;
    private readonly model;
    private readonly systemInstruction?;
    constructor();
    onModuleInit(): Promise<void>;
    ask(prompt: string): Promise<string>;
}
