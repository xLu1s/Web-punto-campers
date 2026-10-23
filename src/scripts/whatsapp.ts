export type DatosPresupuesto = { nombre: string; telefono: string; furgoneta: string; servicio: string; mensaje?: string };
export type Errores = Partial<Record<keyof DatosPresupuesto, string>>;

const limpia = (s: string | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

export function validar(d: DatosPresupuesto): Errores {
  const e: Errores = {};
  if (limpia(d.nombre).length < 2) e.nombre = 'Escribe tu nombre.';
  const digitos = (d.telefono ?? '').replace(/\D/g, '');
  if (!digitos) e.telefono = 'Escribe un teléfono de contacto.';
  else if (!/^\+?[\d\s().-]+$/.test((d.telefono ?? '').trim()) || digitos.length < 9 || digitos.length > 15)
    e.telefono = 'Revisa el teléfono: debe tener al menos 9 cifras.';
  if (limpia(d.furgoneta).length < 2) e.furgoneta = 'Indica la marca y el modelo de tu furgoneta.';
  if (!limpia(d.servicio)) e.servicio = 'Elige el tipo de servicio.';
  if ((d.mensaje ?? '').length > 1000) e.mensaje = 'El mensaje es demasiado largo (máx. 1000 caracteres).';
  return e;
}

export function mensajeWhatsApp(d: DatosPresupuesto): string {
  const lineas = [
    'Hola, Punto Campers. Quiero pedir presupuesto.',
    '',
    `Nombre: ${limpia(d.nombre)}`,
    `Teléfono: ${limpia(d.telefono)}`,
    `Furgoneta: ${limpia(d.furgoneta)}`,
    `Servicio: ${limpia(d.servicio)}`,
  ];
  const m = (d.mensaje ?? '').trim();
  if (m) lineas.push('', `Mensaje: ${m}`);
  return lineas.join('\n');
}

export const urlWhatsApp = (numero: string, d: DatosPresupuesto) =>
  `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensajeWhatsApp(d))}`;
