let inventario = JSON.parse(localStorage.getItem("inventarioEco")) || [
  {
    id: 1,
    nombre: "Botella Ecológica",
    precio: 25.5,
    categoria: "hogar",
    stock: 10,
    imagen: "https://picsum.photos/300?1",
    descripcion: "Botella reutilizable de acero inoxidable."
  },
  {
    id: 2,
    nombre: "Audífonos Bluetooth",
    precio: 120,
    categoria: "tecnologia",
    stock: 8,
    imagen: "https://picsum.photos/300?2",
    descripcion: "Audífonos inalámbricos con cancelación de ruido."
  },
  {
    id: 3,
    nombre: "Pelota Profesional",
    precio: 80,
    categoria: "deportes",
    stock: 6,
    imagen: "https://picsum.photos/300?3",
    descripcion: "Pelota oficial para entrenamiento."
  },
  {
    id: 4,
    nombre: "Laptop Gamer",
    precio: 3500,
    categoria: "tecnologia",
    stock: 3,
    imagen: "https://picsum.photos/300?4",
    descripcion: "Laptop de alto rendimiento."
  },
  {
    id: 5,
    nombre: "Silla Ergonómica",
    precio: 450,
    categoria: "hogar",
    stock: 5,
    imagen: "https://picsum.photos/300?5",
    descripcion: "Silla cómoda para oficina."
  },
  {
    id: 6,
    nombre: "Mancuernas",
    precio: 95,
    categoria: "deportes",
    stock: 7,
    imagen: "https://picsum.photos/300?6",
    descripcion: "Set de mancuernas ajustables."
  },
  {
    id: 7,
    nombre: "Smartwatch",
    precio: 320,
    categoria: "tecnologia",
    stock: 4,
    imagen: "https://picsum.photos/300?7",
    descripcion: "Reloj inteligente resistente al agua."
  },
  {
    id: 8,
    nombre: "Lámpara LED",
    precio: 60,
    categoria: "hogar",
    stock: 12,
    imagen: "https://picsum.photos/300?8",
    descripcion: "Lámpara moderna de bajo consumo."
  },
  {
    id: 9,
    nombre: "Yoga Mat",
    precio: 70,
    categoria: "deportes",
    stock: 9,
    imagen: "https://picsum.photos/300?9",
    descripcion: "Colchoneta antideslizante."
  },
  {
    id: 10,
    nombre: "Teclado Mecánico",
    precio: 180,
    categoria: "tecnologia",
    stock: 5,
    imagen: "https://picsum.photos/300?10",
    descripcion: "Teclado RGB para gaming."
  },
  {
    id: 11,
    nombre: "Organizador",
    precio: 40,
    categoria: "hogar",
    stock: 11,
    imagen: "https://picsum.photos/300?11",
    descripcion: "Caja organizadora multiusos."
  },
  {
    id: 12,
    nombre: "Bicicleta MTB",
    precio: 1200,
    categoria: "deportes",
    stock: 2,
    imagen: "https://picsum.photos/300?12",
    descripcion: "Bicicleta de montaña profesional."
  }
];

// Variables globales
let categoriaActual = "todos";
let carrito = JSON.parse(localStorage.getItem("carritoEco")) || [];
let comprasHoy = parseInt(localStorage.getItem("comprasHoy")) || 0;

// Elementos del DOM
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryFilters = document.getElementById("categoryFilters");
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const detailPanel = document.getElementById("detailPanel");
const detailClose = document.getElementById("detailClose");
const detailImg = document.getElementById("detailImg");
const detailCat = document.getElementById("detailCat");
const detailName = document.getElementById("detailName");
const detailDesc = document.getElementById("detailDesc");
const detailPrice = document.getElementById("detailPrice");
const detailStockBadge = document.getElementById("detailStockBadge");
const detailBuyBtn = document.getElementById("detailBuyBtn");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const cartCount = document.getElementById("cartCount");
const statTotal = document.getElementById("statTotal");
const statInventoryValue = document.getElementById("statInventoryValue");
const statInStock = document.getElementById("statInStock");
const statPurchases = document.getElementById("statPurchases");
const toast = document.getElementById("toast");

// Funciones de utilidad
function guardarLocal() {
  localStorage.setItem("inventarioEco", JSON.stringify(inventario));
  localStorage.setItem("carritoEco", JSON.stringify(carrito));
  localStorage.setItem("comprasHoy", comprasHoy);
}

