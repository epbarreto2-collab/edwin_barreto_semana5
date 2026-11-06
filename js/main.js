import { PRODUCTOS } from './datos.js';
import { estado, vaciarEstadoCarrito } from './estado.js';
import {
  reproducirSonidoSynth,
  reproducirSonidoCheckout,
  crearParticulaVoladora,
  toggleCartDrawer,
  efectoSobrecargaLogo,
  cerrarModalCheckout
} from './dom.js';
import {
  renderizarCatalogo,
  actualizarCarritoUI,
  actualizarResumenCarrito
} from './render.js';

/* --- REGISTRO DE FUNCIONES EN WINDOW PARA BOTONES INLINE (onclick) --- */

window.filtrarProductos = function() {
  renderizarCatalogo();
};

window.filtrarCategoria = function(cat, btnEl) {
  estado.categoriaSeleccionada = cat;

  document.querySelectorAll('#category-pills .categoria-btn')
    .forEach(b => b.classList.remove('activo'));

  if (btnEl) btnEl.classList.add('activo');

  renderizarCatalogo();
};

window.agregarAlCarrito = function(prodId, event) {
  const producto = PRODUCTOS.find(p => p.id === prodId);
  if (!producto) return;

  const itemExistente = estado.carrito.find(i => i.id === prodId);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    estado.carrito.push({ ...producto, cantidad: 1 });
  }

  if (event && event.currentTarget) {
    crearParticulaVoladora(event.currentTarget, actualizarCarritoUI);
  } else {
    actualizarCarritoUI();
  }

  renderizarCatalogo();
  reproducirSonidoSynth(600, 0.08);
};

window.cambiarCantidad = function(prodId, delta) {
  const item = estado.carrito.find(i => i.id === prodId);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    window.eliminarDelCarrito(prodId);
    return;
  }

  actualizarCarritoUI();
  renderizarCatalogo();
};

window.eliminarDelCarrito = function(prodId) {
  estado.carrito = estado.carrito.filter(i => i.id !== prodId);
  actualizarCarritoUI();
  renderizarCatalogo();
};

window.vaciarCarrito = function() {
  estado.carrito = [];
  actualizarCarritoUI();
  renderizarCatalogo();
};

window.aplicarCupon = function() {
  const input = document.getElementById('cuponInput');
  const msg = document.getElementById('cuponMsg');
  if (!input || !msg) return;

  const codigo = input.value.trim().toUpperCase();

  if (codigo === 'CYBER2026') {
    estado.descuentoPorcentaje = 15;
    msg.style.color = '#4ade80';
    msg.textContent = '✓ ¡Cupón CYBER2026 aplicado! (15% OFF)';
  } else if (codigo === 'NEON10') {
    estado.descuentoPorcentaje = 10;
    msg.style.color = '#4ade80';
    msg.textContent = '✓ ¡Cupón NEON10 aplicado! (10% OFF)';
  } else if (codigo === '') {
    estado.descuentoPorcentaje = 0;
    msg.textContent = '';
  } else {
    estado.descuentoPorcentaje = 0;
    msg.style.color = '#fca5a5';
    msg.textContent = '✕ Código de cupón inválido.';
  }

  actualizarResumenCarrito();
};

window.procesarCompra = function() {
  if (estado.carrito.length === 0) return;

  const totalVal = document.getElementById('totalVal').textContent;
  const orderId = '#CYBER-' + Math.floor(1000 + Math.random() * 9000);

  const orderIdEl = document.getElementById('modalOrderId');
  const totalPaidEl = document.getElementById('modalTotalPaid');
  if (orderIdEl) orderIdEl.textContent = orderId;
  if (totalPaidEl) totalPaidEl.textContent = totalVal;

  reproducirSonidoCheckout();

  toggleCartDrawer();
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('open');

  vaciarEstadoCarrito();

  const metodoEnvioEl = document.getElementById('metodoEnvio');
  const cuponInputEl = document.getElementById('cuponInput');
  const cuponMsgEl = document.getElementById('cuponMsg');

  if (metodoEnvioEl) metodoEnvioEl.selectedIndex = 0;
  if (cuponInputEl) cuponInputEl.value = '';
  if (cuponMsgEl) cuponMsgEl.textContent = '';

  actualizarCarritoUI();
  renderizarCatalogo();
};

window.toggleCartDrawer = toggleCartDrawer;
window.efectoSobrecargaLogo = efectoSobrecargaLogo;
window.cerrarModalCheckout = cerrarModalCheckout;
window.actualizarResumenCarrito = actualizarResumenCarrito;

/* --- EVENTOS INICIALES --- */
window.addEventListener('DOMContentLoaded', () => {
  renderizarCatalogo();
  actualizarCarritoUI();

  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY}px`);
  });
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const modal = document.getElementById('checkoutModal');

    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (modal) modal.classList.remove('open');
  }
});