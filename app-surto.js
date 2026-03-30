async function exportPDF(){
const {PDFDocument,StandardFonts,degrees}=PDFLib;
const pdfDoc=await PDFDocument.create();
const page=pdfDoc.addPage([595,842]);
const font=await pdfDoc.embedFont(StandardFonts.Helvetica);

function vertical(text,y){
page.drawText(text,{x:20,y,rotate:degrees(90),size:9,font});
}

vertical("DADOS GERAIS",700);
vertical("NOTIFICAÇÃO DE SURTO",550);
vertical("DADOS DE OCORRÊNCIA",400);
vertical("SITUAÇÃO INICIAL",250);

const f=document.getElementById("form");

page.drawText("FICHA DE INVESTIGAÇÃO DE SURTO",{x:150,y:800,size:14,font});

page.drawText("Agravo: "+f.agravo.value,{x:100,y:760,size:10,font});
page.drawText("Data: "+f.data.value,{x:100,y:740,size:10,font});
page.drawText("Município: "+f.municipio.value,{x:100,y:720,size:10,font});

page.drawText("Casos: "+f.casos.value,{x:100,y:680,size:10,font});
page.drawText("Local: "+f.local.value,{x:100,y:660,size:10,font});

page.drawText("Bairro: "+f.bairro.value,{x:100,y:620,size:10,font});
page.drawText("Logradouro: "+f.logradouro.value,{x:100,y:600,size:10,font});

page.drawText("Transmissão: "+f.transmissao.value,{x:100,y:560,size:10,font});

page.drawText("Observações:",{x:100,y:520,size:10,font});
page.drawText(f.obs.value,{x:100,y:500,size:10,font,maxWidth:400});

page.drawText("Investigador: "+f.nome.value,{x:100,y:460,size:10,font});
page.drawText("Função: "+f.funcao.value,{x:100,y:440,size:10,font});

const bytes=await pdfDoc.save();
const blob=new Blob([bytes],{type:"application/pdf"});
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="ficha-surto-final.pdf";
a.click();
}
