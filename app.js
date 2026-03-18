document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fillSampleBtn').addEventListener('click', () => alert('Preencher exemplo ainda não implementado.'));
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
  });
  document.getElementById('exportBtn').addEventListener('click', () => alert('Exportar PDF ainda não implementado.'));
});
