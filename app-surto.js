
(() => {
  const BASE_PDF_URL = 'Notificacao_Individual_v5.pdf';
  const PDF_W = 595;
  const PDF_H = 841;
  const IMG_W = 1240;
  const IMG_H = 1753;

  const px = (x) => (x / IMG_W) * PDF_W;
  const py = (y, size = 10) => PDF_H - (y / IMG_H) * PDF_H - size;

  const form = document.getElementById('notificationForm');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const fillSampleBtn = document.getElementById('fillSampleBtn');

  function getField(name) {
    return form.elements[name];
  }

  function getValue(name) {
    const field = getField(name);
    if (!field) return '';
    if (field.type === 'radio') {
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    }
    return String(field.value || '').trim();
  }

  function setValue(name, value) {
    const field = getField(name);
    if (!field) return;
    if (field instanceof RadioNodeList) {
      const target = Array.from(field).find((input) => input.value === value);
      if (target) target.checked = true;
      return;
    }
    field.value = value;
  }

  function formatDateBR(value) {
    if (!value) return '';
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return value;
    return `${match[3]}${match[2]}${match[1]}`;
  }

  function onlyDigits(value) {
    return String(value || '').replace(/\D+/g, '');
  }

  function optionCode(value) {
    const match = String(value || '').match(/^(\d+|[MFI])/i);
    return match ? match[1].toUpperCase() : '';
  }

  function mapSexoCode(value) {
    const code = optionCode(value);
    if (code === 'M') return 'M';
    if (code === 'F') return 'F';
    if (code === 'I') return 'I';
    return '';
  }

  function createHelpers(page, font, bold) {
    return {
      text(x, y, value, size = 10, maxWidth) {
        const text = String(value || '').trim();
        if (!text) return;
        const options = { x: px(x), y: py(y, size), size, font };
        if (maxWidth) options.maxWidth = px(maxWidth);
        page.drawText(text, options);
      },
      chars(x, y, value, boxWidth, size = 10, limit) {
        const text = String(value || '').trim();
        if (!text) return;
        const chars = Array.from(limit ? text.slice(0, limit) : text);
        chars.forEach((ch, idx) => {
          page.drawText(ch, {
            x: px(x + idx * boxWidth),
            y: py(y, size),
            size,
            font,
          });
        });
      },
      boxCode(x, y, value, boxWidth = 31, size = 10, limit) {
        this.chars(x, y, value, boxWidth, size, limit);
      },
      check(x, y, size = 11) {
        page.drawText('X', { x: px(x), y: py(y, size), size, font: bold });
      }
    };
  }

  async function exportOfficialPdf() {
    try {
      exportBtn.disabled = true;
      exportBtn.textContent = 'Gerando PDF...';

      const existingPdfBytes = await fetch(BASE_PDF_URL).then((res) => {
        if (!res.ok) throw new Error('Arquivo base do PDF oficial não encontrado.');
        return res.arrayBuffer();
      });

      const { PDFDocument, StandardFonts } = PDFLib;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const p1 = createHelpers(pages[0], font, bold);
      const p2 = createHelpers(pages[1], font, bold);

      const val = getValue;

      // PÁGINA 1
      p1.text(946, 101, val('numero_notificacao'), 10, 220);

      const tipo = optionCode(val('tipo_notificacao'));
      const tipoMarks = { '1': [386, 149], '2': [508, 149], '3': [630, 149], '4': [777, 149] };
      if (tipoMarks[tipo]) p1.check(tipoMarks[tipo][0], tipoMarks[tipo][1], 11);

      p1.text(125, 193, val('agravo_doenca'), 10, 760);
      p1.boxCode(964, 194, formatDateBR(val('data_notificacao')), 31, 10, 8);

      p1.boxCode(115, 258, val('uf_notificacao').toUpperCase(), 31, 10, 2);
      p1.text(205, 258, val('municipio_notificacao'), 10, 470);
      p1.boxCode(704, 258, onlyDigits(val('ibge_notificacao')), 31, 10, 6);

      p1.text(110, 319, val('unidade_notificadora'), 10, 600);
      p1.boxCode(735, 319, onlyDigits(val('codigo_unidade')), 31, 10, 6);

      p1.boxCode(966, 319, formatDateBR(val('data_primeiros_sintomas')), 31, 10, 8);
      p1.text(115, 382, val('nome_paciente'), 9, 650);
      p1.boxCode(972, 382, formatDateBR(val('data_nascimento')), 31, 10, 8);

      p1.boxCode(111, 448, onlyDigits(val('idade')), 31, 10, 3);
      const tipoIdade = optionCode(val('tipo_idade'));
      const tipoIdadeMarks = { '1': [233, 447], '2': [233, 471], '3': [233, 494], '4': [233, 519] };
      if (tipoIdadeMarks[tipoIdade]) p1.check(tipoIdadeMarks[tipoIdade][0], tipoIdadeMarks[tipoIdade][1], 10);

      const sexo = mapSexoCode(val('sexo'));
      const sexoMarks = { 'M': [411, 448], 'F': [411, 472], 'I': [411, 495] };
      if (sexoMarks[sexo]) p1.check(sexoMarks[sexo][0], sexoMarks[sexo][1], 10);

      const gest = optionCode(val('gestante'));
      const gestMarks = {
        '1': [531, 448], '2': [625, 448], '3': [759, 448],
        '4': [531, 473], '5': [759, 473], '6': [625, 495], '9': [531, 495],
      };
      if (gestMarks[gest]) p1.check(gestMarks[gest][0], gestMarks[gest][1], 10);

      const raca = optionCode(val('raca_cor'));
      const racaMarks = {
        '1': [979, 448], '2': [979, 472], '3': [1091, 448],
        '4': [979, 495], '5': [1091, 472], '9': [1091, 495],
      };
      if (racaMarks[raca]) p1.check(racaMarks[raca][0], racaMarks[raca][1], 10);

      const esc = optionCode(val('escolaridade'));
      if (esc) p1.text(140, 554, esc, 10, 30);

      p1.boxCode(122, 640, onlyDigits(val('cartao_sus')), 31, 10, 15);
      p1.text(500, 640, val('nome_mae'), 9, 500);

      p1.boxCode(112, 711, formatDateBR(val('data_primeiros_sintomas_caso_suspeito')), 31, 10, 8);
      p1.boxCode(113, 776, onlyDigits(val('numero_casos_suspeitos')), 31, 10, 6);

      const local = optionCode(val('local_inicial_surto'));
      const localMarks = {
        '1': [400, 746], '2': [618, 746], '3': [920, 746],
        '4': [400, 776], '5': [617, 776], '6': [920, 776],
        '7': [400, 807], '8': [617, 807], '9': [920, 807],
        '10': [617, 839], '11': [920, 839],
      };
      if (localMarks[local]) p1.check(localMarks[local][0], localMarks[local][1], 10);
      p1.text(952, 839, val('local_inicial_surto_outros'), 8, 160);

      p1.boxCode(112, 912, val('uf_residencia').toUpperCase(), 31, 10, 2);
      p1.text(190, 912, val('municipio_residencia'), 10, 470);
      p1.boxCode(668, 912, onlyDigits(val('ibge_residencia')), 31, 10, 6);
      p1.text(901, 912, val('distrito_residencia'), 10, 280);

      p1.text(110, 976, val('bairro_residencia'), 10, 280);
      p1.text(396, 976, val('logradouro_residencia'), 9, 480);
      p1.boxCode(1038, 976, onlyDigits(val('codigo_logradouro')), 31, 10, 5);

      p1.text(112, 1041, val('numero_residencia'), 10, 110);
      p1.text(245, 1041, val('complemento_residencia'), 10, 620);
      p1.text(883, 1041, val('geo1'), 10, 250);

      p1.text(112, 1104, val('geo2'), 10, 330);
      p1.text(439, 1104, val('ponto_referencia'), 10, 520);
      p1.boxCode(985, 1104, onlyDigits(val('cep')), 31, 10, 8);

      p1.boxCode(110, 1169, onlyDigits(val('telefone')), 31, 10, 10);

      const zona = optionCode(val('zona_residencia'));
      const zonaMarks = { '1': [701, 1168], '2': [797, 1168], '3': [701, 1197], '9': [797, 1197] };
      if (zonaMarks[zona]) p1.check(zonaMarks[zona][0], zonaMarks[zona][1], 10);
      p1.text(752, 1169, val('pais_residente_fora'), 10, 430);

      p1.text(122, 1246, val('notificante_municipio_unidade'), 9, 700);
      p1.text(120, 1310, val('notificante_nome'), 9, 300);
      p1.text(534, 1310, val('notificante_funcao'), 9, 300);
      p1.text(995, 1310, val('notificante_assinatura'), 9, 150);

      // PÁGINA 2
      p2.boxCode(145, 208, formatDateBR(val('data_coleta_sorologia')), 31, 10, 8);
      p2.boxCode(397, 208, formatDateBR(val('data_coleta_outra_amostra')), 31, 10, 8);
      p2.text(641, 208, val('tipo_exame'), 10, 560);

      const obito = optionCode(val('obito'));
      const obitoMarks = { '1': [201, 290], '2': [270, 290], '9': [344, 290] };
      if (obitoMarks[obito]) p2.check(obitoMarks[obito][0], obitoMarks[obito][1], 10);

      const contato = optionCode(val('contato_caso_semelhante'));
      const contatoMarks = { '1': [812, 290], '2': [880, 290], '9': [956, 290] };
      if (contatoMarks[contato]) p2.check(contatoMarks[contato][0], contatoMarks[contato][1], 10);

      const exantema = optionCode(val('presenca_exantema'));
      const exaMarks = { '1': [203, 376], '2': [272, 376], '9': [345, 376] };
      if (exaMarks[exantema]) p2.check(exaMarks[exantema][0], exaMarks[exantema][1], 10);

      p2.boxCode(481, 376, formatDateBR(val('data_inicio_exantema')), 31, 10, 8);

      const petequias = optionCode(val('petequias_hemorragicas'));
      const petMarks = { '1': [868, 376], '2': [937, 376], '9': [1011, 376] };
      if (petMarks[petequias]) p2.check(petMarks[petequias][0], petMarks[petequias][1], 10);

      const liquor = optionCode(val('liquor'));
      const liquorMarks = { '1': [167, 460], '2': [236, 460], '9': [309, 460] };
      if (liquorMarks[liquor]) p2.check(liquorMarks[liquor][0], liquorMarks[liquor][1], 10);

      p2.text(464, 460, val('resultado_bacterioscopia'), 10, 720);

      const vacina = optionCode(val('tomou_vacina'));
      const vacMarks = { '1': [198, 548], '2': [267, 548], '9': [342, 548] };
      if (vacMarks[vacina]) p2.check(vacMarks[vacina][0], vacMarks[vacina][1], 10);

      p2.boxCode(395, 548, formatDateBR(val('data_ultima_dose')), 31, 10, 8);

      const hosp = optionCode(val('hospitalizacao'));
      const hospMarks = { '1': [681, 548], '2': [750, 548], '9': [824, 548] };
      if (hospMarks[hosp]) p2.check(hospMarks[hosp][0], hospMarks[hosp][1], 10);

      p2.boxCode(978, 548, formatDateBR(val('data_hospitalizacao')), 31, 10, 8);
      p2.boxCode(126, 637, val('uf_hospital').toUpperCase(), 31, 10, 2);
      p2.text(198, 637, val('municipio_hospital'), 10, 305);
      p2.boxCode(483, 637, onlyDigits(val('ibge_hospital')), 31, 10, 6);
      p2.text(704, 637, val('nome_hospital'), 10, 320);
      p2.boxCode(1034, 637, onlyDigits(val('codigo_hospital')), 31, 10, 5);

      p2.text(385, 850, val('hipotese_diagnostica_1'), 10, 790);
      p2.text(385, 922, val('hipotese_diagnostica_2'), 10, 790);

      p2.text(155, 1033, val('pais_infeccao'), 10, 430);
      p2.boxCode(678, 1033, val('uf_infeccao').toUpperCase(), 31, 10, 2);
      p2.text(815, 1033, val('municipio_infeccao'), 10, 380);
      p2.text(182, 1115, val('distrito_infeccao'), 10, 390);
      p2.text(816, 1115, val('bairro_infeccao'), 10, 380);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `ficha-surto-oficial-${new Date().toISOString().slice(0, 10)}.pdf`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) {
      console.error(error);
      alert('Não foi possível gerar o PDF oficial. Verifique se o arquivo base Notificacao_Individual_v5.pdf está na mesma pasta do HTML.');
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = 'Exportar PDF oficial';
    }
  }

  function clearForm() {
    form.reset();
  }

  function fillSample() {
    setValue('tipo_notificacao', '3 - Surto');
    setValue('agravo_doenca', 'Doença diarreica aguda');
    setValue('data_notificacao', '2026-03-20');
    setValue('uf_notificacao', 'PA');
    setValue('municipio_notificacao', 'Santarém');
    setValue('ibge_notificacao', '150680');
    setValue('unidade_notificadora', 'UBS Central');
    setValue('codigo_unidade', '123456');
    setValue('data_primeiros_sintomas', '2026-03-18');
    setValue('nome_paciente', 'PACIENTE EXEMPLO');
    setValue('data_nascimento', '2010-08-12');
    setValue('idade', '15');
    setValue('tipo_idade', '4 - Ano');
    setValue('sexo', 'M - Masculino');
    setValue('gestante', '6 - Não se aplica');
    setValue('raca_cor', '4 - Parda');
    setValue('escolaridade', '6 - Ensino médio completo (antigo colegial ou 2º grau)');
    setValue('cartao_sus', '123456789012345');
    setValue('nome_mae', 'RESPONSÁVEL EXEMPLO');
    setValue('data_primeiros_sintomas_caso_suspeito', '2026-03-17');
    setValue('numero_casos_suspeitos', '12');
    setValue('local_inicial_surto', '3 - Creche / Escola');
    setValue('uf_residencia', 'PA');
    setValue('municipio_residencia', 'Santarém');
    setValue('ibge_residencia', '150680');
    setValue('distrito_residencia', 'Sede');
    setValue('bairro_residencia', 'Centro');
    setValue('logradouro_residencia', 'Rua Exemplo');
    setValue('numero_residencia', '120');
    setValue('complemento_residencia', 'Casa');
    setValue('cep', '68005000');
    setValue('telefone', '93991234567');
    setValue('zona_residencia', '1 - Urbana');
    setValue('notificante_municipio_unidade', 'Secretaria Municipal de Saúde');
    setValue('notificante_nome', 'Profissional Exemplo');
    setValue('notificante_funcao', 'Enfermeiro');
    setValue('notificante_assinatura', 'Assinado');
    setValue('data_coleta_sorologia', '2026-03-20');
    setValue('tipo_exame', 'Coprocultura');
    setValue('obito', '2 - Não');
    setValue('contato_caso_semelhante', '1 - Sim');
    setValue('presenca_exantema', '2 - Não');
    setValue('petequias_hemorragicas', '2 - Não');
    setValue('liquor', '2 - Não');
    setValue('hospitalizacao', '2 - Não');
    setValue('hipotese_diagnostica_1', 'A09 - Diarreia e gastroenterite de origem infecciosa presumível');
    setValue('pais_infeccao', 'Brasil');
    setValue('uf_infeccao', 'PA');
    setValue('municipio_infeccao', 'Santarém');
    setValue('distrito_infeccao', 'Sede');
    setValue('bairro_infeccao', 'Centro');
  }

  exportBtn?.addEventListener('click', exportOfficialPdf);
  clearBtn?.addEventListener('click', clearForm);
  fillSampleBtn?.addEventListener('click', fillSample);
})();
