function addToCart(id) {
  const producto = inventario.find(p => p.id === id);

  if (producto && producto.stock > 0) {

    carrito.push({
      ...producto,
      cartItemId: Date.now() + Math.random()
    });

    producto.stock--;

    comprasHoy++;

    guardar();

    updateCartCount();

    aplicarFiltros();

    stats();

    showToast(
      `✓ ${producto.nombre} agregado al carrito`,
      "success"
    );

    return true;
  }

  return false;
}