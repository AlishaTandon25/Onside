import ExcelJS from "exceljs";

export async function generateExcelReport(name: string, data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report Data");

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.columns = headers.map(h => ({ header: h.toUpperCase(), key: h, width: 20 }));

    data.forEach(item => {
      worksheet.addRow(item);
    });
  } else {
    worksheet.columns = [{ header: "Message", key: "msg", width: 50 }];
    worksheet.addRow({ msg: "No data available for this report." });
  }

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
