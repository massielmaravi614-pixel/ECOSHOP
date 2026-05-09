// ================= DATOS =================
let inventario = JSON.parse(localStorage.getItem("inventarioEco")) || [
  { id: 1, nombre: "Botella Ecológica", precio: 25.5, categoria: "hogar", stock: 10, imagen: "https://picsum.photos/300?1", descripcion: "Botella reutilizable de acero inoxidable." },
  { id: 2, nombre: "Audífonos Bluetooth", precio: 120, categoria: "tecnologia", stock: 8, imagen: "https://picsum.photos/300?2", descripcion: "Audífonos inalámbricos con cancelación de ruido." },
  { id: 3, nombre: "Pelota Profesional", precio: 80, categoria: "deportes", stock: 6, imagen: "https://picsum.photos/300?3", descripcion: "Pelota oficial para entrenamiento." }
  // TODO tu inventario completo...
];

let carrito = JSON.parse(localStorage.getItem("carritoEco")) || [];
let comprasHoy = JSON.parse(localStorage.getItem("comprasHoyEco")) || 0;
let currentTheme = localStorage.getItem("themeEco") || "light";

let categoriaActual = "todos";