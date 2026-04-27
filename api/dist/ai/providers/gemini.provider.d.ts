import 'dotenv/config';
import { OnModuleInit } from '@nestjs/common';
import { AIProvider } from './ai.provider';
export declare class GeminiProvider implements OnModuleInit, AIProvider {
    private ai;
    private readonly model;
    private readonly systemInstruction?;
    constructor();
    onModuleInit(): Promise<void>;
    ask(prompt: string): Promise<string>;
}
