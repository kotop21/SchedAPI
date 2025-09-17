import { PDFExtract } from "pdf.js-extract";

export async function parsePDF(filePath: string): Promise<Record<string, string[]>> {
  const pdfExtract = new PDFExtract();
  const options = {};

  return new Promise((resolve, reject) => {
    pdfExtract.extract(filePath, options, (err, data) => {
      if (err) return reject(err);

      const words = data.pages[0].content;

      // Группируем слова по строкам (ключ = Y)
      const rows: Record<string, string[]> = {};
      words.forEach(w => {
        const y = Math.round(w.y);
        if (!rows[y]) rows[y] = [];
        rows[y].push(w.str.trim());
      });

      // Очищаем каждую строку от пустых значений
      for (const key of Object.keys(rows)) {
        rows[key] = rows[key].filter(cell => cell !== "");
      }

      resolve(rows);
    });
  });
}
