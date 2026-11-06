export const IVA = 0.15;

export function totalUnidadesCarrito(carrito) {
  return carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

export function porcentajeDescuentoCantidad(unidades) {
  if (unidades >= 10) return 0.10;
  if (unidades >= 5) return 0.05;
  return 0;
}

export function calcularTotales(carrito, descuentoPorcentaje, envioSeleccionado) {
  const subtotal = carrito.reduce(
    (acc, item) => acc + (item.precio * item.cantidad),
    0
  );

  const unidades = totalUnidadesCarrito(carrito);
  const porcentajeCantidad = porcentajeDescuentoCantidad(unidades);
  const montoDescuentoCantidad = subtotal * porcentajeCantidad;
  const montoDescuentoCupon = subtotal * (descuentoPorcentaje / 100);

  const descuentoTotal = Math.min(
    subtotal,
    montoDescuentoCantidad + montoDescuentoCupon
  );

  const envio = subtotal > 0 ? envioSeleccionado : 0;
  const baseImponible = Math.max(0, subtotal - descuentoTotal + envio);
  const iva = baseImponible * IVA;
  const total = baseImponible + iva;

  return {
    subtotal,
    unidades,
    porcentajeCantidad,
    montoDescuentoCantidad,
    montoDescuentoCupon,
    descuentoTotal,
    envio,
    baseImponible,
    iva,
    total
  };
}