// ============================================
//  EcoShop — app.js
//  Roles:
//    Lead:        inventario, filtrado, stock
//    UX/UI:       renderCards, detailPanel, theme
//    QA/Integr.:  localStorage, validaciones, toast
// ============================================

// ── MODELO DE DATOS ──────────────────────────
// Responsable: Desarrollador de Lógica (Lead)
const inventarioBase = [
  {
    id: 1,
    nombre: "Botella Bambú 500ml",
    precio: 42.90,
    categoria: "hogar",
    stock: 12,
    imagen: "🍶",
    descripcion: "Botella reutilizable fabricada 100% en bambú orgánico certificado. Mantiene la temperatura hasta 12 horas."
  },
  {
    id: 2,
    nombre: "Mochila Reciclada",
    precio: 129.00,
    categoria: "deportes",
    stock: 7,
    imagen: "🎒",
    descripcion: "Mochila elaborada con plástico reciclado del océano. 30 litros de capacidad, impermeable."
  },
  {
    id: 3,
    nombre: "Audífonos Solares",
    precio: 219.50,
    categoria: "tecnologia",
    stock: 5,
    imagen: "🎧",
    descripcion: "Audífonos Bluetooth con panel solar integrado en la diadema. Batería de 40 horas."
  },
  {
    id: 4,
    nombre: "Jabón Artesanal",
    precio: 18.00,
    categoria: "cuidado",
    stock: 0,
    imagen: "🧼",
    descripcion: "Jabón natural de avena y miel, sin parabenos ni sulfatos. Ideal para pieles sensibles."
  },
  {
    id: 5,
    nombre: "Lámpara Solar LED",
    precio: 85.00,
    categoria: "hogar",
    stock: 9,
    imagen: "🪔",
    descripcion: "Lámpara de exterior con carga solar. Enciende automáticamente al anochecer. IP65."
  },
  {
    id: 6,
    nombre: "Zapatillas Cáñamo",
    precio: 175.00,
    categoria: "deportes",
    stock: 3,
    imagen: "👟",
    descripcion: "Zapatillas confeccionadas con fibra de cáñamo y suela de caucho natural reciclado."
  },
  {
    id: 7,
    nombre: "Cargador Solar",
    precio: 98.00,
    categoria: "tecnologia",
    stock: 11,
    imagen: "☀️",
    descripcion: "Panel solar plegable de 20W. Compatible con smartphones, tablets y laptops. Con 2 puertos USB-C."
  },
  {
    id: 8,
    nombre: "Crema Facial Orgánica",
    precio: 55.00,
    categoria: "cuidado",
    stock: 6,
    imagen: "🧴",
    descripcion: "Crema hidratante con aloe vera y aceite de argán. Certificada orgánica. Sin microplásticos."
  },
  {
    id: 9,
    nombre: "Cuaderno Reciclado",
    precio: 24.50,
    categoria: "hogar",
    stock: 15,
    imagen: "📓",
    descripcion: "Cuaderno A5 de 120 hojas fabricadas con papel 100% reciclado. Tapa de madera."
  },
  {
    id: 10,
    nombre: "Smartwatch Eco",
    precio: 310.00,
    categoria: "tecnologia",
    stock: 2,
    imagen: "⌚",
    descripcion: "Smartwatch con carcasa de madera de bambú y correa reciclada. Monitor de salud completo."
  },
  {
    id: 11,
    nombre: "Kit Yoga Natural",
    precio: 145.00,
    categoria: "deportes",
    stock: 4,
    imagen: "🧘",
    descripcion: "Set incluye esterilla de corcho natural, bloque y cinta de lino orgánico. Antideslizante."
  },
  {
    id: 12,
    nombre: "Shampoo Sólido",
    precio: 28.00,
    categoria: "cuidado",
    stock: 8,
    imagen: "🌿",
    descripcion: "Shampoo en barra sin plástico. Fórmula vegana con aceite de coco y manteca de karité."
  }
];

// ── PERSISTENCIA EN localStorage ─────────────
// Responsable: QA & Integration Specialist
const STORAGE_KEY = 'ecoshop_inventario';
const PURCHASES_KEY = 'ecoshop_purchases';

