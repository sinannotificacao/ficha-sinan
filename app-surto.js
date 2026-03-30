(() => {
  const { PDFDocument, StandardFonts, degrees, rgb } = PDFLib;
  const form = document.getElementById('notificationForm');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const fillSampleBtn = document.getElementById('fillSampleBtn');

  const A4_W = 595.28;
  const A4_H = 841.89;
  const M = 26;
  const SIDE = 24;
  const CONTENT_X = M + SIDE;
  const CONTENT_W = A4_W - CONTENT_X - M;

  function val(name) {
    const field = form.elements[name];
    return field ? String(field.value || '').trim() : '';
  }

  function formatDateBR(v) {
    if (!v) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : v;
  }

  function onlyDigits(v) {
    return String(v || '').replace(/\D+/g, '');
  }

  function fitText(text, maxChars) {
    const s = String(text || '').trim();
    return s.length > maxChars ? s.slice(0, maxChars - 1) + '…' : s;
  }

  function splitLines(text, maxChars) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    for (const w of words) {
      const test = current ? current + ' ' + w : w;
      if (test.length <= maxChars) current = test;
      else {
        if (current) lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawField(page, font, label, value, x, y, w, h, opts = {}) {
    page.drawRectangle({ x, y: y - h, width: w, height: h, borderWidth: 0.8, borderColor: rgb(.1,.1,.1) });
    page.drawText(label, { x: x + 4, y: y - 12, size: 7.2, font });
    const text = opts.date ? formatDateBR(value) : (opts.digits ? onlyDigits(value) : value);
    if (opts.multiline) {
      const lines = splitLines(text, opts.maxChars || 70).slice(0, opts.maxLines || 3);
      lines.forEach((line, i) => page.drawText(line, { x: x + 4, y: y - 24 - i * 11, size: 9.3, font }));
    } else {
      page.drawText(fitText(text, opts.maxChars || Math.floor(w / 5.7)), { x: x + 4, y: y - h + 8, size: 9.4, font });
    }
  }

  function drawVertical(page, font, text, y, h) {
    page.drawRectangle({ x: M, y: y - h, width: SIDE, height: h, borderWidth: 0.9, borderColor: rgb(.1,.1,.1) });
    page.drawText(text, { x: M + 8, y: y - h + 12, size: 9, font, rotate: degrees(90) });
  }

  async function exportPDF() {
    exportBtn.disabled = true;
    exportBtn.textContent = 'Gerando PDF...';
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([A4_W, A4_H]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      page.drawRectangle({ x: 14, y: 14, width: A4_W - 28, height: A4_H - 28, borderWidth: 1, borderColor: rgb(0,0,0) });

      // Header
      const headerY = A4_H - 28;
      page.drawRectangle({ x: M, y: headerY - 62, width: 170, height: 62, borderWidth: 0.9, borderColor: rgb(0,0,0) });
      page.drawRectangle({ x: M + 170, y: headerY - 62, width: 290, height: 62, borderWidth: 0.9, borderColor: rgb(0,0,0) });
      page.drawRectangle({ x: A4_W - M - 84, y: headerY - 62, width: 84, height: 62, borderWidth: 0.9, borderColor: rgb(0,0,0) });
      page.drawText('República Federativa do Brasil', { x: M + 14, y: headerY - 18, size: 8.6, font: bold });
      page.drawText('Ministério da Saúde', { x: M + 34, y: headerY - 31, size: 8.4, font: bold });
      page.drawText('SINAN', { x: M + 58, y: headerY - 48, size: 14, font: bold });
      page.drawText('SISTEMA DE INFORMAÇÃO DE AGRAVOS DE NOTIFICAÇÃO', { x: M + 190, y: headerY - 21, size: 8.4, font: bold });
      page.drawText('FICHA DE INVESTIGAÇÃO DE SURTO', { x: M + 228, y: headerY - 42, size: 12, font: bold });
      page.drawText('Nº', { x: A4_W - M - 72, y: headerY - 18, size: 8.5, font: bold });
      page.drawText(fitText(val('numero_notificacao'), 14), { x: A4_W - M - 72, y: headerY - 43, size: 10, font });

      let y = headerY - 74;

      // Dados Gerais
      const sec1H = 96;
      drawVertical(page, bold, 'Dados Gerais', y, sec1H);
      const c1 = CONTENT_X;
      const w1 = CONTENT_W;
      drawField(page, font, '1 Tipo de Notificação', '3 - Surto', c1, y, 110, 32);
      drawField(page, font, '2 Agravo/doença', val('agravo_doenca'), c1 + 110, y, 220, 32);
      drawField(page, font, '3 Data da Notificação', val('data_notificacao'), c1 + 330, y, 96, 32, { date: true, maxChars: 10 });
      drawField(page, font, '4 UF', val('uf_notificacao').toUpperCase(), c1 + 426, y, 40, 32, { maxChars: 2 });
      drawField(page, font, '5 Município de Notificação', val('municipio_notificacao'), c1, y - 32, 250, 32);
      drawField(page, font, 'Código (IBGE)', val('ibge_notificacao'), c1 + 250, y - 32, 86, 32, { digits: true });
      drawField(page, font, 'Código (CID10)', val('cid10'), c1 + 336, y - 32, 130, 32);
      drawField(page, font, '6 Unidade de Saúde (ou outra fonte notificadora)', val('unidade_notificadora'), c1, y - 64, 340, 32);
      drawField(page, font, 'Código', val('codigo_unidade'), c1 + 340, y - 64, 126, 32, { digits: true });
      y -= sec1H + 6;

      // Notificação de Surto
      const sec2H = 96;
      drawVertical(page, bold, 'Notificação de Surto', y, sec2H);
      drawField(page, font, '7 Data dos 1os Sintomas do 1º Caso Suspeito', val('data_primeiros_sintomas'), CONTENT_X, y, 170, 40, { date: true });
      drawField(page, font, '8 Nº de Casos Suspeitos / Expostos\naté a Data da Notificação', val('numero_casos_suspeitos'), CONTENT_X + 170, y, 160, 40, { digits: true, maxChars: 6 });
      drawField(page, font, '9 Local Inicial de Ocorrência do Surto', val('local_inicial_surto'), CONTENT_X, y - 40, CONTENT_W, 28, { maxChars: 80 });
      drawField(page, font, 'Especificar (quando for Outros)', val('local_inicial_surto_outros'), CONTENT_X, y - 68, CONTENT_W, 28, { maxChars: 80 });
      y -= sec2H + 6;

      // Dados de Ocorrência
      const sec3H = 160;
      drawVertical(page, bold, 'Dados de Ocorrência', y, sec3H);
      drawField(page, font, '10 UF', val('uf_residencia').toUpperCase(), CONTENT_X, y, 40, 32, { maxChars: 2 });
      drawField(page, font, '11 Município de Residência', val('municipio_residencia'), CONTENT_X + 40, y, 190, 32);
      drawField(page, font, 'Código (IBGE)', val('ibge_residencia'), CONTENT_X + 230, y, 86, 32, { digits: true });
      drawField(page, font, '12 Distrito', val('distrito_residencia'), CONTENT_X + 316, y, 150, 32);
      drawField(page, font, '13 Bairro', val('bairro_residencia'), CONTENT_X, y - 32, 110, 32);
      drawField(page, font, '14 Logradouro (rua, avenida,...)', val('logradouro_residencia'), CONTENT_X + 110, y - 32, 220, 32);
      drawField(page, font, 'Código', val('codigo_logradouro'), CONTENT_X + 330, y - 32, 60, 32, { digits: true });
      drawField(page, font, '15 Número', val('numero_residencia'), CONTENT_X + 390, y - 32, 76, 32, { maxChars: 12 });
      drawField(page, font, '16 Complemento (apto., casa, ...)', val('complemento_residencia'), CONTENT_X, y - 64, 180, 32);
      drawField(page, font, '17 Geo campo 1', val('geo1'), CONTENT_X + 180, y - 64, 90, 32);
      drawField(page, font, '18 Geo campo 2', val('geo2'), CONTENT_X + 270, y - 64, 90, 32);
      drawField(page, font, '19 Ponto de Referência', val('ponto_referencia'), CONTENT_X + 360, y - 64, 106, 32);
      drawField(page, font, '20 CEP', val('cep'), CONTENT_X, y - 96, 90, 32, { digits: true });
      drawField(page, font, '21 (DDD) Telefone', val('telefone'), CONTENT_X + 90, y - 96, 130, 32, { digits: true });
      drawField(page, font, '22 Zona', val('zona_residencia'), CONTENT_X + 220, y - 96, 120, 32);
      drawField(page, font, '23 País (se residente fora do Brasil)', val('pais_residente_fora'), CONTENT_X + 340, y - 96, 126, 32);
      y -= sec3H + 6;

      // Situação Inicial
      const sec4H = 96;
      drawVertical(page, bold, 'Situação Inicial', y, sec4H);
      drawField(page, font, '24 Data da Investigação', val('data_investigacao'), CONTENT_X, y, 130, 32, { date: true });
      drawField(page, font, '25 Modo Provável da Transmissão', val('modo_transmissao'), CONTENT_X + 130, y, 336, 32, { maxChars: 70 });
      drawField(page, font, '26 Se indireta, qual o veículo de transmissão provável', val('veiculo_transmissao'), CONTENT_X, y - 32, 300, 32, { maxChars: 58 });
      drawField(page, font, 'Especificar (quando for Outro)', val('veiculo_transmissao_outros'), CONTENT_X + 300, y - 32, 166, 32, { maxChars: 30 });
      y -= sec4H + 6;

      // Observações
      const obsH = 78;
      page.drawRectangle({ x: CONTENT_X, y: y - obsH, width: CONTENT_W, height: obsH, borderWidth: 0.9, borderColor: rgb(0,0,0) });
      page.drawText('Observações', { x: CONTENT_X + 4, y: y - 12, size: 7.4, font: bold });
      const obsLines = splitLines(val('observacoes'), 80).slice(0, 5);
      obsLines.forEach((line, i) => page.drawText(line, { x: CONTENT_X + 4, y: y - 28 - i * 11, size: 9.3, font }));
      y -= obsH + 6;

      // Investigador
      const invH = 58;
      drawVertical(page, bold, 'Investigador', y, invH);
      drawField(page, font, 'Município/Unidade de Saúde', val('notificante_municipio_unidade'), CONTENT_X, y, 240, 28);
      drawField(page, font, 'Código da Unid. de Saúde', val('codigo_unid_saude'), CONTENT_X + 240, y, 226, 28, { digits: true });
      drawField(page, font, 'Nome', val('notificante_nome'), CONTENT_X, y - 28, 180, 30);
      drawField(page, font, 'Função', val('notificante_funcao'), CONTENT_X + 180, y - 28, 140, 30);
      drawField(page, font, 'Assinatura', val('notificante_assinatura'), CONTENT_X + 320, y - 28, 146, 30);
      page.drawText('Surto', { x: CONTENT_X, y: 22, size: 8, font });
      page.drawText('Sinan NET', { x: CONTENT_X + 190, y: 22, size: 8, font });
      page.drawText('SVS 29/05/2006', { x: CONTENT_X + 374, y: 22, size: 8, font });

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ficha-investigacao-surto-${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o PDF.');
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Exportar PDF';
    }
  }

  function fillSample() {
    form.elements['numero_notificacao'].value = '20260320001';
    form.elements['agravo_doenca'].value = 'Doença diarreica aguda';
    form.elements['data_notificacao'].value = '2026-03-20';
    form.elements['uf_notificacao'].value = 'PA';
    form.elements['municipio_notificacao'].value = 'Santarém';
    form.elements['ibge_notificacao'].value = '150680';
    form.elements['cid10'].value = 'A09';
    form.elements['unidade_notificadora'].value = 'UBS Central';
    form.elements['codigo_unidade'].value = '1234567';
    form.elements['data_primeiros_sintomas'].value = '2026-03-18';
    form.elements['numero_casos_suspeitos'].value = '12';
    form.elements['local_inicial_surto'].value = '3 - Creche / Escola';
    form.elements['uf_residencia'].value = 'PA';
    form.elements['municipio_residencia'].value = 'Santarém';
    form.elements['ibge_residencia'].value = '150680';
    form.elements['distrito_residencia'].value = 'Sede';
    form.elements['bairro_residencia'].value = 'Centro';
    form.elements['logradouro_residencia'].value = 'Rua Exemplo';
    form.elements['codigo_logradouro'].value = '123';
    form.elements['numero_residencia'].value = '120';
    form.elements['complemento_residencia'].value = 'Casa';
    form.elements['geo1'].value = '-2.4385';
    form.elements['geo2'].value = '-54.6996';
    form.elements['ponto_referencia'].value = 'Próximo à praça';
    form.elements['cep'].value = '68005000';
    form.elements['telefone'].value = '93991234567';
    form.elements['zona_residencia'].value = '1 - Urbana';
    form.elements['data_investigacao'].value = '2026-03-20';
    form.elements['modo_transmissao'].value = '2 - Indireta (Veículo comum ou Vetor)';
    form.elements['veiculo_transmissao'].value = '1 - Alimento/Água';
    form.elements['observacoes'].value = 'Surto com concentração inicial em ambiente escolar, com investigação iniciada no mesmo dia da notificação e orientação imediata à unidade local.';
    form.elements['notificante_municipio_unidade'].value = 'Santarém / Vigilância Epidemiológica';
    form.elements['codigo_unid_saude'].value = '7654321';
    form.elements['notificante_nome'].value = 'Profissional Exemplo';
    form.elements['notificante_funcao'].value = 'Enfermeiro';
    form.elements['notificante_assinatura'].value = 'Assinado digitalmente';
  }

  clearBtn?.addEventListener('click', () => form.reset());
  fillSampleBtn?.addEventListener('click', fillSample);
  exportBtn?.addEventListener('click', exportPDF);
})();
