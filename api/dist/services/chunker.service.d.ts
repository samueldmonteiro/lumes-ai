import 'dotenv/config';
export interface Chunk {
    content: string;
    index: number;
}
export declare class ChunkerService {
    private chunkSize;
    private overlap;
    constructor();
    split(text: string, chunkSize?: number, overlap?: number): Chunk[];
}
