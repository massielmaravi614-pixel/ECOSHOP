function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase();

  const filtrados = inventario.filter(p => {
    const matchCategoria =
      categoriaActual === "todos" ||
      p.categoria === categoriaActual;

    const matchBusqueda =
      p.nombre.toLowerCase().includes(texto);

    return matchCategoria && matchBusqueda;
  });

  render(filtrados);
} 