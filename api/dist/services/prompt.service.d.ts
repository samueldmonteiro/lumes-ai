import { SearchResult } from './search.service';
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
export declare class PromptService {
    buildCondensationPrompt(history: ChatMessage[], newQuestion: string): string;
    build(question: string, chunks: SearchResult[], history?: ChatMessage[]): string;
}
