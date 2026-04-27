import { IngestService } from "../../services/ingest.service";
import { BaseController } from './base.controller';
import { IngestTextDto } from '../dtos/ingest.dto';
export declare class IngestController extends BaseController {
    private readonly ingestService;
    constructor(ingestService: IngestService);
    ingestText(body: IngestTextDto): Promise<import("@/services/ingest.service").IngestResult>;
}
