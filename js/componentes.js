export function crearProductoCardHTML(prod, enCarrito) {
  return `
    <div class="producto-img-box">
      ${prod.svgIcon}
    </div>
    <span class="categoria">${prod.categoria}</span>
    <div class="nombre">${prod.nombre}</div>
    <div class="desc">${prod.desc}</div>
    <div class="precio-row">
      <span class="precio">$${prod.precio.toFixed(2)}</span>
      <button class="btn-add" onclick="agregarAlCarrito(${prod.id}, event)">
        ${enCarrito ? '✓ En Carrito' : '+ Agregar'}
      </button>
    </div>
  `;
}

export function crearCartItemHTML(item) {
  return `
    <li class="item">
      <div class="detalle">
        <small>${item.categoria}</small>
        <div class="titulo-item">${item.nombre}</div>
        <div class="precio-item">
          $${(item.precio * item.cantidad).toFixed(2)}
          ($${item.precio.toFixed(2)} c/u)
        </div>
      </div>

      <div class="cantidad">
        <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
        <span style="font-weight:bold; width:20px; text-align:center;">
          ${item.cantidad}
        </span>
        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
      </div>

      <button class="quitar" title="Eliminar"
        onclick="eliminarDelCarrito(${item.id})">&times;</button>
    </li>
  `;
}