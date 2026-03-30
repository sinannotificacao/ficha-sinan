const form = document.getElementById('notificationForm');
const fillSampleBtn = document.getElementById('fillSampleBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');

function setValue(name, value) {
  const field = form.elements.namedItem(name);
  if (!field) return;

  if (field instanceof RadioNodeList) {
    const target = Array.from(field).find((item) => item.value === value);
    if (target) target.checked = true;
    return;
  }

  field.value = value;
}

function fillSample() {
  setValue('numero_notificacao', '2026-000145');
  setValue('tipo_notificacao', '2 - Individual');
  setValue('agravo_doenca', 'Dengue');
  setValue('data_notificacao', '2026-03-19');
  setValue('uf_notificacao', 'PA');
  setValue('municipio_notificacao', 'Belém');
  setValue('ibge_notificacao', '1501402');
  setValue('unidade_notificadora', 'Unidade Municipal de Saúde Central');
  setValue('codigo_unidade', '458721');
  setValue('data_primeiros_sintomas', '2026-03-16');
  setValue('nome_paciente', 'Maria da Silva');
  setValue('data_nascimento', '1994-08-12');
  setValue('idade', '31');
  setValue('tipo_idade', '4 - Ano');
  setValue('sexo', 'F - Feminino');
  setValue('gestante', '5 - Não');
  setValue('raca_cor', '4 - Parda');
  setValue('escolaridade', '6 - Ensino médio completo (antigo colegial ou 2º grau)');
  setValue('cartao_sus', '7060 1234 5678 9012');
  setValue('nome_mae', 'Joana da Silva');
  setValue('data_primeiros_sintomas_caso_suspeito', '2026-03-15');
  setValue('numero_casos_suspeitos', '5');
  setValue('local_inicial_surto', '7 - Eventos');
  setValue('local_inicial_surto_outros', '');
  setValue('uf_residencia', 'PA');
  setValue('municipio_residencia', 'Belém');
  setValue('ibge_residencia', '1501402');
  setValue('distrito_residencia', 'Entroncamento');
  setValue('bairro_residencia', 'Marco');
  setValue('logradouro_residencia', 'Avenida Almirante Barroso');
  setValue('codigo_logradouro', '002541');
  setValue('numero_residencia', '1345');
  setValue('complemento_residencia', 'Apto 202');
  setValue('geo1', '-1.4312');
  setValue('geo2', '-48.4754');
  setValue('ponto_referencia', 'Próximo à praça');
  setValue('cep', '66093-020');
  setValue('telefone', '(91) 98888-7766');
  setValue('zona_residencia', '1 - Urbana');
  setValue('pais_residente_fora', '');
  setValue('notificante_municipio_unidade', 'Belém / UMS Central');
  setValue('notificante_nome', 'Ana Souza');
  setValue('notificante_funcao', 'Enfermeira');
  setValue('notificante_assinatura', 'Ana Souza');
  setValue('data_coleta_sorologia', '2026-03-18');
  setValue('data_coleta_outra_amostra', '2026-03-19');
  setValue('tipo_exame', 'Sorologia IgM');
  setValue('obito', '2 - Não');
  setValue('contato_caso_semelhante', '1 - Sim');
  setValue('presenca_exantema', '2 - Não');
  setValue('data_inicio_exantema', '');
  setValue('petequias_hemorragicas', '2 - Não');
  setValue('liquor', '2 - Não');
  setValue('resultado_bacterioscopia', 'Não realizado');
  setValue('tomou_vacina', '9 - Ignorado');
  setValue('data_ultima_dose', '');
  setValue('hospitalizacao', '1 - Sim');
  setValue('data_hospitalizacao', '2026-03-18');
  setValue('uf_hospital', 'PA');
  setValue('municipio_hospital', 'Belém');
  setValue('ibge_hospital', '1501402');
  setValue('nome_hospital', 'Hospital Municipal de Referência');
  setValue('codigo_hospital', '224711');
  setValue('hipotese_diagnostica_1', 'A90 - Dengue [dengue clássico]');
  setValue('hipotese_diagnostica_2', 'B34.9 - Infecção viral não especificada');
  setValue('pais_infeccao', 'Brasil');
  setValue('uf_infeccao', 'PA');
  setValue('municipio_infeccao', 'Belém');
  setValue('distrito_infeccao', 'Sacramenta');
  setValue('bairro_infeccao', 'Telégrafo');
}

function clearForm() {
  form.reset();
}

function createPrintValue(text) {
  const box = document.createElement('div');
  box.className = 'print-value';
  const safeText = (text ?? '').toString().trim();
  box.textContent = safeText;
  if (!safeText) box.classList.add('empty');
  return box;
}

function replaceControlsForExport(root) {
  const controls = root.querySelectorAll('input, select, textarea');

  controls.forEach((control) => {
    const tag = control.tagName.toLowerCase();
    const type = (control.getAttribute('type') || '').toLowerCase();

    if (type === 'radio' || type === 'checkbox') {
      const mark = document.createElement('span');
      mark.textContent = control.checked ? (type === 'radio' ? '◉' : '☑') : (type === 'radio' ? '◯' : '☐');
      mark.style.fontWeight = '700';
      mark.style.marginRight = '8px';
      control.replaceWith(mark);
      return;
    }

    if (tag === 'select') {
      const selectedText = control.options[control.selectedIndex]?.text || '';
      control.replaceWith(createPrintValue(selectedText));
      return;
    }

    if (tag === 'textarea') {
      control.replaceWith(createPrintValue(control.value));
      return;
    }

    if (type === 'date') {
      control.replaceWith(createPrintValue(formatDate(control.value)));
      return;
    }

    control.replaceWith(createPrintValue(control.value));
  });
}

function formatDate(value) {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

async function exportPDF() {
  const source = document.getElementById('document');
  const clone = source.cloneNode(true);
  const wrapper = document.createElement('div');
  wrapper.className = 'export-clone';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  replaceControlsForExport(wrapper);

  const options = {
    margin: 0,
    filename: `ficha-notificacao-individual-${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    await html2pdf().set(options).from(wrapper).save();
  } finally {
    wrapper.remove();
  }
}

fillSampleBtn.addEventListener('click', fillSample);
clearBtn.addEventListener('click', clearForm);
exportBtn.addEventListener('click', exportPDF);
