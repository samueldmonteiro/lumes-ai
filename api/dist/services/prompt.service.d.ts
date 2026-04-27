import { SearchResult } from './search.service';
export declare class PromptService {
    build(question: string, chunks: SearchResult[]): string;
}
