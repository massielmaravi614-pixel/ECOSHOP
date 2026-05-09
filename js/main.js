function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

function initCategorias() {
  const categorias = ['todos', ...new Set(inventario.map(p => p.categoria))];
  categoryFilters.innerHTML = '';
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.addEventListener('click', () => {
      categoriaActual = cat;
      aplicarFiltros();
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    categoryFilters.appendChild(btn);
  });
  document.querySelector('.cat-btn').classList.add('active');
}

initTheme();

initCategorias();

updateCartCount();

render(inventario);

stats();