declare module 'pdf2table' {
  export function parse(
    buffer: Buffer,
    callback: (err: any, rows: any[][], rowsdebug?: any) => void
  ): void;
}
