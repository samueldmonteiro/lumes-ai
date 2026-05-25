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
    "inlineSchema": "generator client {\n  provider     = \"prisma-client\"\n  output       = \"../src/generated/prisma\"\n  moduleFormat = \"cjs\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\n// Tabela principal — cada chunk de texto com seu vetor\nmodel KnowledgeChunk {\n  id        Int                         @id @default(autoincrement())\n  content   String // texto original do chunk\n  embedding Unsupported(\"vector(768)\")? // vetor gerado pelo nomic-embed-text\n  category  String // 'biblioteca', 'contatos', 'cursos', 'servicos', etc.\n  source    String // nome do arquivo ou origem\n  metadata  Json                        @default(\"{}\")\n  createdAt DateTime                    @default(now())\n  updatedAt DateTime                    @updatedAt\n\n  @@map(\"knowledge_chunks\")\n}\n\n// Log de perguntas e respostas (útil para melhorar o sistema)\nmodel ChatLog {\n  id         Int      @id @default(autoincrement())\n  question   String\n  answer     String\n  sources    Json     @default(\"[]\") // quais chunks foram usados\n  similarity Float? // similaridade média dos chunks encontrados\n  createdAt  DateTime @default(now())\n\n  @@map(\"chat_logs\")\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  password  String\n  name      String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map(\"users\")\n}\n",
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
config.runtimeDataModel = JSON.parse("{\"models\":{\"KnowledgeChunk\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"source\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"knowledge_chunks\"},\"ChatLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"question\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"answer\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sources\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"similarity\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"chat_logs\"},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"users\"}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"KnowledgeChunk.findUnique\",\"KnowledgeChunk.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"KnowledgeChunk.findFirst\",\"KnowledgeChunk.findFirstOrThrow\",\"KnowledgeChunk.findMany\",\"data\",\"KnowledgeChunk.createOne\",\"KnowledgeChunk.createMany\",\"KnowledgeChunk.createManyAndReturn\",\"KnowledgeChunk.updateOne\",\"KnowledgeChunk.updateMany\",\"KnowledgeChunk.updateManyAndReturn\",\"create\",\"update\",\"KnowledgeChunk.upsertOne\",\"KnowledgeChunk.deleteOne\",\"KnowledgeChunk.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"KnowledgeChunk.groupBy\",\"KnowledgeChunk.aggregate\",\"ChatLog.findUnique\",\"ChatLog.findUniqueOrThrow\",\"ChatLog.findFirst\",\"ChatLog.findFirstOrThrow\",\"ChatLog.findMany\",\"ChatLog.createOne\",\"ChatLog.createMany\",\"ChatLog.createManyAndReturn\",\"ChatLog.updateOne\",\"ChatLog.updateMany\",\"ChatLog.updateManyAndReturn\",\"ChatLog.upsertOne\",\"ChatLog.deleteOne\",\"ChatLog.deleteMany\",\"ChatLog.groupBy\",\"ChatLog.aggregate\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"User.groupBy\",\"User.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"email\",\"password\",\"name\",\"createdAt\",\"updatedAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"question\",\"answer\",\"sources\",\"similarity\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"content\",\"category\",\"source\",\"metadata\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "eh8wCjwAAGYAMD0AAAQAED4AAGYAMD8CAAAAAUNAAFoAIURAAFoAIVoBAFkAIVsBAFkAIVwBAFkAIV0AAGMAIAEAAAABACABAAAAAQAgCjwAAGYAMD0AAAQAED4AAGYAMD8CAFgAIUNAAFoAIURAAFoAIVoBAFkAIVsBAFkAIVwBAFkAIV0AAGMAIAADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAHPwIAAAABQ0AAAAABREAAAAABWgEAAAABWwEAAAABXAEAAAABXYAAAAABAQgAAAkAIAc_AgAAAAFDQAAAAAFEQAAAAAFaAQAAAAFbAQAAAAFcAQAAAAFdgAAAAAEBCAAACwAwAQgAAAsAMAc_AgBuACFDQABtACFEQABtACFaAQBsACFbAQBsACFcAQBsACFdgAAAAAECAAAAAQAgCAAADgAgBz8CAG4AIUNAAG0AIURAAG0AIVoBAGwAIVsBAGwAIVwBAGwAIV2AAAAAAQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBRUAAHYAIBYAAHcAIBcAAHoAIBgAAHkAIBkAAHgAIAo8AABlADA9AAAXABA-AABlADA_AgBNACFDQABPACFEQABPACFaAQBOACFbAQBOACFcAQBOACFdAABcACADAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAk8AABiADA9AAAdABA-AABiADA_AgAAAAFDQABaACFQAQBZACFRAQBZACFSAABjACBTCABkACEBAAAAGgAgAQAAABoAIAk8AABiADA9AAAdABA-AABiADA_AgBYACFDQABaACFQAQBZACFRAQBZACFSAABjACBTCABkACEBUwAAbwAgAwAAAB0AIAMAAB4AMAQAABoAIAMAAAAdACADAAAeADAEAAAaACADAAAAHQAgAwAAHgAwBAAAGgAgBj8CAAAAAUNAAAAAAVABAAAAAVEBAAAAAVKAAAAAAVMIAAAAAQEIAAAiACAGPwIAAAABQ0AAAAABUAEAAAABUQEAAAABUoAAAAABUwgAAAABAQgAACQAMAEIAAAkADAGPwIAbgAhQ0AAbQAhUAEAbAAhUQEAbAAhUoAAAAABUwgAdQAhAgAAABoAIAgAACcAIAY_AgBuACFDQABtACFQAQBsACFRAQBsACFSgAAAAAFTCAB1ACECAAAAHQAgCAAAKQAgAgAAAB0AIAgAACkAIAMAAAAaACAPAAAiACAQAAAnACABAAAAGgAgAQAAAB0AIAYVAABwACAWAABxACAXAAB0ACAYAABzACAZAAByACBTAABvACAJPAAAWwAwPQAAMAAQPgAAWwAwPwIATQAhQ0AATwAhUAEATgAhUQEATgAhUgAAXAAgUwgAXQAhAwAAAB0AIAMAAC8AMBQAADAAIAMAAAAdACADAAAeADAEAAAaACAJPAAAVwAwPQAANgAQPgAAVwAwPwIAAAABQAEAAAABQQEAWQAhQgEAWQAhQ0AAWgAhREAAWgAhAQAAADMAIAEAAAAzACAJPAAAVwAwPQAANgAQPgAAVwAwPwIAWAAhQAEAWQAhQQEAWQAhQgEAWQAhQ0AAWgAhREAAWgAhAAMAAAA2ACADAAA3ADAEAAAzACADAAAANgAgAwAANwAwBAAAMwAgAwAAADYAIAMAADcAMAQAADMAIAY_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-AABiADA_AgBYACFDQABaACFQAQBZACFRAQBZACFSAABjACBTCABkACEMRYAAAAABSIAAAAABSYAAAAABSoAAAAABS4AAAAABTIAAAAABVAEAAAABVQEAAAABVgEAAAABV4AAAAABWIAAAAABWYAAAAABCEUIAAAAAUYIAAAABUcIAAAABUgIAAAAAUkIAAAAAUoIAAAAAUsIAAAAAUwIAGAAIQo8AABlADA9AAAXABA-AABlADA_AgBNACFDQABPACFEQABPACFaAQBOACFbAQBOACFcAQBOACFdAABcACAKPAAAZgAwPQAABAAQPgAAZgAwPwIAWAAhQ0AAWgAhREAAWgAhWgEAWQAhWwEAWQAhXAEAWQAhXQAAYwAgAAAAAAABXgEAAAABAV5AAAAAAQVeAgAAAAFfAgAAAAFgAgAAAAFhAgAAAAFiAgAAAAEAAAAAAAAFXggAAAABXwgAAAABYAgAAAABYQgAAAABYggAAAABAAAAAAAAAAAABRUABhYABxcACBgACRkACgAAAAAABRUABhYABxcACBgACRkACgAAAAUVABAWABEXABIYABMZABQAAAAAAAUVABAWABEXABIYABMZABQAAAAFFQAaFgAbFwAcGAAdGQAeAAAAAAAFFQAaFgAbFwAcGAAdGQAeAQIBAgMBBQYBBgcBBwgBCQoBCgwCCw0DDA8BDRECDhIEERMBEhQBExUCGhgFGxkLHBsMHRwMHh8MHyAMICEMISMMIiUCIyYNJCgMJSoCJisOJywMKC0MKS4CKjEPKzIVLDQWLTUWLjgWLzkWMDoWMTwWMj4CMz8XNEEWNUMCNkQYN0UWOEYWOUcCOkoZO0sf"
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