import 'dotenv/config';
import { Injectable } from '@nestjs/common';

export interface Chunk {
  content: string;
  index: number;
}

@Injectable()
export class ChunkerService {
  private chunkSize: number;
  private overlap: number;

  constructor() {
    this.chunkSize = parseInt(process.env.CHUNK_SIZE || '500');
    this.overlap   = parseInt(process.env.CHUNK_OVERLAP || '50');
  }

  split(text: string, chunkSize?: number, overlap?: number): Chunk[] {
    const size    = chunkSize ?? this.chunkSize;
    const olvp    = overlap ?? this.overlap;
    const words   = text.split(/\s+/).filter(Boolean);
    const chunks: Chunk[] = [];

    let i = 0;
    let index = 0;

    while (i < words.length) {
      const slice   = words.slice(i, i + size);
      const content = slice.join(' ').trim();

      // Ignora chunks muito curtos (provavelmente ruído do PDF)
      if (content.length > 50) {
        chunks.push({ content, index });
        index++;
      }

      i += Math.max(1, size - olvp);
    }

    return chunks;
  }
}