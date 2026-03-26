(() => {
  const BASE_PDF_URL = 'Investigacao_surto_v5.pdf';
  const PDF_W = 595;
  const PDF_H = 841;
  const IMG_W = 1240;
  const IMG_H = 1753;
  const OFFSET_X = -6;
  const OFFSET_Y = -28;

  const px = (x) => ((x + OFFSET_X) / IMG_W) * PDF_W;
  const py = (y, size = 10) => PDF_H - ((y + OFFSET_Y) / IMG_H) * PDF_H - size;

  const form = document.getElementById('notificationForm');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const fillSampleBtn = document.getElementById('fillSampleBtn');
  const toggleGridBtn = document.getElementById('toggleGridBtn');
  let debugGrid = false;

  function getField(name) {
    return form?.elements?.[name];
  }

  function getValue(name) {
    const field = getField(name);
    if (!field) return '';
    if (field instanceof RadioNodeList) {
      const checked = Array.from(field).find((item) => item.checked);
      return checked ? checked.value : '';
    }
    return String(field.value || '').trim();
  }

  function setValue(name, value) {
    const field = getField(name);
    if (!field) return;
    if (field instanceof RadioNodeList) {
      const target = Array.from(field).find((item) => item.value === value);
      if (target) target.checked = true;
      return;
    }
    field.value = value;
  }

  function onlyDigits(value) {
    return String(value || '').replace(/\D+/g, '');
  }

  function optionCode(value) {
    const match = String(value || '').match(/^(\d+|[MFI])/i);
    return match ? match[1].toUpperCase() : '';
  }

  function formatDateBR(value) {
    if (!value) return '';
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return value;
    return `${match[3]}${match[2]}${match[1]}`;
  }

  function wrapText(text, maxChars) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (test.length <= maxChars) {
        current = test;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawDebugGrid(page, font, pageLabel) {
    const { rgb } = PDFLib;
    const width = page.getWidth();
    const height = page.getHeight();
    const step = 36;
    const majorStep = 72;

    for (let x = 0; x <= width; x += step) {
      const isMajor = x % majorStep === 0;
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: height },
        thickness: isMajor ? 0.8 : 0.35,
        color: isMajor ? rgb(1, 0, 0) : rgb(1, 0.65, 0.65),
        opacity: isMajor ? 0.45 : 0.22,
      });
    }

    for (let y = 0; y <= height; y += step) {
      const isMajor = y % majorStep === 0;
      page.drawLine({
        start: { x: 0, y },
        end: { x: width, y },
        thickness: isMajor ? 0.8 : 0.35,
        color: isMajor ? rgb(0, 0, 1) : rgb(0.6, 0.75, 1),
        opacity: isMajor ? 0.45 : 0.22,
      });
    }

    page.drawText(`GRADE DEBUG ATIVA - ${pageLabel}`, {
      x: 10,
      y: height - 16,
      size: 9,
      font,
      color: rgb(0.5, 0.2, 0),
    });
  }

  function createHelpers(page, font, bold) {
    return {
      text(x, y, value, size = 10, maxChars = 999) {
        const text = String(value || '').trim();
        if (!text) return;
        page.drawText(text.slice(0, maxChars), {
          x: px(x),
          y: py(y, size),
          size,
          font,
        });
      },
      chars(x, y, value, boxWidth = 31, size = 10, limit = 8) {
        const text = String(value || '').trim();
        if (!text) return;
        Array.from(text.slice(0, limit)).forEach((ch, idx) => {
          page.drawText(ch, {
            x: px(x + idx * boxWidth),
            y: py(y, size),
            size,
            font,
          });
        });
      },
      code(x, y, value, limit = 8) {
        this.chars(x, y, value, 31, 10, limit);
      },
      check(x, y, size = 11) {
        page.drawText('X', {
          x: px(x),
          y: py(y, size),
          size,
          font: bold,
        });
      },
      paragraph(x, y, text, widthChars = 120, maxLines = 10, size = 10, lineGap = 26) {
        const lines = wrapText(text, widthChars).slice(0, maxLines);
        lines.forEach((line, idx) => {
          page.drawText(line, {
            x: px(x),
            y: py(y + idx * lineGap, size),
            size,
            font,
          });
        });
      },
    };
  }

  async function exportOfficialPdf() {
    try {
      exportBtn.disabled = true;
      exportBtn.textContent = 'Gerando PDF...';

      const existingPdfBytes = await fetch(BASE_PDF_URL).then((res) => {
        if (!res.ok) throw new Error('PDF base não encontrado.');
        return res.arrayBuffer();
      });

      const { PDFDocument, StandardFonts } = PDFLib;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      if (!pages.length) throw new Error('PDF sem páginas.');
      const page = pages[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      if (debugGrid) drawDebugGrid(page, font, 'PAGINA 1');
      const p = createHelpers(page, font, bold);
      const val = getValue;

      p.text(946, 82, val('numero_notificacao'), 10, 20);

      const tipo = optionCode(val('tipo_notificacao'));
      const tipoMarks = { '1': [391, 130], '2': [509, 130], '3': [631, 130], '4': [777, 130] };
      if (tipoMarks[tipo]) p.check(tipoMarks[tipo][0], tipoMarks[tipo][1], 11);

      p.text(125, 173, val('agravo_doenca'), 10, 62);
      p.text(826, 173, val('cid10'), 10, 10);
      p.code(966, 174, formatDateBR(val('data_notificacao')), 8);

      p.code(115, 238, String(val('uf_notificacao')).toUpperCase(), 2);
      p.text(204, 238, val('municipio_notificacao'), 10, 30);
      p.code(979, 236, onlyDigits(val('ibge_notificacao')), 6);

      p.text(110, 299, val('unidade_notificadora'), 10, 48);
      p.code(695, 299, onlyDigits(val('codigo_unidade')), 6);
      p.code(966, 299, formatDateBR(val('data_primeiros_sintomas')), 8);

      p.code(520, 362, onlyDigits(val('numero_casos_suspeitos')), 4);
      const localCode = optionCode(val('local_inicial_surto'));
      p.text(120, 440, localCode ? `${localCode} - ${val('local_inicial_surto').replace(/^\d+\s*-\s*/, '')}` : '', 10, 100);
      if (localCode === '11') {
        p.text(625, 468, val('local_inicial_surto_outros'), 10, 32);
      }

      p.code(112, 540, String(val('uf_residencia')).toUpperCase(), 2);
      p.text(186, 540, val('municipio_residencia'), 10, 28);
      p.code(674, 540, onlyDigits(val('ibge_residencia')), 6);
      p.text(888, 540, val('distrito_residencia'), 10, 20);

      p.text(110, 607, val('bairro_residencia'), 10, 18);
      p.text(430, 607, val('logradouro_residencia'), 10, 28);
      p.code(1067, 607, onlyDigits(val('codigo_logradouro')), 5);

      p.text(112, 672, val('numero_residencia'), 10, 8);
      p.text(222, 672, val('complemento_residencia'), 10, 34);
      p.text(904, 672, val('geo1'), 10, 16);

      p.text(112, 736, val('geo2'), 10, 16);
      p.text(468, 736, val('ponto_referencia'), 10, 28);
      p.code(1008, 736, onlyDigits(val('cep')), 8);

      p.code(110, 800, onlyDigits(val('telefone')), 10);
      const zonaCode = optionCode(val('zona_residencia'));
      p.text(476, 803, zonaCode || '', 12, 2);
      p.text(760, 800, val('pais_residente_fora'), 10, 22);

      p.code(118, 938, formatDateBR(val('data_investigacao')), 8);
      const modoCode = optionCode(val('modo_transmissao'));
      p.text(1182, 938, modoCode || '', 12, 2);
      const veicCode = optionCode(val('veiculo_transmissao'));
      p.text(1182, 1013, veicCode || '', 12, 2);
      if (veicCode === '6') {
        p.text(292, 1042, val('veiculo_transmissao_outro'), 10, 24);
      }

      p.paragraph(40, 1100, val('observacoes'), 120, 12, 10, 38);

      p.text(120, 1590, val('investigador_municipio_unidade'), 10, 48);
      p.code(986, 1590, onlyDigits(val('investigador_codigo_unidade')), 6);
      p.text(120, 1677, val('investigador_nome'), 10, 24);
      p.text(512, 1677, val('investigador_funcao'), 10, 20);
      p.text(890, 1677, val('investigador_assinatura'), 10, 18);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${debugGrid ? 'ficha-surto-debug' : 'ficha-investigacao-surto'}-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) {
      console.error(error);
      alert('Não foi possível gerar o PDF oficial. Verifique se o arquivo Investigacao_surto_v5.pdf está na mesma pasta do HTML.');
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Exportar PDF oficial';
    }
  }

  function clearForm() {
    form.reset();
  }

  function fillSample() {
    setValue('numero_notificacao', '2026032601');
    setValue('tipo_notificacao', '3 - Surto');
    setValue('agravo_doenca', 'Doença diarreica aguda');
    setValue('cid10', 'A09');
    setValue('data_notificacao', '2026-03-20');
    setValue('uf_notificacao', 'PA');
    setValue('municipio_notificacao', 'Santarém');
    setValue('ibge_notificacao', '1506807');
    setValue('unidade_notificadora', 'UBS Central');
    setValue('codigo_unidade', '123456');
    setValue('data_primeiros_sintomas', '2026-03-18');
    setValue('numero_casos_suspeitos', '12');
    setValue('local_inicial_surto', '3 - Creche / Escola');
    setValue('local_inicial_surto_outros', '');
    setValue('uf_residencia', 'PA');
    setValue('municipio_residencia', 'Santarém');
    setValue('ibge_residencia', '1506807');
    setValue('distrito_residencia', 'Sede');
    setValue('bairro_residencia', 'Centro');
    setValue('logradouro_residencia', 'Rua Exemplo');
    setValue('codigo_logradouro', '12345');
    setValue('numero_residencia', '120');
    setValue('complemento_residencia', 'Casa');
    setValue('geo1', '-2.4385');
    setValue('geo2', '-54.6996');
    setValue('ponto_referencia', 'Próximo à escola municipal');
    setValue('cep', '68005000');
    setValue('telefone', '93991234567');
    setValue('zona_residencia', '1 - Urbana');
    setValue('pais_residente_fora', '');
    setValue('data_investigacao', '2026-03-21');
    setValue('modo_transmissao', '2 - Indireta (Veículo comum ou Vetor)');
    setValue('veiculo_transmissao', '1 - Alimento / Água');
    setValue('veiculo_transmissao_outro', '');
    setValue('observacoes', 'Investigação iniciada após aumento de casos de diarreia em escolares. Há relato de consumo comum de alimento servido em evento escolar no dia anterior ao início dos sintomas. Equipe orientada para coleta de amostras e inspeção sanitária do local.');
    setValue('investigador_municipio_unidade', 'Secretaria Municipal de Saúde / Vigilância Epidemiológica');
    setValue('investigador_codigo_unidade', '654321');
    setValue('investigador_nome', 'Profissional Exemplo');
    setValue('investigador_funcao', 'Enfermeiro');
    setValue('investigador_assinatura', 'Profissional Exemplo');
  }

  toggleGridBtn?.addEventListener('click', () => {
    debugGrid = !debugGrid;
    toggleGridBtn.textContent = `Grade debug: ${debugGrid ? 'ligada' : 'desligada'}`;
    toggleGridBtn.classList.toggle('active', debugGrid);
  });

  fillSampleBtn?.addEventListener('click', fillSample);
  clearBtn?.addEventListener('click', clearForm);
  exportBtn?.addEventListener('click', exportOfficialPdf);
})();
