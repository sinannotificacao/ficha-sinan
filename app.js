const sampleData = { /* seus dados de exemplo */ };
const sampleChecks = { /* seus checks */ };

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
    if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
    else el.value = '';
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
      margin:0,
      filename:'ficha-sinan-violencia.pdf',
      image:{ type:'jpeg', quality:0.98 },
      html2canvas:{ scale:2, useCORS:true, scrollY:0 },
      jsPDF:{ unit:'mm', format:'a4', orientation:'portrait' },
      pagebreak:{ mode:['css','legacy'] }
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