const loadInventario = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge: conservar stock guardado, usar base para el resto
      return inventarioBase.map(base => {
        const savedItem = parsed.find(p => p.id === base.id);
        return savedItem ? { ...base, stock: Math.max(0, savedItem.stock) } : base;
      });
    }
  } catch (e) {
    console.warn('Error cargando inventario:', e);
  }
  return inventarioBase.map(p => ({ ...p }));
};

const saveInventario = () => {
  try {
    const toSave = inventario.map(({ id, stock }) => ({ id, stock }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Error guardando inventario:', e);
  }
};

const loadPurchases = () => {
  try {
    return parseInt(localStorage.getItem(PURCHASES_KEY) || '0', 10);
  } catch { return 0; }
};

const savePurchases = (n) => {
  try { localStorage.setItem(PURCHASES_KEY, String(n)); } catch {}
};

// ── ESTADO DE LA APLICACIÓN ───────────────────
let inventario = loadInventario();
let purchases  = loadPurchases();
let activeCategory = 'todos';
let searchQuery    = '';
let selectedId     = null;

// ── DOM REFS ──────────────────────────────────
const productGrid    = document.getElementById('productGrid');
const categoryFilters = document.getElementById('categoryFilters');
const searchInput    = document.getElementById('searchInput');
const clearSearch    = document.getElementById('clearSearch');
const emptyState     = document.getElementById('emptyState');
const resultsCount   = document.getElementById('resultsCount');
const statTotal      = document.getElementById('statTotal');
const statInventoryValue = document.getElementById('statInventoryValue');
const statInStock    = document.getElementById('statInStock');
const statPurchases  = document.getElementById('statPurchases');
const cartCount      = document.getElementById('cartCount');
const detailPanel    = document.getElementById('detailPanel');
const detailClose    = document.getElementById('detailClose');
const themeBtn       = document.getElementById('themeBtn');
const themeIcon      = document.getElementById('themeIcon');
const toast          = document.getElementById('toast');

// ============================================
//  TEMA CLARO / OSCURO
//  Responsable: UX/UI Designer
// ============================================
const savedTheme = localStorage.getItem('ecoshop_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ecoshop_theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ============================================
//  FILTRADO COMBINADO
//  Responsable: Desarrollador de Lógica (Lead)
// ============================================
const getFiltered = () => {
  return inventario.filter(p => {
    const matchCat = activeCategory === 'todos' || p.categoria === activeCategory;
    const matchSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
};

// ============================================
//  ESTADÍSTICAS
//  Responsable: Desarrollador de Lógica (Lead)
// ============================================
const updateStats = () => {
  const total = inventario.length;
  const valor = inventario.reduce((acc, p) => acc + p.precio * p.stock, 0);
  const inStock = inventario.filter(p => p.stock > 0).length;

  statTotal.textContent = total;
  statInventoryValue.textContent = `S/ ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  statInStock.textContent = inStock;
  statPurchases.textContent = purchases;
  cartCount.textContent = purchases;
};

// ============================================
//  CATEGORÍAS DINÁMICAS
// ============================================
const buildCategoryFilters = () => {
  const cats = ['todos', ...new Set(inventario.map(p => p.categoria))];
  categoryFilters.innerHTML = cats.map(cat => `
    <button class="cat-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">
      ${cat.charAt(0).toUpperCase() + cat.slice(1)}
    </button>
  `).join('');

  categoryFilters.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      categoryFilters.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });
};

// ============================================
//  SISTEMA DE COMPRA
//  Responsable: Desarrollador de Lógica (Lead)
//  Validación: QA & Integration Specialist
// ============================================
const comprar = (id, e) => {
  e.stopPropagation();

  const producto = inventario.find(p => p.id === id);
  if (!producto) return;

  // Validación: no permitir stock negativo
  if (producto.stock <= 0) {
    showToast(`❌ "${producto.nombre}" está agotado`);
    return;
  }

  producto.stock -= 1;
  purchases += 1;

  saveInventario();
  savePurchases(purchases);
  updateStats();
  render();

  showToast(`✅ "${producto.nombre}" agregado al carrito`);

  // Actualizar panel de detalle si está abierto
  if (selectedId === id) openDetail(id);
};

// ============================================
//  PANEL DE DETALLE
//  Responsable: UX/UI Designer
// ============================================
const openDetail = (id) => {
  const p = inventario.find(p => p.id === id);
  if (!p) return;

  selectedId = id;

  document.getElementById('detailImg').textContent  = p.imagen;
  document.getElementById('detailCat').textContent  = p.categoria;
  document.getElementById('detailName').textContent = p.nombre;
  document.getElementById('detailDesc').textContent = p.descripcion;
  document.getElementById('detailPrice').textContent = `S/ ${p.precio.toFixed(2)}`;

  const badge = document.getElementById('detailStockBadge');
  if (p.stock === 0) {
    badge.textContent = 'Agotado';
    badge.style.background = 'var(--danger-light)';
    badge.style.color = 'var(--danger)';
  } else {
    badge.textContent = `Stock: ${p.stock}`;
    badge.style.background = p.stock <= 3 ? 'var(--warning-light)' : 'var(--accent-light)';
    badge.style.color = p.stock <= 3 ? 'var(--warning)' : 'var(--accent)';
  }

  const buyBtn = document.getElementById('detailBuyBtn');
  buyBtn.disabled = p.stock === 0;
  buyBtn.textContent = p.stock === 0 ? 'Agotado' : 'Comprar ahora';
  buyBtn.onclick = (e) => comprar(id, e);

  detailPanel.classList.add('open');
};

const closeDetail = () => {
  detailPanel.classList.remove('open');
  selectedId = null;
  document.querySelectorAll('.product-card.selected').forEach(c => c.classList.remove('selected'));
};

detailClose.addEventListener('click', closeDetail);

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDetail();
});

// ============================================
//  RENDER TARJETAS
//  Responsable: UX/UI Designer
// ============================================
const render = () => {
  const filtered = getFiltered();

  resultsCount.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
  productGrid.style.display = filtered.length === 0 ? 'none' : 'grid';

  if (filtered.length === 0) return;

  productGrid.innerHTML = filtered.map((p, i) => {
    const isOut  = p.stock === 0;
    const isLow  = p.stock > 0 && p.stock <= 3;
    const dotClass = isOut ? 'out' : isLow ? 'low' : 'high';
    const stockText = isOut ? 'Agotado' : `${p.stock} disponibles`;
    const selected = p.id === selectedId ? 'selected' : '';

    return `
      <div
        class="product-card ${isOut ? 'sold-out' : ''} ${selected}"
        data-id="${p.id}"
        style="animation-delay: ${i * 0.04}s"
        onclick="handleCardClick(${p.id})"
      >
        <div class="card-img-wrap">
          <span>${p.imagen}</span>
          <span class="card-badge-out">Agotado</span>
          ${isLow ? `<span class="card-badge-low" style="display:block">¡Últimas!</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-cat">${p.categoria}</span>
          <h3 class="card-name">${p.nombre}</h3>
          <div class="card-price">S/ ${p.precio.toFixed(2)}</div>
        </div>
        <div class="card-footer">
          <div class="stock-indicator">
            <span class="stock-dot ${dotClass}"></span>
            <span>${stockText}</span>
          </div>
          <button
            class="buy-btn"
            onclick="comprar(${p.id}, event)"
            ${isOut ? 'disabled' : ''}
          >${isOut ? 'Agotado' : 'Comprar'}</button>
        </div>
      </div>
    `;
  }).join('');
};

// ── Click en tarjeta (zoom + detalle) ────────
const handleCardClick = (id) => {
  const p = inventario.find(p => p.id === id);
  if (!p || p.stock === 0) return;

  // Efecto de selección visual
  document.querySelectorAll('.product-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) card.classList.add('selected');

  openDetail(id);
};

// ============================================
//  BUSCADOR
// ============================================
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  clearSearch.classList.toggle('visible', searchQuery.length > 0);
  render();
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearch.classList.remove('visible');
  searchInput.focus();
  render();
});

// ============================================
//  TOAST NOTIFICATION
//  Responsable: QA & Integration Specialist
// ============================================
let toastTimer;
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
};

// ============================================
//  INICIALIZACIÓN
// ============================================
buildCategoryFilters();
updateStats();
render();