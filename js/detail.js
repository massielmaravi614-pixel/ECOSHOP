function showDetail(id) {
  const p = inventario.find(prod => prod.id === id);
  if (!p) return;

  currentDetailId = id;

  detailImg.style.backgroundImage = `url(${p.imagen})`;
  detailCat.textContent = p.categoria;
  detailName.textContent = p.nombre;
  detailDesc.textContent = p.descripcion;
  detailPrice.textContent = `S/ ${p.precio}`;
  detailStockBadge.textContent = p.stock > 0 ? `${p.stock} en stock` : 'Agotado';
  detailBuyBtn.disabled = p.stock === 0;

  detailPanel.classList.add('open');
}

detailBuyBtn.addEventListener('click', () => {
  const p = inventario.find(prod => prod.id === currentDetailId);
  if (!p) return;
  const comprado = addToCart(p.id);
  if (comprado) {
    showDetail(p.id);
  }
});

detailClose.addEventListener('click', () => {
  detailPanel.classList.remove('open');
});

let currentDetailId = null;