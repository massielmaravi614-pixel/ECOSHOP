let inventario = JSON.parse(localStorage.getItem("inventarioEco")) || [
  { id: 1, nombre: "Botella Ecológica", precio: 25.5, categoria: "hogar", stock: 10, imagen: "https://picsum.photos/300?1", descripcion: "Botella reutilizable de acero inoxidable." },
  { id: 2, nombre: "Audífonos Bluetooth", precio: 120, categoria: "tecnologia", stock: 8, imagen: "https://picsum.photos/300?2", descripcion: "Audífonos inalámbricos con cancelación de ruido." },
  { id: 3, nombre: "Pelota Profesional", precio: 80, categoria: "deportes", stock: 6, imagen: "https://picsum.photos/300?3", descripcion: "Pelota oficial para entrenamiento." },
  { id: 4, nombre: "Laptop Gamer", precio: 3500, categoria: "tecnologia", stock: 3, imagen: "https://picsum.photos/300?4", descripcion: "Laptop de alto rendimiento para gaming." },
  { id: 5, nombre: "Silla Ergonómica", precio: 450, categoria: "hogar", stock: 5, imagen: "https://picsum.photos/300?5", descripcion: "Silla cómoda para oficina." },
  { id: 6, nombre: "Mancuernas", precio: 95, categoria: "deportes", stock: 7, imagen: "https://picsum.photos/300?6", descripcion: "Set de mancuernas ajustables." },
  { id: 7, nombre: "Smartwatch", precio: 320, categoria: "tecnologia", stock: 4, imagen: "https://picsum.photos/300?7", descripcion: "Reloj inteligente resistente al agua." },
  { id: 8, nombre: "Lámpara LED", precio: 60, categoria: "hogar", stock: 12, imagen: "https://picsum.photos/300?8", descripcion: "Lámpara moderna de bajo consumo." },
  { id: 9, nombre: "Yoga Mat", precio: 70, categoria: "deportes", stock: 9, imagen: "https://picsum.photos/300?9", descripcion: "Colchoneta antideslizante para yoga." },
  { id: 10, nombre: "Teclado Mecánico", precio: 180, categoria: "tecnologia", stock: 5, imagen: "https://picsum.photos/300?10", descripcion: "Teclado RGB para gaming." },
  { id: 11, nombre: "Organizador", precio: 40, categoria: "hogar", stock: 11, imagen: "https://picsum.photos/300?11", descripcion: "Caja organizadora multiusos." },
  { id: 12, nombre: "Bicicleta MTB", precio: 1200, categoria: "deportes", stock: 2, imagen: "https://picsum.photos/300?12", descripcion: "Bicicleta de montaña profesional." }
];

// ================= DOM =================
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");

// STATS
const statTotal = document.getElementById("statTotal");
const statInventoryValue = document.getElementById("statInventoryValue");
const statInStock = document.getElementById("statInStock");
const statPurchases = document.getElementById("statPurchases");

// DETAIL PANEL
const detailPanel = document.getElementById("detailPanel");
const detailClose = document.getElementById("detailClose");
const detailImg = document.getElementById("detailImg");
const detailCat = document.getElementById("detailCat");
const detailName = document.getElementById("detailName");
const detailDesc = document.getElementById("detailDesc");
const detailPrice = document.getElementById("detailPrice");
const detailStockBadge = document.getElementById("detailStockBadge");
const detailBuyBtn = document.getElementById("detailBuyBtn");

let categoriaActual = "todos";
let comprasHoy = 0;

// ================= GUARDAR =================
function guardar() {
  localStorage.setItem("inventarioEco", JSON.stringify(inventario));
}

// ================= RENDER =================
function render(lista) {
  grid.innerHTML = "";

  if (lista.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  resultsCount.textContent = `${lista.length} productos encontrados`;

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    if (p.stock === 0) card.classList.add("sold-out");

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.imagen}" width="100%" height="150" style="object-fit:cover;">
      </div>

      <div class="card-body">
        <span class="card-cat">${p.categoria}</span>
        <h3 class="card-name">${p.nombre}</h3>
        <span class="card-price">S/ ${p.precio}</span>
      </div>

      <div class="card-footer">
        <span class="stock-indicator">
          Stock: ${p.stock}
        </span>

        <button class="buy-btn" ${p.stock === 0 ? "disabled" : ""}>
          Comprar
        </button>
      </div>
    `;

    // CLICK CARD (DETALLE)
    card.addEventListener("click", () => showDetail(p));

    // COMPRA
    card.querySelector(".buy-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      comprar(p.id);
    });

    grid.appendChild(card);
  });

  stats();
}

// ================= DETALLE =================
function showDetail(p) {
  detailPanel.classList.add("open");

  detailImg.textContent = "🛍️";
  detailCat.textContent = p.categoria;
  detailName.textContent = p.nombre;
  detailDesc.textContent = p.descripcion;
  detailPrice.textContent = "S/ " + p.precio;
  detailStockBadge.textContent = "Stock: " + p.stock;

  detailBuyBtn.onclick = () => comprar(p.id);
}

// cerrar detalle
detailClose.addEventListener("click", () => {
  detailPanel.classList.remove("open");
});

// ================= COMPRA =================
function comprar(id) {
  const p = inventario.find(x => x.id === id);

  if (p.stock > 0) {
    p.stock--;
    comprasHoy++;

    guardar();
    aplicarFiltros();
  }
}

// ================= FILTROS =================
function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase();

  const filtrados = inventario.filter(p => {
    return (
      (categoriaActual === "todos" || p.categoria === categoriaActual) &&
      p.nombre.toLowerCase().includes(texto)
    );
  });

  render(filtrados);
}

// ================= CATEGORIAS =================
function initCategorias() {
  const cats = ["todos", "hogar", "tecnologia", "deportes"];

  categoryFilters.innerHTML = "";

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.textContent = cat;

    btn.onclick = () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      categoriaActual = cat;
      aplicarFiltros();
    };

    categoryFilters.appendChild(btn);
  });
}

// ================= SEARCH =================
searchInput.addEventListener("input", aplicarFiltros);

// ================= STATS =================
function stats() {
  statTotal.textContent = inventario.length;

  const totalValue = inventario.reduce((a, p) => a + p.precio * p.stock, 0);
  statInventoryValue.textContent = "S/ " + totalValue.toFixed(2);

  const stock = inventario.reduce((a, p) => a + p.stock, 0);
  statInStock.textContent = stock;

  statPurchases.textContent = comprasHoy;
}

// ================= INIT =================
initCategorias();
render(inventario);