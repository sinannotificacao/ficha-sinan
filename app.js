const form = document.getElementById('notificationForm');
const fillSampleBtn = document.getElementById('fillSampleBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');

function getField(name) {
  return form ? form.elements.namedItem(name) : null;
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

function setCheckedValue(name, value) {
  if (!form) return;
  const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function clearCheckboxGroup(name) {
  if (!form) return;
  form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = false;
  });
}

function fillSample() {
  if (!form) return;

  form.reset();

  setValue('tipo_notificacao', '2 - Individual');
  setValue('agravo', 'Violência interpessoal / autoprovocada');
  setValue('cid10', 'Y09');
  setValue('data_notificacao', '2026-03-19');
  setValue('uf_notificacao', 'PA');
  setValue('municipio_notificacao', 'Belém');
  setValue('ibge_notificacao', '1501402');

  setValue('unidade_notificadora', '1 - Unidade de saúde');
  setValue('nome_unidade_notificadora', 'Unidade Municipal de Saúde Central');
  setValue('codigo_unidade_notificadora', '458721');
  setValue('data_ocorrencia', '2026-03-18');
  setValue('unidade_saude', 'UMS Central');
  setValue('cnes', '1234567');

  setValue('nome_paciente', 'Maria da Silva');
  setValue('data_nascimento', '1994-08-12');
  setValue('idade', '31');
  setValue('tipo_idade', 'Ano');
  setValue('sexo', 'Feminino');
  setValue('gestante', 'Não');
  setValue('raca', 'Parda');
  setValue('escolaridade', 'Ensino médio completo');
  setValue('cartao_sus', '7060123456789012');
  setValue('nome_mae', 'Joana da Silva');

  setValue('uf_residencia', 'PA');
  setValue('municipio_residencia', 'Belém');
  setValue('ibge_residencia', '1501402');
  setValue('distrito_residencia', 'Entroncamento');
  setValue('bairro_residencia', 'Marco');
  setValue('logradouro_residencia', 'Avenida Almirante Barroso');
  setValue('codigo_logradouro_residencia', '002541');
  setValue('numero_residencia', '1345');
  setValue('complemento_residencia', 'Apto 202');
  setValue('geo1', '-1.4312');
  setValue('geo2', '-48.4754');
  setValue('referencia_residencia', 'Próximo à praça');
  setValue('cep', '66093020');
  setValue('telefone', '91988887766');
  setValue('zona_residencia', 'Urbana');
  setValue('pais', 'Brasil');

  setValue('nome_social', '');
  setValue('ocupacao', 'Auxiliar administrativa');
  setValue('estado_civil', 'Solteiro');
  setValue('orientacao', 'Heterossexual');
  setValue('genero', 'Não se aplica');
  setValue('deficiencia_transtorno', 'Não');

  setValue('uf_ocorrencia', 'PA');
  setValue('municipio_ocorrencia', 'Belém');
  setValue('ibge_ocorrencia', '1501402');
  setValue('distrito_ocorrencia', 'Sacramenta');
  setValue('bairro_ocorrencia', 'Telégrafo');
  setValue('logradouro_ocorrencia', 'Travessa Djalma Dutra');
  setValue('codigo_logradouro_ocorrencia', '003210');
  setValue('numero_ocorrencia', '88');
  setValue('complemento_ocorrencia', 'Casa');
  setValue('geo3', '-1.4550');
  setValue('geo4', '-48.4900');
  setValue('referencia_ocorrencia', 'Em frente ao mercado');
  setValue('zona_ocorrencia', 'Urbana');
  setValue('hora_ocorrencia', '21:30');
  setValue('local_ocorrencia', 'Residência');

  setValue('outras_vezes', 'Sim');
  setValue('lesao_autoprovocada', 'Não');

  clearCheckboxGroup('motivacao');
  clearCheckboxGroup('tipo_violencia');
  clearCheckboxGroup('meio_agressao');
  clearCheckboxGroup('violencia_sexual');
  clearCheckboxGroup('procedimento');
  clearCheckboxGroup('vinculo_autor');
  clearCheckboxGroup('encaminhamento');
  clearCheckboxGroup('tipo_deficiencia');

  setCheckedValue('tipo_violencia', 'Física');
  setCheckedValue('tipo_violencia', 'Psicológica / moral');
  setCheckedValue('meio_agressao', 'Força corporal / espancamento');
  setCheckedValue('vinculo_autor', 'Cônjuge');
  setCheckedValue('encaminhamento', 'Rede de saúde');
  setCheckedValue('encaminhamento', 'Delegacia de atendimento à mulher');

  setValue('numero_envolvidos', 'Um');
  setValue('sexo_autor', 'Masculino');
  setValue('alcool', 'Sim');
  setValue('ciclo_vida', 'Pessoa adulta');

  setValue('relacao_trabalho', 'Não');
  setValue('cat', 'Não se aplica');
  setValue('circunstancia_lesao', 'Agressão por força corporal');
  setValue('data_encerramento', '2026-03-20');

  setValue('nome_acompanhante', 'Joana da Silva');
  setValue('vinculo_acompanhante', 'Mãe');
  setValue('telefone_acompanhante', '91999998888');
  setValue('observacoes', 'Caso atendido e encaminhado para rede de proteção.');

  setValue('notificador_municipio_unidade', 'Belém / UMS Central');
  setValue('notificador_cnes', '1234567');
  setValue('notificador_nome', 'Ana Souza');
  setValue('notificador_funcao', 'Enfermeira');
  setValue('notificador_assinatura', 'Ana Souza');
}

function clearForm() {
  if (!form) return;
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
  if (!source) return;

  const clone = source.cloneNode(true);
  const wrapper = document.createElement('div');
  wrapper.className = 'export-clone';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  replaceControlsForExport(wrapper);

  const options = {
    margin: 0,
    filename: `ficha-violencia-${new Date().toISOString().slice(0, 10)}.pdf`,
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

fillSampleBtn?.addEventListener('click', fillSample);
clearBtn?.addEventListener('click', clearForm);
exportBtn?.addEventListener('click', exportPDF);
