export const estado = {
  carrito: [],
  descuentoPorcentaje: 0,
  categoriaSeleccionada: 'todos'
};

export function vaciarEstadoCarrito() {
  estado.carrito = [];
  estado.descuentoPorcentaje = 0;
}