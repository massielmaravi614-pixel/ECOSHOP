function stats() {
  statTotal.textContent = inventario.length;

  const totalValue = inventario.reduce(
    (a, p) => a + (p.precio * p.stock),
    0
  );

  statInventoryValue.textContent =
    "S/ " + totalValue.toFixed(2);

  statInStock.textContent = inventario.reduce((a, p) => a + p.stock, 0);
  statPurchases.textContent = comprasHoy;
}