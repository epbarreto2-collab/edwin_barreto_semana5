import { PRODUCTOS } from './datos.js';
import { estado } from './estado.js';
import { calcularTotales, totalUnidadesCarrito } from './calculos.js';
import { crearProductoCardHTML, crearCartItemHTML } from './componentes.js';

export function renderizarCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const searchInput = document.getElementById('searchInput');
  const busqueda = searchInput ? searchInput.value.toLowerCase() : '';

  const productosFiltrados = PRODUCTOS.filter(p => {
    const coincideCategoria =
      (estado.categoriaSeleccionada === 'todos') ||
      (p.categoria === estado.categoriaSeleccionada);

    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda) ||
      p.desc.toLowerCase().includes(busqueda);

    return coincideCategoria && coincideBusqueda;
  });

  if (productosFiltrados.length === 0) {
    grid.innerHTML = `<div class="vacio" style="grid-column: 1 / -1;">No se encontraron productos que coincidan.</div>`;
    return;
  }

  productosFiltrados.forEach(prod => {
    const enCarrito = estado.carrito.some(item => item.id === prod.id);

    const card = document.createElement('div');
    card.className = `producto ${enCarrito ? 'en-carrito' : ''}`;
    card.id = `prod-card-${prod.id}`;
    card.innerHTML = crearProductoCardHTML(prod, enCarrito);

    grid.appendChild(card);
  });
}

export function actualizarResumenCarrito() {
  const metodoEnvioEl = document.getElementById('metodoEnvio');
  const envioSeleccionado = parseFloat((metodoEnvioEl && metodoEnvioEl.value) || 5);

  const res = calcularTotales(estado.carrito, estado.descuentoPorcentaje, envioSeleccionado);

  const subtotalEl = document.getElementById('subtotalVal');
  const envioEl = document.getElementById('envioVal');
  const ivaEl = document.getElementById('ivaVal');
  const totalEl = document.getElementById('totalVal');

  if (subtotalEl) subtotalEl.textContent = `$${res.subtotal.toFixed(2)}`;
  if (envioEl) envioEl.textContent = `$${res.envio.toFixed(2)}`;
  if (ivaEl) ivaEl.textContent = `$${res.iva.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${res.total.toFixed(2)}`;

  // Descuento por cantidad
  const lineaCantidad = document.getElementById('lineaDescuentoCantidad');
  if (res.montoDescuentoCantidad > 0 && lineaCantidad) {
    lineaCantidad.style.display = 'flex';
    const descCantVal = document.getElementById('descuentoCantidadVal');
    if (descCantVal) {
      descCantVal.textContent = `-$${res.montoDescuentoCantidad.toFixed(2)} (${Math.round(res.porcentajeCantidad * 100)}%)`;
    }
  } else if (lineaCantidad) {
    lineaCantidad.style.display = 'none';
  }

  // Descuento por cupón
  const lineaCupon = document.getElementById('lineaDescuento');
  if (res.montoDescuentoCupon > 0 && lineaCupon) {
    lineaCupon.style.display = 'flex';
    const descVal = document.getElementById('descuentoVal');
    if (descVal) {
      descVal.textContent = `-$${res.montoDescuentoCupon.toFixed(2)} (${estado.descuentoPorcentaje}%)`;
    }
  } else if (lineaCupon) {
    lineaCupon.style.display = 'none';
  }
}

export function actualizarCarritoUI() {
  const contenedor = document.getElementById('contenedorListaCarrito');
  const badge = document.getElementById('cart-badge');
  const btnVaciar = document.getElementById('btnVaciar');
  const btnComprar = document.getElementById('btnComprar');

  const totalItems = totalUnidadesCarrito(estado.carrito);
  if (badge) badge.textContent = totalItems;

  if (estado.carrito.length === 0) {
    if (contenedor) contenedor.innerHTML = `<div class="vacio">El carrito está vacío. ¡Añade algunos ítems tech!</div>`;
    if (btnVaciar) btnVaciar.disabled = true;
    if (btnComprar) btnComprar.disabled = true;
  } else {
    if (btnVaciar) btnVaciar.disabled = false;
    if (btnComprar) btnComprar.disabled = false;

    let html = '<ul class="lista-carrito">';
    estado.carrito.forEach(item => {
      html += crearCartItemHTML(item);
    });
    html += '</ul>';

    if (contenedor) contenedor.innerHTML = html;
  }

  actualizarResumenCarrito();
}