async function exportPDF(){
const {PDFDocument,StandardFonts,degrees}=PDFLib;
const pdfDoc=await PDFDocument.create();
const page=pdfDoc.addPage([595,842]);
const font=await pdfDoc.embedFont(StandardFonts.Helvetica);

// bordas principais
page.drawRectangle({x:10,y:10,width:575,height:822,borderWidth:1});

// colunas laterais (visual SINAN)
page.drawRectangle({x:10,y:600,width:40,height:200,borderWidth:1});
page.drawRectangle({x:10,y:400,width:40,height:200,borderWidth:1});
page.drawRectangle({x:10,y:200,width:40,height:200,borderWidth:1});

// textos verticais
page.drawText("DADOS GERAIS",{x:25,y:650,rotate:degrees(90),size:8,font});
page.drawText("NOTIFICAÇÃO DE SURTO",{x:25,y:450,rotate:degrees(90),size:8,font});
page.drawText("DADOS DE OCORRÊNCIA",{x:25,y:250,rotate:degrees(90),size:8,font});

// cabeçalho
page.drawText("FICHA DE INVESTIGAÇÃO DE SURTO",{x:150,y:800,size:12,font});

// campos
const f=document.getElementById("f");

page.drawRectangle({x:60,y:760,width:500,height:30,borderWidth:1});
page.drawText("Agravo: "+f.agravo.value,{x:65,y:770,size:10,font});

page.drawRectangle({x:60,y:720,width:500,height:30,borderWidth:1});
page.drawText("Município: "+f.municipio.value,{x:65,y:730,size:10,font});

page.drawRectangle({x:60,y:680,width:500,height:30,borderWidth:1});
page.drawText("Casos: "+f.casos.value,{x:65,y:690,size:10,font});

page.drawRectangle({x:60,y:600,width:500,height:60,borderWidth:1});
page.drawText("Observações:",{x:65,y:650,size:10,font});
page.drawText(f.obs.value,{x:65,y:630,size:10,font,maxWidth:480});

const bytes=await pdfDoc.save();
const blob=new Blob([bytes],{type:"application/pdf"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="sinan-surto.pdf";
a.click();
}
