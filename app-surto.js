async function exportPDF(){
const {PDFDocument,StandardFonts, rgb, degrees}=PDFLib;
const pdfDoc=await PDFDocument.create();
const page=pdfDoc.addPage([595,842]);
const font=await pdfDoc.embedFont(StandardFonts.Helvetica);

page.drawText("DADOS GERAIS",{x:20,y:700,rotate:degrees(90),size:10,font});
page.drawText("NOTIFICAÇÃO DE SURTO",{x:20,y:500,rotate:degrees(90),size:10,font});
page.drawText("DADOS DE OCORRÊNCIA",{x:20,y:300,rotate:degrees(90),size:10,font});
page.drawText("SITUAÇÃO INICIAL",{x:20,y:150,rotate:degrees(90),size:10,font});

const form=document.getElementById("form");
page.drawText("Agravo: "+form.agravo.value,{x:100,y:750,size:10,font});
page.drawText("Município: "+form.municipio.value,{x:100,y:730,size:10,font});
page.drawText("Casos: "+form.casos.value,{x:100,y:710,size:10,font});
page.drawText("Obs: "+form.obs.value,{x:100,y:680,size:10,font});

const pdfBytes=await pdfDoc.save();
const blob=new Blob([pdfBytes],{type:"application/pdf"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="ficha-surto-v2.pdf";
a.click();
}
