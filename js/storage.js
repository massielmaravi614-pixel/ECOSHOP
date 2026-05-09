function guardar() {
  localStorage.setItem("inventarioEco", JSON.stringify(inventario));
  localStorage.setItem("carritoEco", JSON.stringify(carrito));
  localStorage.setItem("comprasHoyEco", JSON.stringify(comprasHoy));
}