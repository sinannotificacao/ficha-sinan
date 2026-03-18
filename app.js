
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sinanForm');
  const documentNode = document.getElementById('document');
  const fillSampleBtn = document.getElementById('fillSampleBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');
  const changeLogoBtn = document.getElementById('changeLogoBtn');
  const logoInput = document.getElementById('logoInput');
  const logoPreview = document.getElementById('logoPreview');
  const logoFallback = document.getElementById('logoFallback');

  const showLogoFallback = () => {
    logoPreview.style.display = 'none';
    logoFallback.style.display = 'flex';
  };

  const showLogoImage = () => {
    logoPreview.style.display = 'block';
    logoFallback.style.display = 'none';
  };

  logoPreview.addEventListener('error', showLogoFallback);

  if (!logoPreview.getAttribute('src')) {
    showLogoFallback();
  }

  changeLogoBtn.addEventListener('click', () => logoInput.click());

  logoInput.addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      logoPreview.src = reader.result;
      showLogoImage();
    };
    reader.readAsDataURL(file);
  });

  fillSampleBtn.addEventListener('click', () => {
    form.querySelectorAll('[data-sample]').forEach((el) => {
      const sample = el.getAttribute('data-sample');
      if (el.tagName === 'SELECT') {
        el.value = sample;
      } else {
        el.value = sample;
      }
    });

    form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((el) => {
      el.checked = el.getAttribute('data-sample-checked') === 'true';
    });
  });

  clearBtn.addEventListener('click', () => {
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      if (el.type === 'file') return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = false;
      } else {
        el.value = '';
      }
    });
  });

  exportBtn.addEventListener('click', async () => {
    const originalText = exportBtn.textContent;
    exportBtn.disabled = true;
    exportBtn.textContent = 'Gerando PDF...';
    document.body.classList.add('pdf-mode');

    try {
      const opt = {
        margin: 0,
        filename: 'ficha-sinan-violencia.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(documentNode).save();
    } catch (error) {
      console.error(error);
      alert('Não foi possível gerar o PDF. Verifique se todos os arquivos foram enviados corretamente.');
    } finally {
      document.body.classList.remove('pdf-mode');
      exportBtn.disabled = false;
      exportBtn.textContent = originalText;
    }
  });
});
