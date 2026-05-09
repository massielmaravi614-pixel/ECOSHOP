function render(lista) {
  grid.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>S/ ${p.precio}</p>
    `;

    grid.appendChild(card);
  });

  stats();
}
card.querySelector(".buy-btn").addEventListener("click", (e) => {
  e.stopPropagation();

  addToCart(p.id);
});