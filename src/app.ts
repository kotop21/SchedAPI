import { PDFExtract } from 'pdf.js-extract';
import fs from 'fs';

const pdfExtract = new PDFExtract();
const options = {};

const file = "./static/schedule.pdf";

pdfExtract.extract(file, options, (err, data) => {
  if (err) return console.error(err);

  const words = data.pages[0].content;

  // Группировка по строкам
  let rows = {};
  words.forEach(w => {
    const y = Math.round(w.y);
    if (!rows[y]) rows[y] = [];
    rows[y].push(w.str);
  });

  // Сохраняем в JSON
  fs.writeFileSync("./output/output.json", JSON.stringify(rows, null, 2), "utf8");

  console.log("Результат сохранён в output.json");
});