function mostrarToast(mensaje, tipo = "success") {
  toast.textContent = mensaje;
  toast.className = `toast ${tipo}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function actualizarEstadisticas() {
  const totalProductos = inventario.length;
  const valorInventario = inventario.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  const enStock = inventario.filter(p => p.stock > 0).length;

  statTotal.textContent = totalProductos;
  statInventoryValue.textContent = `S/ ${valorInventario.toFixed(2)}`;
  statInStock.textContent = enStock;
  statPurchases.textContent = comprasHoy;
}

function actualizarCarrito() {
  cartCount.textContent = carrito.length;
}

// Generar filtros de categoría dinámicamente
function generarFiltrosCategoria() {
  const categorias = ["todos", ...new Set(inventario.map(p => p.categoria))];
  categoryFilters.innerHTML = "";

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `category-btn ${cat === categoriaActual ? "active" : ""}`;
    btn.textContent = cat === "todos" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.dataset.categoria = cat;
    btn.addEventListener("click", () => {
      categoriaActual = cat;
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      aplicarFiltros();
    });
    categoryFilters.appendChild(btn);
  });
}

// Mostrar productos
function mostrarProductos(productos) {
  productGrid.innerHTML = "";
  emptyState.style.display = productos.length === 0 ? "block" : "none";
  resultsCount.textContent = `${productos.length} producto${productos.length !== 1 ? "s" : ""} encontrado${productos.length !== 1 ? "s" : ""}`;

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.className = "product-card";
    if (producto.stock === 0) card.classList.add("out-of-stock");

    card.innerHTML = `
      <div class="product-img">
        <span>${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : "📦"}</span>
      </div>
      <div class="product-info">
        <span class="product-cat">${producto.categoria}</span>
        <h3 class="product-name">${producto.nombre}</h3>
        <p class="product-price">S/ ${producto.precio.toFixed(2)}</p>
        <div class="product-footer">
          <span class="product-stock ${producto.stock > 0 ? "in-stock" : "out-of-stock"}">
            ${producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
          </span>
          <button class="buy-btn ${producto.stock === 0 ? "disabled" : ""}" data-id="${producto.id}">
            ${producto.stock === 0 ? "Sin stock" : "Comprar"}
          </button>
        </div>
      </div>
    `;

    card.addEventListener("click", () => mostrarDetalle(producto));
    card.querySelector(".buy-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      comprarProducto(producto.id);
    });

    productGrid.appendChild(card);
  });
}

// Mostrar detalle del producto
function mostrarDetalle(producto) {
  detailImg.innerHTML = producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : "📦";
  detailCat.textContent = producto.categoria;
  detailName.textContent = producto.nombre;
  detailDesc.textContent = producto.descripcion;
  detailPrice.textContent = `S/ ${producto.precio.toFixed(2)}`;
  detailStockBadge.textContent = producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado";
  detailStockBadge.className = `detail-stock-badge ${producto.stock > 0 ? "in-stock" : "out-of-stock"}`;
  detailBuyBtn.disabled = producto.stock === 0;
  detailBuyBtn.textContent = producto.stock === 0 ? "Sin stock" : "Comprar ahora";
  detailBuyBtn.dataset.id = producto.id;

  detailPanel.classList.add("open");
}

// Cerrar detalle
function cerrarDetalle() {
  detailPanel.classList.remove("open");
}

// Comprar producto
function comprarProducto(id) {
  const producto = inventario.find(p => p.id === id);
  if (producto && producto.stock > 0) {
    producto.stock--;
    carrito.push(producto);
    comprasHoy++;
    guardarLocal();
    actualizarEstadisticas();
    actualizarCarrito();
    aplicarFiltros();
    mostrarToast(`¡${producto.nombre} agregado al carrito!`);
    if (detailPanel.classList.contains("open")) {
      cerrarDetalle();
    }
  }
}

// Aplicar filtros
function aplicarFiltros() {
  const query = searchInput.value.toLowerCase();
  let filtrados = inventario.filter(p => {
    const coincideCategoria = categoriaActual === "todos" || p.categoria === categoriaActual;
    const coincideBusqueda = p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query);
    return coincideCategoria && coincideBusqueda;
  });
  mostrarProductos(filtrados);
}

// Toggle tema
function toggleTema() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  themeIcon.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("temaEco", isDark ? "light" : "dark");
}

// Inicialización
function init() {
  // Cargar tema
  const temaGuardado = localStorage.getItem("temaEco") || "light";
  document.documentElement.setAttribute("data-theme", temaGuardado);
  themeIcon.textContent = temaGuardado === "dark" ? "☀️" : "🌙";

  // Generar filtros
  generarFiltrosCategoria();

  // Mostrar productos iniciales
  aplicarFiltros();

  // Actualizar estadísticas y carrito
  actualizarEstadisticas();
  actualizarCarrito();

  // Event listeners
  searchInput.addEventListener("input", aplicarFiltros);
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    aplicarFiltros();
  });
  detailClose.addEventListener("click", cerrarDetalle);
  detailBuyBtn.addEventListener("click", (e) => comprarProducto(e.target.dataset.id));
  themeBtn.addEventListener("click", toggleTema);

  // Cerrar detalle al hacer clic fuera
  detailPanel.addEventListener("click", (e) => {
    if (e.target === detailPanel) cerrarDetalle();
  });
}

// Iniciar aplicación
init();