const buttons = document.querySelectorAll('.copy-btn');

buttons.forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.getAttribute('data-copy');

    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = 'Copiado';
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    } catch (error) {
      alert('No se pudo copiar el texto.');
    }
  });
});
