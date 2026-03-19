document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sinanForm');
  const documentNode = document.getElementById('document');
  const fillSampleBtn = document.getElementById('fillSampleBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');

  fillSampleBtn.addEventListener('click', () => {
    form.querySelectorAll('[data-sample]').forEach((el) => {
      const sample = el.getAttribute('data-sample');
      if (el.tagName === 'SELECT') el.value = sample;
      else el.value = sample;
    });
    form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((el) => {
      el.checked = el.getAttribute('data-sample-checked') === 'true';
    });
  });

  clearBtn.addEventListener('click', () => {
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      if (el.type === 'file') return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
      else el.value = '';
    });
  });

  exportBtn.addEventListener('click', async () => {
    const originalText = exportBtn.textContent;
    exportBtn.disabled = true;
    exportBtn.textContent = 'Gerando PDF...';
    try {
      const opt = {
        margin: 0,
        filename: 'ficha-sinan-violencia.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      await html2pdf().set(opt).from(documentNode).save();
    } catch (error) {
      console.error(error);
      alert('Não foi possível gerar o PDF.');
    } finally {
      exportBtn.disabled = false;
      exportBtn.textContent = originalText;
    }
  });
});
