// ================= DATOS =================
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

let carrito = JSON.parse(localStorage.getItem("carritoEco")) || [];
let comprasHoy = JSON.parse(localStorage.getItem("comprasHoyEco")) || 0;
let currentTheme = localStorage.getItem("themeEco") || "light";

// ================= DOM =================
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const clearSearch = document.getElementById("clearSearch");

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

// THEME & CART
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const cartIndicator = document.getElementById("cartIndicator");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

let categoriaActual = "todos";

// ================= GUARDAR & STORAGE =================
function guardar() {
  localStorage.setItem("inventarioEco", JSON.stringify(inventario));
  localStorage.setItem("carritoEco", JSON.stringify(carrito));
  localStorage.setItem("comprasHoyEco", JSON.stringify(comprasHoy));
}

// ================= TEMA (LIGHT/DARK) =================
function initTheme() {
  if (!localStorage.getItem("themeEco")) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  themeIcon.textContent = currentTheme === "light" ? "🌙" : "☀️";
  localStorage.setItem("themeEco", currentTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme();
}

themeBtn.addEventListener("click", toggleTheme);

// ================= NOTIFICACIONES =================
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// ================= CARRITO =================
function updateCartCount() {
  cartCount.textContent = carrito.length;
}

function addToCart(id) {
  const producto = inventario.find(p => p.id === id);
  if (producto && producto.stock > 0) {
    carrito.push({ ...producto, cartItemId: Date.now() });
    producto.stock--;
    comprasHoy++;
    guardar();
    updateCartCount();
    showToast(`✓ ${producto.nombre} agregado al carrito`, "success");
    return true;
  }
  return false;
}

function removeFromCart(cartItemId) {
  const index = carrito.findIndex(item => item.cartItemId === cartItemId);
  if (index > -1) {
    const producto = carrito[index];
    carrito.splice(index, 1);
    
    // Devolver el stock al inventario
    const inventarioItem = inventario.find(p => p.id === producto.id);
    if (inventarioItem) {
      inventarioItem.stock++;
    }
    
    guardar();
    updateCartCount();
    aplicarFiltros();
    showToast(`✓ ${producto.nombre} removido del carrito`, "success");
  }
}

function viewCart() {
  if (carrito.length === 0) {
    showToast("Tu carrito está vacío", "success");
    return;
  }
  
  let total = carrito.reduce((sum, item) => sum + item.precio, 0);
  let mensaje = `📦 ${carrito.length} item${carrito.length !== 1 ? 's' : ''} | Total: S/ ${total.toFixed(2)}`;
  showToast(mensaje, "success");
}

// ================= RENDER =================
function render(lista) {
  grid.innerHTML = "";

  if (lista.length === 0) {
    emptyState.style.display = "block";
    resultsCount.textContent = "0 productos encontrados";
  } else {
    emptyState.style.display = "none";
    resultsCount.textContent = `${lista.length} producto${lista.length !== 1 ? "s" : ""} encontrado${lista.length !== 1 ? "s" : ""}`;
  }

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    if (p.stock === 0) card.classList.add("sold-out");

    const stockText = p.stock === 0 ? "Agotado" : `Stock: ${p.stock}`;

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.imagen}" width="100%" height="150" alt="${p.nombre}" style="object-fit:cover;">
      </div>

      <div class="card-body">
        <span class="card-cat">${p.categoria}</span>
        <h3 class="card-name">${p.nombre}</h3>
        <span class="card-price">S/ ${p.precio.toFixed(2)}</span>
      </div>

      <div class="card-footer">
        <span class="stock-indicator">${stockText}</span>
        <button class="buy-btn" ${p.stock === 0 ? "disabled" : ""}>
          Comprar
        </button>
      </div>
    `;

    // CLICK CARD (DETALLE)
    card.addEventListener("click", () => showDetail(p.id));

    // COMPRA
    card.querySelector(".buy-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const comprado = addToCart(p.id);
      if (comprado) {
        render(lista);
        stats();
      }
    });

    grid.appendChild(card);
  });

  stats();
}

// ================= DETALLE =================
function showDetail(id) {
  // Buscar el producto actualizado del inventario
  const p = inventario.find(prod => prod.id === id);
  if (!p) return;
  
  detailPanel.classList.add("open");

  detailImg.textContent = "🛍️";
  detailCat.textContent = p.categoria.toUpperCase();
  detailName.textContent = p.nombre;
  detailDesc.textContent = p.descripcion;
  detailPrice.textContent = "S/ " + p.precio.toFixed(2);
  detailStockBadge.textContent = p.stock === 0 ? "Agotado" : "Stock: " + p.stock;

  detailBuyBtn.disabled = p.stock === 0;
  detailBuyBtn.onclick = () => {
    const comprado = addToCart(p.id);
    if (comprado) {
      showToast(`✓ ${p.nombre} agregado! Carrito actualizado`, "success");
      setTimeout(() => {
        detailPanel.classList.remove("open");
      }, 600);
    }
  };
}

// cerrar detalle
detailClose.addEventListener("click", () => {
  detailPanel.classList.remove("open");
});

// Cerrar detail panel con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    detailPanel.classList.remove("open");
  }
});

// ================= FILTROS =================
function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase().trim();

  const filtrados = inventario.filter(p => {
    const matchCategoria = categoriaActual === "todos" || p.categoria === categoriaActual;
    const matchBusqueda = p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto);
    return matchCategoria && matchBusqueda;
  });

  render(filtrados);
}

// ================= CATEGORIAS =================
function initCategorias() {
  const cats = ["todos", "hogar", "tecnologia", "deportes"];

  categoryFilters.innerHTML = "";

  cats.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    if (index === 0) btn.classList.add("active");
    btn.textContent = cat;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      categoriaActual = cat;
      searchInput.value = "";
      aplicarFiltros();
    });

    categoryFilters.appendChild(btn);
  });
}

// ================= SEARCH =================
searchInput.addEventListener("input", aplicarFiltros);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchInput.value = "";
    aplicarFiltros();
  }
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  aplicarFiltros();
  searchInput.focus();
});

// ================= CART CLICK =================
cartIndicator.addEventListener("click", viewCart);

// ================= STATS =================
function stats() {
  statTotal.textContent = inventario.length;

  const totalValue = inventario.reduce((a, p) => a + (p.precio * p.stock), 0);
  statInventoryValue.textContent = "S/ " + totalValue.toFixed(2);

  const stock = inventario.reduce((a, p) => a + p.stock, 0);
  statInStock.textContent = stock;

  statPurchases.textContent = comprasHoy;
}

// ================= INIT =================
initTheme();
initCategorias();
updateCartCount();
render(inventario);