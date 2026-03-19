const sampleData = {
  tipo_notificacao: '2 - Individual',
  agravo: 'Violência interpessoal / autoprovocada',
  cid10: 'Y09',
  data_notificacao: '2026-03-18',
  uf_notificacao: 'MG',
  municipio_notificacao: 'Belo Horizonte',
  ibge_notificacao: '3106200',
  nome_unidade_notificadora: 'Unidade de Saúde Exemplo',
  codigo_unidade_notificadora: '12345',
  data_ocorrencia: '2026-03-17',
  unidade_saude: 'UBS Central',
  cnes: '9876543',
  nome_paciente: 'Paciente Exemplo',
  data_nascimento: '2000-05-10',
  idade: '25',
  tipo_idade: 'Ano',
  sexo: 'Feminino',
  gestante: 'Não',
  raca: 'Parda',
  escolaridade: 'Ensino médio completo',
  cartao_sus: '000 0000 0000 0000',
  nome_mae: 'Mãe Exemplo',
  uf_residencia: 'MG',
  municipio_residencia: 'Belo Horizonte',
  ibge_residencia: '3106200',
  distrito_residencia: 'Centro-Sul',
  bairro_residencia: 'Funcionários',
  logradouro_residencia: 'Rua Exemplo',
  numero_residencia: '100',
  complemento_residencia: 'Apto 201',
  referencia_residencia: 'Próximo à praça',
  cep: '30110-000',
  telefone: '(31) 99999-9999',
  zona_residencia: 'Urbana',
  nome_social: 'Nome social exemplo',
  ocupacao: 'Auxiliar administrativa',
  estado_civil: 'Solteiro',
  orientacao: 'Heterossexual',
  genero: 'Não se aplica',
  deficiencia_transtorno: 'Não',
  uf_ocorrencia: 'MG',
  municipio_ocorrencia: 'Belo Horizonte',
  ibge_ocorrencia: '3106200',
  bairro_ocorrencia: 'Centro',
  logradouro_ocorrencia: 'Avenida Exemplo',
  numero_ocorrencia: '250',
  zona_ocorrencia: 'Urbana',
  hora_ocorrencia: '18:40',
  outras_vezes: 'Sim',
  lesao_autoprovocada: 'Não',
  numero_envolvidos: 'Um',
  sexo_autor: 'Masculino',
  alcool: 'Sim',
  ciclo_vida: 'Pessoa adulta',
  relacao_trabalho: 'Não',
  cat: 'Não se aplica',
  circunstancia_lesao: 'Y04',
  data_encerramento: '2026-03-18',
  nome_acompanhante: 'Acompanhante Exemplo',
  vinculo_acompanhante: 'Irmã',
  telefone_acompanhante: '(31) 98888-8888',
  observacoes: 'Este é apenas um exemplo para demonstrar o preenchimento automático do formulário web.',
  notificador_municipio_unidade: 'Belo Horizonte / UBS Central',
  notificador_cnes: '9876543',
  notificador_nome: 'Profissional Exemplo',
  notificador_funcao: 'Enfermeira',
  notificador_assinatura: 'Assinatura digital'
};

const sampleChecks = {
  unidade_notificadora: ['1 - Unidade de saúde'],
  tipo_deficiencia: ['Deficiência física'],
  local_ocorrencia: ['Residência'],
  motivacao: ['Sexismo'],
  tipo_violencia: ['Física', 'Psicológica / moral'],
  meio_agressao: ['Força corporal / espancamento', 'Ameaça'],
  violencia_sexual: [],
  procedimento: ['Coleta de sangue'],
  vinculo_autor: ['Cônjuge'],
  encaminhamento: ['Rede de saúde', 'Delegacia de atendimento à mulher']
};

function setFieldValue(name, value) {
  const nodes = document.querySelectorAll(`[name="${name}"]`);
  nodes.forEach((node) => {
    if (node.type === 'checkbox' || node.type === 'radio') return;
    node.value = value;
  });
}

function setChecks(name, values) {
  const nodes = document.querySelectorAll(`[name="${name}"]`);
  nodes.forEach((node) => {
    node.checked = values.includes(node.value);
  });
}

function fillSample() {
  Object.entries(sampleData).forEach(([name, value]) => setFieldValue(name, value));
  Object.entries(sampleChecks).forEach(([name, values]) => setChecks(name, values));
}

function clearForm() {
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = false;
    } else {
      el.value = '';
    }
  });
}

async function exportPdf() {
  const button = document.getElementById('exportBtn');
  const element = document.getElementById('document');
  const originalText = button.textContent;

  try {
    button.disabled = true;
    button.textContent = 'Gerando...';

    const opt = {
      margin: 0,
      filename: 'ficha-sinan-violencia.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error(error);
    alert('Não foi possível gerar o PDF automaticamente. Use Ctrl+P e escolha Salvar como PDF.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fillSampleBtn').addEventListener('click', fillSample);
  document.getElementById('clearBtn').addEventListener('click', clearForm);
  document.getElementById('exportBtn').addEventListener('click', exportPdf);
});
