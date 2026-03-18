document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fillSampleBtn').addEventListener('click', () => alert('Exemplo de preenchimento ainda não implementado.'));
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
  });
  document.getElementById('exportBtn').addEventListener('click', () => {
    const element = document.getElementById('document');
    html2pdf().from(element).save('Ficha-SINAN.pdf');
  });
});
