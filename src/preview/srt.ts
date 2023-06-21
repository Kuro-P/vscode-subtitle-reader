// process dialogue info in srt file
import { DialogueEvent } from "./../type/file"

interface SrtEvent extends DialogueEvent {
  lineOrder?: number | string
}

export class Srt {
  dialogues: SrtEvent[] = []
}

export const MIN_EVENT_FIELD_NUM = 3

export function extractSrtInfo (input: string) {
  // split with emplty line
  const lines = input.split(/\n\n/)
  const srtInstance = new Srt()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const fields = line.split(/\n/)
    if (fields.length < MIN_EVENT_FIELD_NUM) {
      console.error('Invalid srt dialogue:', fields)
      continue
    }

    const lineInfo = extractSrtInfoFromLine(fields)
    if (!lineInfo) {
      continue
    }

    const { lineOrder, startTime, endTime, primaryText, secondaryText, rawText } = lineInfo
    const lineNumber = i + 1

    let event: SrtEvent = {
      lineOrder,
      startTime,
      endTime,
      primaryText,
      secondaryText,
      rawText,
      lineNumber,
      rawLineNumber: parseInt(lineOrder as string || '0')
    }
    srtInstance.dialogues.push(event)
  }

  return srtInstance
}

export function extractSrtInfoFromLine(lines: string[]): Pick<SrtEvent, 'lineOrder' |'startTime' | 'endTime' | 'primaryText' | 'secondaryText' | 'rawText' > | null {
  const [ lineOrder, timeAxis, ...lineText ] = lines
  const [ startTime, endTime ] = timeAxis.split(/\s-->\s/)
  const rawText = lineText.join('\n')
  const [ primaryText, ...secondaryText ] = lineText.map(text => text.replace(/\{.*?\}/g, ''))

  return {
    lineOrder,
    startTime,
    endTime,
    primaryText,
    secondaryText: secondaryText.join(''),
    rawText
  }
}


