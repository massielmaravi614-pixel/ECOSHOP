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

// ---------- VARIABLES ----------

const contenedor = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

const totalProductos = document.getElementById("totalProductos");
const valorInventario = document.getElementById("valorInventario");

const detalle = document.getElementById("detalle");

let categoriaActual = "todos";

// ---------- GUARDAR LOCAL ----------

function guardarLocal() {
  localStorage.setItem("inventarioEco", JSON.stringify(inventario));
}

// ---------- MOSTRAR PRODUCTOS ----------

function mostrarProductos(lista) {

  contenedor.innerHTML = "";

  lista.forEach(producto => {

    const card = document.createElement("div");
    card.classList.add("card");

    // estado agotado
    if (producto.stock === 0) {
      card.classList.add("agotado");
    }

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">

      <h2>${producto.nombre}</h2>

      <p class="precio">S/ ${producto.precio}</p>

      <p class="stock">
        Stock: ${producto.stock > 0 ? producto.stock : "Agotado"}
      </p>

      <button 
        class="btn-comprar"
        ${producto.stock === 0 ? "disabled" : ""}
      >
        ${producto.stock === 0 ? "Sin stock" : "Comprar"}
      </button>
    `;

    // -------- ANIMACIÓN SELECCIÓN --------

    card.addEventListener("click", () => {

      document.querySelectorAll(".card").forEach(c => {
        c.classList.remove("seleccionado");
      });

      card.classList.add("seleccionado");

      mostrarDetalle(producto);
    });

    // -------- COMPRA --------

    const boton = card.querySelector(".btn-comprar");

    boton.addEventListener("click", (e) => {

      e.stopPropagation();

      comprarProducto(producto.id);
    });

    contenedor.appendChild(card);
  });

  actualizarEstadisticas();
}

// ---------- DETALLE ----------

function mostrarDetalle(producto) {

  detalle.innerHTML = `
    <div class="detalle-box fade">
      <img src="${producto.imagen}" width="200">

      <div>
        <h2>${producto.nombre}</h2>

        <p>${producto.descripcion}</p>

        <p><strong>Categoría:</strong> ${producto.categoria}</p>

        <p><strong>Precio:</strong> S/ ${producto.precio}</p>

        <p><strong>Stock:</strong> ${producto.stock}</p>
      </div>
    </div>
  `;
}

// ---------- COMPRAR ----------

function comprarProducto(id) {

  const producto = inventario.find(p => p.id === id);

  // evitar negativos
  if (producto.stock > 0) {

    producto.stock--;

    guardarLocal();

    aplicarFiltros();

    // animación compra
    detalle.classList.add("shake");

    setTimeout(() => {
      detalle.classList.remove("shake");
    }, 500);
  }
}

// ---------- FILTROS ----------

function aplicarFiltros() {

  const texto = buscador.value.toLowerCase();

  let filtrados = inventario.filter(producto => {

    const coincideCategoria =
      categoriaActual === "todos" ||
      producto.categoria === categoriaActual;

    const coincideTexto =
      producto.nombre.toLowerCase().includes(texto);

    return coincideCategoria && coincideTexto;
  });

  mostrarProductos(filtrados);
}

// ---------- BOTONES FILTRO ----------

botonesFiltro.forEach(btn => {

  btn.addEventListener("click", () => {

    botonesFiltro.forEach(b => {
      b.classList.remove("activo");
    });

    btn.classList.add("activo");

    categoriaActual = btn.dataset.categoria;

    aplicarFiltros();
  });
});

// ---------- BUSCADOR EN VIVO ----------

buscador.addEventListener("input", aplicarFiltros);

// ---------- ESTADÍSTICAS ----------

function actualizarEstadisticas() {

  totalProductos.textContent = inventario.length;

  const total = inventario.reduce((acc, producto) => {
    return acc + (producto.precio * producto.stock);
  }, 0);

  valorInventario.textContent = `S/ ${total.toFixed(2)}`;
}

// ---------- MODO OSCURO ----------

const btnModo = document.getElementById("modoOscuro");

btnModo.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  btnModo.textContent =
    document.body.classList.contains("dark")
      ? "☀️ Modo Claro"
      : "🌙 Modo Oscuro";
});

// ---------- INICIO ----------

mostrarProductos(inventario);