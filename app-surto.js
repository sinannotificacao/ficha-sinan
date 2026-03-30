async function exportPDF(){
const {PDFDocument,StandardFonts,degrees}=PDFLib;
const pdfDoc=await PDFDocument.create();
const page=pdfDoc.addPage([595,842]);
const font=await pdfDoc.embedFont(StandardFonts.Helvetica);

page.drawText("DADOS GERAIS",{x:20,y:700,rotate:degrees(90),size:10,font});
page.drawText("NOTIFICAÇÃO DE SURTO",{x:20,y:520,rotate:degrees(90),size:10,font});
page.drawText("DADOS DE OCORRÊNCIA",{x:20,y:340,rotate:degrees(90),size:10,font});
page.drawText("SITUAÇÃO INICIAL",{x:20,y:180,rotate:degrees(90),size:10,font});

const f=document.getElementById("form");
page.drawText("Agravo: "+f.agravo.value,{x:120,y:760,size:10,font});
page.drawText("Município: "+f.municipio.value,{x:120,y:740,size:10,font});
page.drawText("Casos: "+f.casos.value,{x:120,y:720,size:10,font});
page.drawText("Obs: "+f.obs.value,{x:120,y:690,size:10,font,maxWidth:400});

const bytes=await pdfDoc.save();
const blob=new Blob([bytes],{type:"application/pdf"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="ficha-surto.pdf";
a.click();
}
