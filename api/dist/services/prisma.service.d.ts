import 'dotenv/config';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from "../generated/prisma/client";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    readonly schema: string;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
