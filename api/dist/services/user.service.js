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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const prisma_user_repository_1 = require("../repositories/prisma/prisma-user.repository");
const exeptions_1 = require("../exeptions");
let UserService = UserService_1 = class UserService {
    userRepo;
    logger = new common_1.Logger(UserService_1.name);
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async updateProfile(userId, dto) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new exeptions_1.UserNotFoundError();
        }
        if (dto.email && dto.email !== user.email) {
            const existingUser = await this.userRepo.findByEmail(dto.email);
            if (existingUser) {
                throw new exeptions_1.EmailAlreadyExistsError();
            }
        }
        const updateData = {};
        if (dto.name !== undefined) {
            updateData.name = dto.name;
        }
        if (dto.email !== undefined) {
            updateData.email = dto.email;
        }
        if (dto.password !== undefined) {
            this.logger.log(`Hashing new password for user ${userId}`);
            updateData.password = await argon2.hash(dto.password);
        }
        const updated = await this.userRepo.update(userId, updateData);
        this.logger.log(`Profile updated for user ${userId}`);
        return updated;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_user_repository_1.PrismaUserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map