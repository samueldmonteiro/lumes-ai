"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./controllers/app.controller");
const app_service_1 = require("./services/app.service");
const ingest_controller_1 = require("./controllers/ingest.controller");
const ingest_service_1 = require("./services/ingest.service");
const chunker_service_1 = require("./services/chunker.service");
const ollama_service_1 = require("./services/ollama.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, ingest_controller_1.IngestController],
        providers: [app_service_1.AppService, ingest_service_1.IngestService, chunker_service_1.ChunkerService, ollama_service_1.OllamaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map