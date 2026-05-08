// =========================
// 🌿 ECO SHOP - INVENTARIO
// =========================

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

// =========================
// 🎯 ELEMENTOS DEL DOM (CORREGIDOS)
// =========================

const contenedor = document.getElementById("productGrid");
const buscador = document.getElementById("searchInput");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

const totalProductos = document.getElementById("statTotal");
const valorInventario = document.getElementById("statInventoryValue");
const stockTotal = document.getElementById("statInStock");

const detallePanel = document.getElementById("detailPanel");
const detailName = document.getElementById("detailName");
const detailCat = document.getElementById("detailCat");
const detailPrice = document.getElementById("detailPrice");
const detailDesc = document.getElementById("detailDesc");
const detailStock = document.getElementById("detailStockBadge");
const detailImg = document.getElementById("detailImg");
const detailClose = document.getElementById("detailClose");

const emptyState = document.getElementById("emptyState");

let categoriaActual = "todos";

// =========================
// 💾 LOCALSTORAGE
// =========================

function guardar() {
  localStorage.setItem("inventarioEco", JSON.stringify(inventario));
}

// =========================
// 🧱 RENDER PRODUCTOS
// =========================

function render() {
  contenedor.innerHTML = "";

  const texto = buscador.value.toLowerCase();

  let filtrados = inventario.filter(p => {
    return (
      (categoriaActual === "todos" || p.categoria === categoriaActual) &&
      p.nombre.toLowerCase().includes(texto)
    );
  });

  if (filtrados.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    if (p.stock === 0) card.classList.add("agotado");

    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>S/ ${p.precio}</p>
      <p>Stock: ${p.stock > 0 ? p.stock : "Agotado"}</p>
      <button ${p.stock === 0 ? "disabled" : ""}>
        ${p.stock === 0 ? "Agotado" : "Comprar"}
      </button>
    `;

    // CLICK DETALLE
    card.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        mostrarDetalle(p);
      }
    });

    // COMPRA
    const btn = card.querySelector("button");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      comprar(p.id);
    });

    contenedor.appendChild(card);
  });

  actualizarStats();
}

// =========================
// 🛒 COMPRA
// =========================

function comprar(id) {
  const p = inventario.find(x => x.id === id);

  if (p.stock > 0) {
    p.stock--;
    guardar();
    render();
  }
}

// =========================
// 👁 DETALLE
// =========================

function mostrarDetalle(p) {
  detallePanel.classList.add("active");

  detailName.textContent = p.nombre;
  detailCat.textContent = p.categoria;
  detailPrice.textContent = "S/ " + p.precio;
  detailDesc.textContent = p.descripcion;
  detailStock.textContent = "Stock: " + p.stock;
  detailImg.textContent = "🌿";
}

// cerrar panel
detailClose.addEventListener("click", () => {
  detallePanel.classList.remove("active");
});

// =========================
// 📊 ESTADÍSTICAS
// =========================

function actualizarStats() {
  totalProductos.textContent = inventario.length;

  let valor = inventario.reduce((acc, p) => acc + p.precio * p.stock, 0);
  valorInventario.textContent = "S/ " + valor.toFixed(2);

  let stock = inventario.reduce((acc, p) => acc + p.stock, 0);
  stockTotal.textContent = stock;
}

// =========================
// 🔎 BUSCADOR
// =========================

buscador.addEventListener("input", render);

// =========================
// 🧩 FILTROS
// =========================

botonesFiltro.forEach(btn => {
  btn.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    categoriaActual = btn.dataset.categoria;
    render();
  });
});

// =========================
// 🚀 INICIO
// =========================

render();