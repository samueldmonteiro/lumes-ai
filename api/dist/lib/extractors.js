"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFromPDF = extractFromPDF;
exports.extractFromText = extractFromText;
exports.extractFromJSON = extractFromJSON;
const unpdf_1 = require("unpdf");
async function extractFromPDF(buffer) {
    const pdf = await (0, unpdf_1.getDocumentProxy)(new Uint8Array(buffer));
    const { text } = await (0, unpdf_1.extractText)(pdf, { mergePages: true });
    return text
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
function extractFromText(raw) {
    return raw
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
function extractFromJSON(data) {
    function flatten(obj, prefix = '') {
        if (typeof obj !== 'object' || obj === null) {
            return `${prefix}: ${String(obj)}`;
        }
        if (Array.isArray(obj)) {
            return obj
                .map((item, i) => flatten(item, prefix ? `${prefix}[${i}]` : `[${i}]`))
                .join('\n');
        }
        return Object.entries(obj)
            .map(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
            .join('\n');
    }
    return flatten(data);
}
//# sourceMappingURL=extractors.js.map