"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider     = \"prisma-client\"\n  output       = \"../src/generated/prisma\"\n  moduleFormat = \"cjs\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel KnowledgeChunk {\n  id        Int      @id @default(autoincrement())\n  content   String // texto original do chunk\n  // embedding é gerenciado via SQL raw (pgvector não tem suporte nativo no Prisma ainda)\n  category  String // 'biblioteca', 'contatos', 'cursos', 'servicos', etc.\n  source    String // nome do arquivo ou origem\n  metadata  Json     @default(\"{}\")\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map(\"knowledge_chunks\")\n}\n\n// Log de perguntas e respostas (útil para melhorar o sistema)\nmodel ChatLog {\n  id         Int      @id @default(autoincrement())\n  question   String\n  answer     String\n  sources    Json     @default(\"[]\") // quais chunks foram usados\n  similarity Float? // similaridade média dos chunks encontrados\n  createdAt  DateTime @default(now())\n\n  @@map(\"chat_logs\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"KnowledgeChunk\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"source\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"knowledge_chunks\"},\"ChatLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"question\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"answer\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sources\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"similarity\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"chat_logs\"}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"KnowledgeChunk.findUnique\",\"KnowledgeChunk.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"KnowledgeChunk.findFirst\",\"KnowledgeChunk.findFirstOrThrow\",\"KnowledgeChunk.findMany\",\"data\",\"KnowledgeChunk.createOne\",\"KnowledgeChunk.createMany\",\"KnowledgeChunk.createManyAndReturn\",\"KnowledgeChunk.updateOne\",\"KnowledgeChunk.updateMany\",\"KnowledgeChunk.updateManyAndReturn\",\"create\",\"update\",\"KnowledgeChunk.upsertOne\",\"KnowledgeChunk.deleteOne\",\"KnowledgeChunk.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"KnowledgeChunk.groupBy\",\"KnowledgeChunk.aggregate\",\"ChatLog.findUnique\",\"ChatLog.findUniqueOrThrow\",\"ChatLog.findFirst\",\"ChatLog.findFirstOrThrow\",\"ChatLog.findMany\",\"ChatLog.createOne\",\"ChatLog.createMany\",\"ChatLog.createManyAndReturn\",\"ChatLog.updateOne\",\"ChatLog.updateMany\",\"ChatLog.updateManyAndReturn\",\"ChatLog.upsertOne\",\"ChatLog.deleteOne\",\"ChatLog.deleteMany\",\"ChatLog.groupBy\",\"ChatLog.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"question\",\"answer\",\"sources\",\"similarity\",\"createdAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"contains\",\"startsWith\",\"endsWith\",\"content\",\"category\",\"source\",\"metadata\",\"updatedAt\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "WhUgCiwAAEsAMC0AAAQAEC4AAEsAMC8CAAAAATRAAEkAIUYBAEYAIUcBAEYAIUgBAEYAIUkAAEcAIEpAAEkAIQEAAAABACABAAAAAQAgCiwAAEsAMC0AAAQAEC4AAEsAMC8CAEUAITRAAEkAIUYBAEYAIUcBAEYAIUgBAEYAIUkAAEcAIEpAAEkAIQADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAHLwIAAAABNEAAAAABRgEAAAABRwEAAAABSAEAAAABSYAAAAABSkAAAAABAQgAAAkAIAcvAgAAAAE0QAAAAAFGAQAAAAFHAQAAAAFIAQAAAAFJgAAAAAFKQAAAAAEBCAAACwAwAQgAAAsAMAcvAgBVACE0QABUACFGAQBSACFHAQBSACFIAQBSACFJgAAAAAFKQABUACECAAAAAQAgCAAADgAgBy8CAFUAITRAAFQAIUYBAFIAIUcBAFIAIUgBAFIAIUmAAAAAAUpAAFQAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBRUAAFYAIBYAAFcAIBcAAFoAIBgAAFkAIBkAAFgAIAosAABKADAtAAAXABAuAABKADAvAgA0ACE0QAA4ACFGAQA1ACFHAQA1ACFIAQA1ACFJAAA2ACBKQAA4ACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAksAABEADAtAAAdABAuAABEADAvAgAAAAEwAQBGACExAQBGACEyAABHACAzCABIACE0QABJACEBAAAAGgAgAQAAABoAIAksAABEADAtAAAdABAuAABEADAvAgBFACEwAQBGACExAQBGACEyAABHACAzCABIACE0QABJACEBMwAATAAgAwAAAB0AIAMAAB4AMAQAABoAIAMAAAAdACADAAAeADAEAAAaACADAAAAHQAgAwAAHgAwBAAAGgAgBi8CAAAAATABAAAAATEBAAAAATKAAAAAATMIAAAAATRAAAAAAQEIAAAiACAGLwIAAAABMAEAAAABMQEAAAABMoAAAAABMwgAAAABNEAAAAABAQgAACQAMAEIAAAkADAGLwIAVQAhMAEAUgAhMQEAUgAhMoAAAAABMwgAUwAhNEAAVAAhAgAAABoAIAgAACcAIAYvAgBVACEwAQBSACExAQBSACEygAAAAAEzCABTACE0QABUACECAAAAHQAgCAAAKQAgAgAAAB0AIAgAACkAIAMAAAAaACAPAAAiACAQAAAnACABAAAAGgAgAQAAAB0AIAYVAABNACAWAABOACAXAABRACAYAABQACAZAABPACAzAABMACAJLAAAMwAwLQAAMAAQLgAAMwAwLwIANAAhMAEANQAhMQEANQAhMgAANgAgMwgANwAhNEAAOAAhAwAAAB0AIAMAAC8AMBQAADAAIAMAAAAdACADAAAeADAEAAAaACAJLAAAMwAwLQAAMAAQLgAAMwAwLwIANAAhMAEANQAhMQEANQAhMgAANgAgMwgANwAhNEAAOAAhDRUAADoAIBYAAEMAIBcAADoAIBgAADoAIBkAADoAIDUCAAAAATYCAAAABDcCAAAABDgCAAAAATkCAAAAAToCAAAAATsCAAAAATwCAEIAIQ4VAAA6ACAYAABBACAZAABBACA1AQAAAAE2AQAAAAQ3AQAAAAQ4AQAAAAE5AQAAAAE6AQAAAAE7AQAAAAE8AQBAACFDAQAAAAFEAQAAAAFFAQAAAAEPFQAAOgAgGAAAPwAgGQAAPwAgNYAAAAABOIAAAAABOYAAAAABOoAAAAABO4AAAAABPIAAAAABPQEAAAABPgEAAAABPwEAAAABQIAAAAABQYAAAAABQoAAAAABDRUAAD0AIBYAAD4AIBcAAD4AIBgAAD4AIBkAAD4AIDUIAAAAATYIAAAABTcIAAAABTgIAAAAATkIAAAAAToIAAAAATsIAAAAATwIADwAIQsVAAA6ACAYAAA7ACAZAAA7ACA1QAAAAAE2QAAAAAQ3QAAAAAQ4QAAAAAE5QAAAAAE6QAAAAAE7QAAAAAE8QAA5ACELFQAAOgAgGAAAOwAgGQAAOwAgNUAAAAABNkAAAAAEN0AAAAAEOEAAAAABOUAAAAABOkAAAAABO0AAAAABPEAAOQAhCDUCAAAAATYCAAAABDcCAAAABDgCAAAAATkCAAAAAToCAAAAATsCAAAAATwCADoAIQg1QAAAAAE2QAAAAAQ3QAAAAAQ4QAAAAAE5QAAAAAE6QAAAAAE7QAAAAAE8QAA7ACENFQAAPQAgFgAAPgAgFwAAPgAgGAAAPgAgGQAAPgAgNQgAAAABNggAAAAFNwgAAAAFOAgAAAABOQgAAAABOggAAAABOwgAAAABPAgAPAAhCDUCAAAAATYCAAAABTcCAAAABTgCAAAAATkCAAAAAToCAAAAATsCAAAAATwCAD0AIQg1CAAAAAE2CAAAAAU3CAAAAAU4CAAAAAE5CAAAAAE6CAAAAAE7CAAAAAE8CAA-ACEMNYAAAAABOIAAAAABOYAAAAABOoAAAAABO4AAAAABPIAAAAABPQEAAAABPgEAAAABPwEAAAABQIAAAAABQYAAAAABQoAAAAABDhUAADoAIBgAAEEAIBkAAEEAIDUBAAAAATYBAAAABDcBAAAABDgBAAAAATkBAAAAAToBAAAAATsBAAAAATwBAEAAIUMBAAAAAUQBAAAAAUUBAAAAAQs1AQAAAAE2AQAAAAQ3AQAAAAQ4AQAAAAE5AQAAAAE6AQAAAAE7AQAAAAE8AQBBACFDAQAAAAFEAQAAAAFFAQAAAAENFQAAOgAgFgAAQwAgFwAAOgAgGAAAOgAgGQAAOgAgNQIAAAABNgIAAAAENwIAAAAEOAIAAAABOQIAAAABOgIAAAABOwIAAAABPAIAQgAhCDUIAAAAATYIAAAABDcIAAAABDgIAAAAATkIAAAAAToIAAAAATsIAAAAATwIAEMAIQksAABEADAtAAAdABAuAABEADAvAgBFACEwAQBGACExAQBGACEyAABHACAzCABIACE0QABJACEINQIAAAABNgIAAAAENwIAAAAEOAIAAAABOQIAAAABOgIAAAABOwIAAAABPAIAOgAhCzUBAAAAATYBAAAABDcBAAAABDgBAAAAATkBAAAAAToBAAAAATsBAAAAATwBAEEAIUMBAAAAAUQBAAAAAUUBAAAAAQw1gAAAAAE4gAAAAAE5gAAAAAE6gAAAAAE7gAAAAAE8gAAAAAE9AQAAAAE-AQAAAAE_AQAAAAFAgAAAAAFBgAAAAAFCgAAAAAEINQgAAAABNggAAAAFNwgAAAAFOAgAAAABOQgAAAABOggAAAABOwgAAAABPAgAPgAhCDVAAAAAATZAAAAABDdAAAAABDhAAAAAATlAAAAAATpAAAAAATtAAAAAATxAADsAIQosAABKADAtAAAXABAuAABKADAvAgA0ACE0QAA4ACFGAQA1ACFHAQA1ACFIAQA1ACFJAAA2ACBKQAA4ACEKLAAASwAwLQAABAAQLgAASwAwLwIARQAhNEAASQAhRgEARgAhRwEARgAhSAEARgAhSQAARwAgSkAASQAhAAAAAAAAAUsBAAAAAQVLCAAAAAFMCAAAAAFNCAAAAAFOCAAAAAFPCAAAAAEBS0AAAAABBUsCAAAAAUwCAAAAAU0CAAAAAU4CAAAAAU8CAAAAAQAAAAAAAAAAAAUVAAYWAAcXAAgYAAkZAAoAAAAAAAUVAAYWAAcXAAgYAAkZAAoAAAAFFQAQFgARFwASGAATGQAUAAAAAAAFFQAQFgARFwASGAATGQAUAQIBAgMBBQYBBgcBBwgBCQoBCgwCCw0DDA8BDRECDhIEERMBEhQBExUCGhgFGxkLHBsMHRwMHh8MHyAMICEMISMMIiUCIyYNJCgMJSoCJisOJywMKC0MKS4CKjEPKzIV"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map