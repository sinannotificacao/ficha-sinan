const fillSampleBtn = document.getElementById('fillSampleBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');

function getFields(name) {
  return Array.from(document.querySelectorAll(`[name="${name}"]`));
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toDateInput(date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

function randomDate(start, end) {
  const time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(time);
}

function clearByName(name) {
  const fields = getFields(name);
  fields.forEach((field) => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.checked = false;
    } else {
      field.value = '';
    }
  });
}

function setValue(name, value) {
  const fields = getFields(name);
  if (!fields.length) {
    console.warn('Campo não encontrado:', name);
    return;
  }

  const first = fields[0];

  if (first.type === 'radio') {
    fields.forEach((field) => {
      field.checked = field.value === value;
    });
    return;
  }

  if (first.type === 'checkbox') {
    fields.forEach((field) => {
      field.checked = field.value === value;
    });
    return;
  }

  first.value = value;
}

function setCheckbox(name, values) {
  const selected = Array.isArray(values) ? values : [values];
  const selectedSet = new Set(selected);

  const fields = getFields(name);
  if (!fields.length) {
    console.warn('Grupo de checkbox não encontrado:', name);
    return;
  }

  fields.forEach((field) => {
    field.checked = selectedSet.has(field.value);
  });
}

function clearForm() {
  document.querySelectorAll('input, select, textarea').forEach((field) => {
    if (field.type === 'button' || field.type === 'submit' || field.type === 'reset') return;
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.checked = false;
    } else {
      field.value = '';
    }
  });
}

function generatePatient() {
  const femaleNames = [
    'Maria', 'Ana', 'Francisca', 'Antônia', 'Adriana', 'Juliana', 'Márcia', 'Fernanda',
    'Patrícia', 'Aline', 'Camila', 'Beatriz', 'Larissa', 'Vanessa', 'Bruna', 'Paula'
  ];
  const maleNames = [
    'José', 'João', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas', 'Marcos',
    'Rafael', 'Bruno', 'Felipe', 'André', 'Leandro', 'Thiago', 'Diego', 'Mateus'
  ];
  const surnames = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida',
    'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins'
  ];
  const neighborhoods = ['Marco', 'Pedreira', 'Umarizal', 'Guamá', 'Batista Campos', 'Jurunas', 'Sacramenta', 'Telégrafo'];
  const streets = [
    'Av. Almirante Barroso', 'Travessa Lomas', 'Rua dos Pariquis', 'Av. Pedro Miranda',
    'Travessa Mauriti', 'Rua dos Mundurucus', 'Av. José Bonifácio', 'Passagem São Pedro'
  ];
  const occupations = [
    'Auxiliar administrativo', 'Técnica de enfermagem', 'Estudante', 'Vendedora',
    'Doméstica', 'Atendente', 'Recepcionista', 'Cuidadora', 'Professora', 'Autônoma'
  ];
  const accompanyLinks = ['Mãe', 'Pai', 'Irmã', 'Irmão', 'Tia', 'Amiga'];

  const sex = randomItem(['Feminino', 'Masculino']);
  const firstName = sex === 'Feminino' ? randomItem(femaleNames) : randomItem(maleNames);
  const secondName = sex === 'Feminino' ? randomItem(femaleNames) : randomItem(maleNames);
  const motherName = `${randomItem(femaleNames)} ${randomItem(surnames)}`;
  const fullName = `${firstName} ${randomItem(surnames)} ${randomItem(surnames)}`;
  const age = randomInt(14, 49);
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const birthDate = randomDate(new Date(birthYear, 0, 1), new Date(birthYear, 11, 28));
  const occurrenceDate = randomDate(new Date(currentYear, 0, 1), new Date());
  const notificationDate = new Date(occurrenceDate.getTime() + randomInt(0, 2) * 24 * 60 * 60 * 1000);
  const closureDate = new Date(notificationDate.getTime() + randomInt(0, 5) * 24 * 60 * 60 * 1000);
  const residenceStreet = randomItem(streets);
  const occurrenceStreet = randomItem(streets);
  const residenceDistrict = 'Sede';
  const occurrenceDistrict = 'Sede';
  const residenceNeighborhood = randomItem(neighborhoods);
  const occurrenceNeighborhood = randomItem(neighborhoods);
  const gestante = sex === 'Feminino'
    ? randomItem(['1º trimestre', '2º trimestre', '3º trimestre', 'Não', 'Ignorado'])
    : 'Não se aplica';

  return {
    sex,
    fullName,
    motherName,
    age,
    birthDate: toDateInput(birthDate),
    occurrenceDate: toDateInput(occurrenceDate),
    notificationDate: toDateInput(notificationDate),
    closureDate: toDateInput(closureDate),
    gestante,
    residenceStreet,
    occurrenceStreet,
    residenceDistrict,
    occurrenceDistrict,
    residenceNeighborhood,
    occurrenceNeighborhood,
    occupation: randomItem(occupations),
    stateCivil: randomItem(['Solteiro', 'Casado / União consensual', 'Separado', 'Ignorado']),
    orientation: randomItem(['Heterossexual', 'Homossexual', 'Bissexual', 'Ignorado']),
    gender: randomItem(['Não se aplica', 'Travesti', 'Mulher transexual', 'Homem transexual', 'Ignorado']),
    companionName: `${secondName} ${randomItem(surnames)}`,
    companionLink: randomItem(accompanyLinks),
    phone: `91${randomInt(90000000, 99999999)}`,
    sus: `7${randomInt(100000000000000, 999999999999999)}`,
    houseNumber: String(randomInt(10, 1800)),
    otherHouseNumber: String(randomInt(1, 900)),
    cep: `66${randomInt(100000, 999999)}`,
    geo1: (-1.35 - Math.random() * 0.25).toFixed(4),
    geo2: (-48.35 - Math.random() * 0.30).toFixed(4),
    geo3: (-1.35 - Math.random() * 0.25).toFixed(4),
    geo4: (-48.35 - Math.random() * 0.30).toFixed(4),
    hour: `${pad2(randomInt(0, 23))}:${pad2(randomInt(0, 59))}`,
    notifierName: `${randomItem(['Carla', 'Renata', 'Luciana', 'Mariana', 'Patrícia', 'João', 'Ricardo'])} ${randomItem(surnames)}`,
    notifierRole: randomItem(['Enfermeira', 'Assistente social', 'Médica', 'Técnico de enfermagem', 'Psicóloga']),
    cnes: String(randomInt(1000000, 9999999)),
    unitCode: String(randomInt(1000000, 9999999))
  };
}

