"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSrtInfo = void 0;
class Srt {
    constructor() {
        this.dialogues = [];
    }
}
const MIN_EVENT_FIELD_NUM = 3;
function extractSrtInfo(input) {
    // split with emplty line
    const lines = input.split(/\n\n/);
    const srtInstance = new Srt();
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const fields = line.split(/\n/);
        if (fields.length < MIN_EVENT_FIELD_NUM) {
            console.error('Invalid srt dialogue:', fields);
            continue;
        }
        const [lineOrder, timeAxis, ...lineText] = fields;
        const [startTime, endTime] = timeAxis.split(/\s-->\s/);
        const rawText = lineText.join('\n');
        const [primaryText, ...subsidiaryText] = lineText.map(text => text.replace(/\{.*?\}/g, ''));
        let event = {
            lineOrder,
            startTime,
            endTime,
            primaryText,
            subsidiaryText: subsidiaryText.join(''),
            rawText
        };
        srtInstance.dialogues.push(event);
    }
    console.log('srtInstance', srtInstance);
    return srtInstance;
}
exports.extractSrtInfo = extractSrtInfo;
//# sourceMappingURL=srt.js.map