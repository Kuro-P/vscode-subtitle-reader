"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAssInfo = void 0;
class Ass {
    constructor() {
        this.scriptInfo = [];
        this.styleInfo = [];
        this.eventsInfo = [];
        this.dialogues = [];
    }
}
function extractAssInfo(input) {
    const lines = input.split('\n');
    const assInstance = new Ass();
    let curSection;
    // [start, end, text]
    let fieldIdxs = new Array(3).fill(0);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // empty line
        if (!line || line.trim() === '') {
            curSection = undefined;
            continue;
        }
        if (/^\[Script Info]/i.test(line)) {
            curSection = 'scriptInfo';
            continue;
        }
        else if (/^\[V4\+? Styles\+?\]/i.test(line)) {
            curSection = 'styleInfo';
            continue;
        }
        else if (/^\[Events]/i.test(line)) {
            curSection = 'eventsInfo';
            continue;
        }
        if (curSection === 'scriptInfo') {
            if (/^;/i.test(line)) {
                continue;
            }
            assInstance.scriptInfo.push(line);
        }
        else if (curSection === 'styleInfo') {
            assInstance.styleInfo.push(line);
        }
        else if (curSection === 'eventsInfo') {
            if (/^Format:/i.test(line)) {
                const eventFormats = line.replace(/Format:/i, "").replace(/\s/g, "").split(",");
                eventFormats.forEach((format, idx) => {
                    if (/Start/i.test(format)) {
                        fieldIdxs[0] = idx;
                    }
                    else if (/End/i.test(format)) {
                        fieldIdxs[1] = idx;
                    }
                    else if (/Text/i.test(format)) {
                        fieldIdxs[2] = idx;
                    }
                });
            }
            if (/^Dialogue/i.test(line)) {
                const dialogFields = line.replace(/Format:/i, "").split(",");
                const [startIdx, endIdx, textIdx] = fieldIdxs;
                // plain text (remove ass style)
                // in case there a comma in the text
                const rawText = textIdx === dialogFields.length - 1 ?
                    dialogFields[textIdx] :
                    dialogFields.slice(textIdx).join(',');
                const [primaryText, subsidiaryText] = rawText.split(/\\N/).map(str => str.replace(/\{.*?\}/g, ''));
                const startTime = dialogFields[startIdx], endTime = dialogFields[endIdx];
                let event = {
                    startTime,
                    endTime,
                    rawText,
                    primaryText,
                    subsidiaryText
                };
                assInstance.dialogues.push(event);
            }
        }
    }
    console.log('assInstance', assInstance);
    return assInstance;
}
exports.extractAssInfo = extractAssInfo;
//# sourceMappingURL=ass.js.map