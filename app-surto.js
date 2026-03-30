async function exportPDF() {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const form = document.getElementById("form");

  const agravo = form.agravo.value;
  const data = form.data.value;
  const municipio = form.municipio.value;
  const casos = form.casos.value;
  const obs = form.obs.value;

  page.drawText("FICHA DE INVESTIGAÇÃO DE SURTO", {
    x: 150, y: 800, size: 14, font
  });

  page.drawText("Agravo: " + agravo, { x: 50, y: 760, size: 10, font });
  page.drawText("Data: " + data, { x: 50, y: 740, size: 10, font });
  page.drawText("Município: " + municipio, { x: 50, y: 720, size: 10, font });
  page.drawText("Casos: " + casos, { x: 50, y: 700, size: 10, font });

  page.drawText("Observações:", { x: 50, y: 660, size: 10, font });
  page.drawText(obs, { x: 50, y: 640, size: 10, font, maxWidth: 500 });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ficha-surto.pdf";
  a.click();
}
