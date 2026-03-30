(() => {
  const form = document.getElementById('notificationForm');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const fillSampleBtn = document.getElementById('fillSampleBtn');

  function getValue(name) {
    const field = form.elements[name];
    return field ? String(field.value || '').trim() : '';
  }

  function setValue(name, value) {
    const field = form.elements[name];
    if (field) field.value = value;
  }

  function clearForm() {
    form.reset();
    setValue('tipo_notificacao', '3 - Surto');
  }

  function fillSample() {
    setValue('tipo_notificacao', '3 - Surto');
    setValue('agravo_doenca', 'Doença diarreica aguda');
    setValue('data_notificacao', '2026-03-20');
    setValue('uf_notificacao', 'PA');
    setValue('municipio_notificacao', 'Santarém');
    setValue('unidade_notificadora', 'UBS Central');
    setValue('codigo_unidade', '1234567');
    setValue('data_primeiros_sintomas', '2026-03-18');
    setValue('numero_casos_suspeitos', '12');
    setValue('numero_notificacao', '20260320001');
    setValue('local_inicial_surto', '3 - Creche / Escola');
    setValue('uf_residencia', 'PA');
    setValue('municipio_residencia', 'Santarém');
    setValue('ibge_residencia', '150680');
    setValue('distrito_residencia', 'Sede');
    setValue('bairro_residencia', 'Centro');
    setValue('logradouro_residencia', 'Rua Exemplo');
    setValue('codigo_logradouro', '123');
    setValue('numero_residencia', '120');
    setValue('complemento_residencia', 'Casa');
    setValue('geo1', '-2.4385');
    setValue('geo2', '-54.6996');
    setValue('ponto_referencia', 'Próximo à praça');
    setValue('cep', '68005000');
    setValue('telefone', '93991234567');
    setValue('zona_residencia', '1 - Urbana');
    setValue('pais_residente_fora', '');
    setValue('data_investigacao', '2026-03-20');
    setValue('modo_transmissao', '2 - Indireta (veículo comum ou vetor)');
    setValue('veiculo_transmissao', '1 - Alimento/Água');
    setValue('observacoes', 'Surto com concentração inicial em ambiente escolar, com investigação iniciada no mesmo dia da notificação e orientação imediata à unidade local.');
    setValue('invest_municipio_unidade', 'Santarém / Vigilância Epidemiológica');
    setValue('invest_codigo_unidade', '7654321');
    setValue('invest_nome', 'Profissional Exemplo');
    setValue('invest_funcao', 'Enfermeiro');
    setValue('invest_assinatura', 'Assinado digitalmente');
  }

  function onlyDigits(v) {
    return String(v || '').replace(/\D+/g, '');
  }

  function codeOf(v) {
    const m = String(v || '').match(/^(\d+)/);
    return m ? m[1] : '';
  }

  function formatDateBR(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || ''));
    return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
  }

  function drawText(page, text, x, y, opts = {}) {
    const content = String(text || '').trim();
    if (!content) return;
    page.drawText(content, {
      x, y,
      size: opts.size || 9,
      font: opts.font,
      maxWidth: opts.maxWidth,
      lineHeight: opts.lineHeight || 11,
      color: opts.color
    });
  }

  function drawBox(page, x, y, w, h, borderColor) {
    page.drawRectangle({ x, y, width: w, height: h, borderWidth: 1, borderColor });
  }

  function drawLabeledBox(page, label, x, y, w, h, font, bold, borderColor) {
    drawBox(page, x, y, w, h, borderColor);
    if (label) {
      drawText(page, label, x + 4, y + h - 12, { font: bold, size: 7.4, maxWidth: w - 8 });
    }
  }

  function drawSectionBar(page, title, x, y, w, h, font, borderColor) {
    page.drawRectangle({ x, y, width: w, height: h, borderWidth: 1, borderColor });
    drawText(page, title, x + 7, y + 6, { font, size: 7.5 });
  }

  function wrapText(text, maxChars) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (test.length > maxChars) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  async function exportPDF() {
    try {
      exportBtn.disabled = true;
      exportBtn.textContent = 'Gerando PDF...';

      const { PDFDocument, StandardFonts, rgb } = PDFLib;
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const border = rgb(0.25, 0.25, 0.25);

      const margin = 22;
      const contentW = 551;

      // Header
      drawText(page, 'República Federativa do Brasil', 24, 801, { font: bold, size: 10 });
      drawText(page, 'Ministério da Saúde', 60, 787, { font: bold, size: 10 });
      drawText(page, 'SINAN', 291, 795, { font: bold, size: 16 });
      drawText(page, 'SISTEMA DE INFORMAÇÃO DE AGRAVOS DE NOTIFICAÇÃO', 175, 779, { font, size: 8.5 });
      drawText(page, 'FICHA DE INVESTIGAÇÃO DE SURTO', 185, 763, { font: bold, size: 14 });

      page.drawRectangle({ x: 470, y: 780, width: 112, height: 24, color: rgb(0.86, 0.86, 0.86) });
      drawText(page, 'Nº', 478, 788, { font: bold, size: 10 });
      drawText(page, getValue('numero_notificacao'), 505, 788, { font, size: 9, maxWidth: 68 });

      // Vertical bars
      drawSectionBar(page, 'Dados Gerais', 18, 638, 28, 140, bold, border);
      drawSectionBar(page, 'Notificação de Surto', 18, 528, 28, 104, bold, border);
      drawSectionBar(page, 'Dados de Ocorrência', 18, 358, 28, 164, bold, border);
      drawSectionBar(page, 'Situação Inicial', 18, 246, 28, 106, bold, border);
      drawSectionBar(page, 'Investigador', 18, 20, 28, 70, bold, border);

      // Data boxes
      const x0 = 52;
      drawLabeledBox(page, '1 Tipo de Notificação', x0, 734, 463, 32, font, bold, border);
      drawText(page, '3 - Surto', 274, 744, { font, size: 11 });

      drawLabeledBox(page, '2 Agravo/doença', x0, 685, 318, 43, font, bold, border);
      drawText(page, getValue('agravo_doenca'), x0 + 6, 699, { font, size: 9, maxWidth: 305 });

      drawLabeledBox(page, '3 Data da Notificação', 373, 685, 157, 43, font, bold, border);
      drawText(page, formatDateBR(getValue('data_notificacao')), 425, 699, { font, size: 10 });

      drawLabeledBox(page, '4 UF', x0, 642, 50, 37, font, bold, border);
      drawText(page, getValue('uf_notificacao').toUpperCase(), 68, 654, { font, size: 10 });

      drawLabeledBox(page, '5 Município de Notificação', 106, 642, 318, 37, font, bold, border);
      drawText(page, getValue('municipio_notificacao'), 112, 654, { font, size: 9, maxWidth: 304 });

      drawLabeledBox(page, 'Código (IBGE)', 425, 642, 105, 37, font, bold, border);
      drawText(page, onlyDigits(getValue('ibge_notificacao')), 447, 654, { font, size: 10 });

      drawLabeledBox(page, '6 Unidade de Saúde (ou outra fonte notificadora)', x0, 592, 363, 43, font, bold, border);
      drawText(page, getValue('unidade_notificadora'), 58, 606, { font, size: 9, maxWidth: 350 });

      drawLabeledBox(page, 'Código', 416, 592, 114, 43, font, bold, border);
      drawText(page, onlyDigits(getValue('codigo_unidade')), 445, 606, { font, size: 10 });

      drawLabeledBox(page, '7 Data dos 1os Sintomas do 1º Caso Suspeito', 416, 543, 114, 43, font, bold, border);
      drawText(page, formatDateBR(getValue('data_primeiros_sintomas')), 430, 557, { font, size: 9 });

      drawLabeledBox(page, '8 Nº de Casos Suspeitos / Expostos até a Data da Notificação', x0, 543, 358, 43, font, bold, border);
      drawText(page, onlyDigits(getValue('numero_casos_suspeitos')), 220, 557, { font, size: 10 });

      drawLabeledBox(page, '9 Local Inicial de Ocorrência do Surto', x0, 470, 478, 66, font, bold, border);
      const localLines = [
        '1 - Residência                    2 - Hospital / Unidade de Saúde                    3 - Creche / Escola',
        '4 - Asilo                           5 - Outras Instituições (alojamento, trabalho)     6 - Restaurante / Padaria',
        '7 - Eventos                        8 - Casos Dispersos no Bairro                    9 - Casos Dispersos Pelo Município',
        '10 - Casos Dispersos em mais de um Município    11 - Outros'
      ];
      let yy = 506;
      localLines.forEach(line => {
        drawText(page, line, 58, yy, { font, size: 7.7 });
        yy -= 13;
      });
      drawText(page, `Selecionado: ${getValue('local_inicial_surto')}`, 58, 477, { font: bold, size: 8.2, maxWidth: 290 });
      if (getValue('local_inicial_outros')) {
        drawText(page, `Especificar: ${getValue('local_inicial_outros')}`, 345, 477, { font, size: 8, maxWidth: 170 });
      }

      drawLabeledBox(page, '10 UF', x0, 426, 50, 37, font, bold, border);
      drawText(page, getValue('uf_residencia').toUpperCase(), 68, 438, { font, size: 10 });

      drawLabeledBox(page, '11 Município de Residência', 106, 426, 255, 37, font, bold, border);
      drawText(page, getValue('municipio_residencia'), 112, 438, { font, size: 9, maxWidth: 240 });

      drawLabeledBox(page, 'Código (IBGE)', 362, 426, 100, 37, font, bold, border);
      drawText(page, onlyDigits(getValue('ibge_residencia')), 380, 438, { font, size: 10 });

      drawLabeledBox(page, '12 Distrito', 463, 426, 67, 37, font, bold, border);
      drawText(page, getValue('distrito_residencia'), 468, 438, { font, size: 8.5, maxWidth: 56 });

      drawLabeledBox(page, '13 Bairro', x0, 385, 133, 34, font, bold, border);
      drawText(page, getValue('bairro_residencia'), 58, 396, { font, size: 8.8, maxWidth: 122 });

      drawLabeledBox(page, '14 Logradouro (rua, avenida,...)', 186, 385, 240, 34, font, bold, border);
      drawText(page, getValue('logradouro_residencia'), 192, 396, { font, size: 8.6, maxWidth: 226 });

      drawLabeledBox(page, 'Código', 427, 385, 103, 34, font, bold, border);
      drawText(page, onlyDigits(getValue('codigo_logradouro')), 455, 396, { font, size: 10 });

      drawLabeledBox(page, '15 Número', x0, 344, 78, 34, font, bold, border);
      drawText(page, getValue('numero_residencia'), 58, 355, { font, size: 9.2, maxWidth: 68 });

      drawLabeledBox(page, '16 Complemento (apto., casa, ...)', 131, 344, 278, 34, font, bold, border);
      drawText(page, getValue('complemento_residencia'), 137, 355, { font, size: 8.7, maxWidth: 266 });

      drawLabeledBox(page, '17 Geo campo 1', 410, 344, 120, 34, font, bold, border);
      drawText(page, getValue('geo1'), 416, 355, { font, size: 8.8, maxWidth: 108 });

      drawLabeledBox(page, '18 Geo campo 2', x0, 303, 154, 34, font, bold, border);
      drawText(page, getValue('geo2'), 58, 314, { font, size: 8.8, maxWidth: 142 });

      drawLabeledBox(page, '19 Ponto de Referência', 207, 303, 204, 34, font, bold, border);
      drawText(page, getValue('ponto_referencia'), 213, 314, { font, size: 8.5, maxWidth: 192 });

      drawLabeledBox(page, '20 CEP', 412, 303, 118, 34, font, bold, border);
      drawText(page, onlyDigits(getValue('cep')), 444, 314, { font, size: 9.5 });

      drawLabeledBox(page, '21 (DDD) Telefone', x0, 262, 160, 34, font, bold, border);
      drawText(page, onlyDigits(getValue('telefone')), 58, 273, { font, size: 9, maxWidth: 148 });

      drawLabeledBox(page, '22 Zona', 213, 262, 163, 34, font, bold, border);
      drawText(page, '1 - Urbana   2 - Rural', 232, 274, { font, size: 8.4 });
      drawText(page, '3 - Periurbana   9 - Ignorado', 226, 262, { font, size: 8.4 });
      drawText(page, `Seleção: ${codeOf(getValue('zona_residencia')) || '-'}`, 304, 286, { font: bold, size: 7.5 });

      drawLabeledBox(page, '23 País (se residente fora do Brasil)', 379, 262, 151, 34, font, bold, border);
      drawText(page, getValue('pais_residente_fora'), 385, 273, { font, size: 8.6, maxWidth: 138 });

      drawLabeledBox(page, '24 Data da Investigação', x0, 212, 132, 37, font, bold, border);
      drawText(page, formatDateBR(getValue('data_investigacao')), 73, 224, { font, size: 9.4 });

      drawLabeledBox(page, '25 Modo Provável da Transmissão', 186, 212, 344, 37, font, bold, border);
      drawText(page, '1 - Direta (pessoa a pessoa)          2 - Indireta (Veículo comum ou Vetor)          9 - Ignorado', 192, 224, { font, size: 7.7 });
      drawText(page, `Selecionado: ${getValue('modo_transmissao') || '-'}`, 192, 214, { font: bold, size: 7.8, maxWidth: 320 });

      drawLabeledBox(page, '26 Se indireta, qual o veículo de transmissão provável', x0, 152, 478, 53, font, bold, border);
      drawText(page, '1 - Alimento/Água   2 - Recursos Hídricos Contaminados   3 - Vetor', 58, 182, { font, size: 7.8 });
      drawText(page, '4 - Produto   5 - Fômite   6 - Outro   9 - Ignorado', 58, 170, { font, size: 7.8 });
      drawText(page, `Selecionado: ${getValue('veiculo_transmissao') || '-'}`, 58, 158, { font: bold, size: 7.8, maxWidth: 250 });
      if (getValue('veiculo_outro')) {
        drawText(page, `Especificar: ${getValue('veiculo_outro')}`, 280, 158, { font, size: 7.8, maxWidth: 230 });
      }

      // Observações
      drawLabeledBox(page, 'Observações', 18, 96, 512, 50, font, bold, border);
      const obsLines = wrapText(getValue('observacoes'), 110).slice(0, 4);
      let obsY = 128;
      obsLines.forEach(line => {
        drawText(page, line, 25, obsY, { font, size: 8.2, maxWidth: 500 });
        obsY -= 11;
      });

      // Investigador
      drawLabeledBox(page, 'Município/Unidade de Saúde', 52, 58, 380, 30, font, bold, border);
      drawText(page, getValue('invest_municipio_unidade'), 58, 68, { font, size: 8.7, maxWidth: 368 });

      drawLabeledBox(page, 'Código da Unid. de Saúde', 437, 58, 93, 30, font, bold, border);
      drawText(page, onlyDigits(getValue('invest_codigo_unidade')), 448, 68, { font, size: 9 });

      drawLabeledBox(page, 'Nome', 52, 20, 170, 30, font, bold, border);
      drawText(page, getValue('invest_nome'), 58, 30, { font, size: 8.6, maxWidth: 158 });

      drawLabeledBox(page, 'Função', 227, 20, 140, 30, font, bold, border);
      drawText(page, getValue('invest_funcao'), 233, 30, { font, size: 8.6, maxWidth: 128 });

      drawLabeledBox(page, 'Assinatura', 372, 20, 158, 30, font, bold, border);
      drawText(page, getValue('invest_assinatura'), 378, 30, { font, size: 8.3, maxWidth: 146 });

      drawText(page, 'Surto', 22, 8, { font, size: 8.5 });
      drawText(page, 'Sinan NET', 274, 8, { font, size: 8.5 });
      drawText(page, 'SVS   29/05/2006', 438, 8, { font, size: 8.5 });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ficha-investigacao-surto-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) {
      console.error(error);
      alert('Não foi possível gerar o PDF.');
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Exportar PDF';
    }
  }

  clearBtn?.addEventListener('click', clearForm);
  fillSampleBtn?.addEventListener('click', fillSample);
  exportBtn?.addEventListener('click', exportPDF);

  clearForm();
})();