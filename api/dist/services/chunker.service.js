"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkerService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
let ChunkerService = class ChunkerService {
    chunkSize;
    overlap;
    constructor() {
        this.chunkSize = parseInt(process.env.CHUNK_SIZE || '500');
        this.overlap = parseInt(process.env.CHUNK_OVERLAP || '50');
    }
    split(text, chunkSize, overlap) {
        const size = chunkSize ?? this.chunkSize;
        const olvp = overlap ?? this.overlap;
        const words = text.split(/\s+/).filter(Boolean);
        const chunks = [];
        let i = 0;
        let index = 0;
        while (i < words.length) {
            const slice = words.slice(i, i + size);
            const content = slice.join(' ').trim();
            if (content.length > 50) {
                chunks.push({ content, index });
                index++;
            }
            i += Math.max(1, size - olvp);
        }
        return chunks;
    }
};
exports.ChunkerService = ChunkerService;
exports.ChunkerService = ChunkerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChunkerService);
//# sourceMappingURL=chunker.service.js.map