function fillSample() {
  clearForm();
  const p = generatePatient();

  const unitType = randomItem([
    '1 - Unidade de saúde',
    '2 - Unidade de assistência social',
    '4 - Conselho tutelar',
    '7 - Outros'
  ]);

  const localOcorrencia = randomItem([
    'Residência',
    'Via pública',
    'Escola',
    'Bar ou similar',
    'Comércio / serviços'
  ]);

  const outrasVezes = randomItem(['Sim', 'Não', 'Ignorado']);
  const lesaoAutoprovocada = randomItem(['Não', 'Ignorado']);

  const motivacoesBase = [
    'Sexismo', 'Racismo', 'Conflito geracional', 'Deficiência', 'Situação de rua', 'Xenofobia'
  ];
  const tiposViolenciaBase = [
    'Física', 'Psicológica / moral', 'Sexual', 'Negligência / abandono', 'Financeira / econômica'
  ];
  const meiosBase = [
    'Força corporal / espancamento', 'Ameaça', 'Objeto contundente', 'Objeto pérfuro-cortante'
  ];
  const violenciaSexualBase = [
    'Assédio sexual', 'Estupro', 'Exploração sexual', 'Pornografia infantil'
  ];
  const procedimentosBase = [
    'Profilaxia DST', 'Profilaxia HIV', 'Profilaxia hepatite B', 'Coleta de sangue',
    'Contracepção de emergência', 'Coleta de secreção vaginal'
  ];
  const vinculosBase = [
    'Pai', 'Mãe', 'Padrasto', 'Madrasta', 'Cônjuge', 'Ex-cônjuge', 'Namorado(a)',
    'Ex-namorado(a)', 'Irmão(ã)', 'Filho(a)', 'Amigos / conhecidos', 'Desconhecido(a)',
    'Cuidador(a)', 'Patrão / chefe', 'Pessoa com relação institucional', 'Policial / agente da lei', 'Própria pessoa'
  ];
  const encaminhamentosBase = [
    'Rede de saúde', 'Rede de assistência social', 'Rede de educação', 'Rede de atendimento à mulher',
    'Conselho tutelar', 'Conselho do idoso', 'Centro de referência dos direitos humanos',
    'Ministério Público', 'Defensoria pública', 'Delegacia de atendimento à mulher', 'Outras delegacias'
  ];

  const selectedTypes = [];
  selectedTypes.push(randomItem(tiposViolenciaBase));
  if (Math.random() < 0.45) {
    const extra = randomItem(tiposViolenciaBase.filter((v) => !selectedTypes.includes(v)));
    selectedTypes.push(extra);
  }

  const selectedMotivations = [randomItem(motivacoesBase)];
  if (Math.random() < 0.30) {
    const extra = randomItem(motivacoesBase.filter((v) => !selectedMotivations.includes(v)));
    selectedMotivations.push(extra);
  }

  const selectedMeans = [randomItem(meiosBase)];
  if (Math.random() < 0.25) {
    const extra = randomItem(meiosBase.filter((v) => !selectedMeans.includes(v)));
    selectedMeans.push(extra);
  }

  const selectedVinculos = [randomItem(vinculosBase)];
  const selectedEncaminhamentos = [
    'Rede de saúde',
    randomItem(encaminhamentosBase.filter((v) => v !== 'Rede de saúde'))
  ];

  const hasDeficiency = randomItem(['Sim', 'Não', 'Ignorado']);
  const hasSexualViolence = selectedTypes.includes('Sexual');

  setValue('tipo_notificacao', '2 - Individual');
  setValue('agravo', 'Violência interpessoal / autoprovocada');
  setValue('cid10', 'Y09');
  setValue('data_notificacao', p.notificationDate);
  setValue('uf_notificacao', 'PA');
  setValue('municipio_notificacao', 'Belém');
  setValue('ibge_notificacao', '1501402');
  setValue('unidade_notificadora', unitType);
  setValue('nome_unidade_notificadora', 'UBS Central');
  setValue('codigo_unidade_notificadora', p.unitCode);
  setValue('data_ocorrencia', p.occurrenceDate);
  setValue('unidade_saude', 'UBS Central');
  setValue('cnes', p.cnes);

  setValue('nome_paciente', p.fullName);
  setValue('data_nascimento', p.birthDate);
  setValue('idade', String(p.age));
  setValue('tipo_idade', 'Ano');
  setValue('sexo', p.sex);
  setValue('gestante', p.gestante);
  setValue('raca', randomItem(['Branca', 'Preta', 'Parda', 'Indígena', 'Ignorado']));
  setValue('escolaridade', randomItem([
    'Analfabeto',
    '1ª à 4ª série incompleta do EF',
    '4ª série completa do EF',
    '5ª à 8ª série incompleta do EF',
    'Ensino fundamental completo',
    'Ensino médio incompleto',
    'Ensino médio completo',
    'Educação superior incompleta',
    'Educação superior completa',
    'Ignorado'
  ]));
  setValue('cartao_sus', p.sus);
  setValue('nome_mae', p.motherName);

  setValue('uf_residencia', 'PA');
  setValue('municipio_residencia', 'Belém');
  setValue('ibge_residencia', '1501402');
  setValue('distrito_residencia', p.residenceDistrict);
  setValue('bairro_residencia', p.residenceNeighborhood);
  setValue('logradouro_residencia', p.residenceStreet);
  setValue('codigo_logradouro_residencia', String(randomInt(1, 999)).padStart(3, '0'));
  setValue('numero_residencia', p.houseNumber);
  setValue('complemento_residencia', randomItem(['Casa', 'Apto 101', 'Fundos', 'Bloco B', '']));
  setValue('geo1', p.geo1);
  setValue('geo2', p.geo2);
  setValue('referencia_residencia', randomItem(['Próximo à farmácia', 'Ao lado da escola', 'Em frente à praça', 'Perto do mercado']));
  setValue('cep', p.cep);
  setValue('telefone', p.phone);
  setValue('zona_residencia', randomItem(['Urbana', 'Periurbana', 'Rural']));
  setValue('pais', 'Brasil');

  setValue('nome_social', '');
  setValue('ocupacao', p.occupation);
  setValue('estado_civil', p.stateCivil);
  setValue('orientacao', p.orientation);
  setValue('genero', p.gender);
  setValue('deficiencia_transtorno', hasDeficiency);

  if (hasDeficiency === 'Sim') {
    const possibleDef = [
      'Deficiência física',
      'Deficiência visual',
      'Deficiência intelectual',
      'Deficiência auditiva',
      'Transtorno mental',
      'Transtorno de comportamento'
    ];
    const count = randomInt(1, 2);
    const selectedDefs = [...possibleDef].sort(() => Math.random() - 0.5).slice(0, count);
    setCheckbox('tipo_deficiencia', selectedDefs);
    setValue('outras_deficiencias', '');
  } else {
    clearByName('tipo_deficiencia');
    setValue('outras_deficiencias', '');
  }

  setValue('uf_ocorrencia', 'PA');
  setValue('municipio_ocorrencia', 'Belém');
  setValue('ibge_ocorrencia', '1501402');
  setValue('distrito_ocorrencia', p.occurrenceDistrict);
  setValue('bairro_ocorrencia', p.occurrenceNeighborhood);
  setValue('logradouro_ocorrencia', p.occurrenceStreet);
  setValue('codigo_logradouro_ocorrencia', String(randomInt(1, 999)).padStart(3, '0'));
  setValue('numero_ocorrencia', p.otherHouseNumber);
  setValue('complemento_ocorrencia', randomItem(['Fundos', 'Casa', 'Via principal', 'Próximo ao portão', '']));
  setValue('geo3', p.geo3);
  setValue('geo4', p.geo4);
  setValue('referencia_ocorrencia', randomItem(['Em frente ao mercado', 'Próximo ao terminal', 'Ao lado da igreja', 'Perto da praça']));
  setValue('zona_ocorrencia', randomItem(['Urbana', 'Periurbana', 'Rural']));
  setValue('hora_ocorrencia', p.hour);
  setValue('local_ocorrencia', localOcorrencia);
  setValue('local_ocorrencia_outro', '');
  setValue('outras_vezes', outrasVezes);
  setValue('lesao_autoprovocada', lesaoAutoprovocada);

  setCheckbox('motivacao', selectedMotivations);
  setValue('motivacao_outros', '');
  setCheckbox('tipo_violencia', selectedTypes);
  setValue('tipo_violencia_outros', '');
  setCheckbox('meio_agressao', selectedMeans);
  setValue('meio_agressao_outro', '');

  if (hasSexualViolence) {
    const chosen = [randomItem(violenciaSexualBase)];
    if (Math.random() < 0.35) {
      const extra = randomItem(violenciaSexualBase.filter((v) => !chosen.includes(v)));
      chosen.push(extra);
    }
    setCheckbox('violencia_sexual', chosen);
    setValue('violencia_sexual_outros', '');
    setCheckbox('procedimento', [...procedimentosBase].sort(() => Math.random() - 0.5).slice(0, randomInt(2, 4)));
  } else {
    clearByName('violencia_sexual');
    setValue('violencia_sexual_outros', '');
    clearByName('procedimento');
  }

  setValue('numero_envolvidos', randomItem(['Um', 'Dois ou mais', 'Ignorado']));
  setCheckbox('vinculo_autor', selectedVinculos);
  setValue('vinculo_autor_outros', '');
  setValue('sexo_autor', randomItem(['Masculino', 'Feminino', 'Ambos os sexos', 'Ignorado']));
  setValue('alcool', randomItem(['Sim', 'Não', 'Ignorado']));
  setValue('ciclo_vida', randomItem(['Adolescente', 'Jovem', 'Pessoa adulta', 'Pessoa idosa', 'Ignorado']));

  setCheckbox('encaminhamento', selectedEncaminhamentos);

  setValue('relacao_trabalho', randomItem(['Sim', 'Não', 'Ignorado']));
  setValue('cat', randomItem(['Sim', 'Não', 'Não se aplica', 'Ignorado']));
  setValue('circunstancia_lesao', randomItem([
    'Y04 - Agressão por força corporal',
    'Y05 - Agressão sexual por força física',
    'Y08 - Agressão por outros meios especificados',
    'Y09 - Agressão por meios não especificados'
  ]));
  setValue('data_encerramento', p.closureDate);

  setValue('nome_acompanhante', p.companionName);
  setValue('vinculo_acompanhante', p.companionLink);
  setValue('telefone_acompanhante', `91${randomInt(90000000, 99999999)}`);
  setValue('observacoes', `Caso preenchido automaticamente para teste do formulário. Atendimento inicial realizado em ${p.notificationDate}, com encaminhamento para acompanhamento na rede de saúde e registro da ocorrência em Belém/PA.`);

  setValue('notificador_municipio_unidade', 'Belém / UBS Central');
  setValue('notificador_cnes', p.cnes);
  setValue('notificador_nome', p.notifierName);
  setValue('notificador_funcao', p.notifierRole);
  setValue('notificador_assinatura', p.notifierName);
}

function exportPDF() {
  const element = document.getElementById('document');

  if (!element) {
    alert('Área do documento não encontrada.');
    return;
  }

  if (typeof html2pdf === 'undefined') {
    alert('A biblioteca de exportação PDF não foi carregada.');
    return;
  }

  const options = {
    margin: 6,
    filename: 'ficha-violencia.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  html2pdf().set(options).from(element).save();
}

if (fillSampleBtn) {
  fillSampleBtn.addEventListener('click', fillSample);
}

if (clearBtn) {
  clearBtn.addEventListener('click', clearForm);
}

if (exportBtn) {
  exportBtn.addEventListener('click', exportPDF);
}
