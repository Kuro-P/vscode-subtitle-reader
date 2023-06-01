export enum FIleType {
  SSA = 'ssa',
  ASS = 'ass',
  SRT = 'srt',
  SUB = 'sub'
}

// 这个看起来没啥用？可以删了吧
export interface FileInstance {
  type: FIleType
  name: string
  absolutePath?: string
  relativePath?: string
  // mainText: some useful text like Timestamp, Dialogue
  mainText?: string
}

export interface DialogueEvent {
  startTime: string
  endTime: string
  rawText: string
  primaryText: string
  subsidiaryText?: string
  lineNumber: number
}

