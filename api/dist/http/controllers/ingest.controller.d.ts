import { IngestService } from "../../services/ingest.service";
import { BaseController } from './base.controller';
import { IngestTextDto, IngestJsonDto } from '../dtos/ingest.dto';
interface UploadedMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class IngestController extends BaseController {
    private readonly ingestService;
    constructor(ingestService: IngestService);
    ingestText(body: IngestTextDto): Promise<import("./base.controller").ApiResponse<import("../../services/ingest.service").IngestResult>>;
    ingestPDF(file: UploadedMulterFile | undefined, source?: string): Promise<import("./base.controller").ApiResponse<import("../../services/ingest.service").IngestResult>>;
    ingestJson(body: IngestJsonDto): Promise<import("./base.controller").ApiResponse<import("../../services/ingest.service").IngestResult>>;
}
export {};
