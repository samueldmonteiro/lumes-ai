import { BaseController } from './base.controller';
export declare class AppController extends BaseController {
    constructor();
    getHello(): import("./base.controller").ApiResponse<{
        name: string;
        version: string;
        author: string;
        description: string;
        docs: string;
    }>;
}
