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
exports.GeminiProvider = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
let GeminiProvider = class GeminiProvider {
    ai;
    model;
    systemInstruction;
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('A variável de ambiente GEMINI_API_KEY não foi definida.');
        }
        this.model = process.env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
        this.systemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION;
    }
    async onModuleInit() {
        const { GoogleGenAI } = await import('@google/genai');
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    async ask(prompt) {
        const response = await this.ai.models.generateContent({
            model: this.model,
            contents: prompt,
            ...(this.systemInstruction && {
                config: { systemInstruction: this.systemInstruction },
            }),
        });
        return response?.text ?? '';
    }
};
exports.GeminiProvider = GeminiProvider;
exports.GeminiProvider = GeminiProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GeminiProvider);
//# sourceMappingURL=gemini.provider.js.map