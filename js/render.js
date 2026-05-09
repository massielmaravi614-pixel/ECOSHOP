function render(lista) {
  grid.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");

    card.className = "product-card";
    if (p.stock === 0) card.classList.add("sold-out");

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
      <div class="card-body">
        <span class="card-cat">${p.categoria}</span>
        <h3 class="card-name">${p.nombre}</h3>
        <p class="card-price">S/ ${p.precio}</p>
      </div>
      <div class="card-footer">
        <span class="stock-indicator">${p.stock} en stock</span>
        <button class="buy-btn" ${p.stock === 0 ? 'disabled' : ''}>Comprar</button>
      </div>
    `;

    card.addEventListener("click", () => showDetail(p.id));

    card.querySelector(".buy-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p.id);
    });

    grid.appendChild(card);
  });

  resultsCount.textContent = `${lista.length} producto${lista.length !== 1 ? 's' : ''}`;
  emptyState.style.display = lista.length === 0 ? 'block' : 'none';

  stats();
}