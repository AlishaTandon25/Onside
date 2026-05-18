import PDFDocument from "pdfkit";

export async function generatePdfReport(name: string, data: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text(`Report: ${name}`, { align: "center" });
      doc.moveDown(2);

      if (data.length === 0) {
        doc.fontSize(12).text("No data available for this report.", { align: "center" });
      } else {
        doc.fontSize(10);
        data.forEach((item, index) => {
          doc.text(`Entry ${index + 1}`, { underline: true });
          Object.entries(item).forEach(([key, value]) => {
            doc.text(`${key}: ${JSON.stringify(value)}`);
          });
          doc.moveDown(1);
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
