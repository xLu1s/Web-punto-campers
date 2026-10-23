/**
 * Modelos del "CATÁLOGO MÓVIL" de Punto Campers (21/05/2026). Precios con IVA incluido.
 * ⚠️ Pendiente de confirmar con el cliente: precios vigentes (el vídeo de YouTube del 22/09/2026 muestra 26.300 €),
 * y las incoherencias internas del catálogo (nevera, depósitos). Donde ficha y comparativa difieren se usa la ficha.
 */
export type Modelo = {
  id: string;
  nombre: string;
  lema: string;
  precio: number;
  furgo: string;
  plazas: number;
  intro: string;
  destacados: string[];
  incluye: { grupo: string; items: string[] }[];
};

export const modelos: Modelo[] = [
  {
    id: 'go',
    nombre: 'Go!',
    lema: 'Tu libertad empieza aquí',
    precio: 12000,
    furgo: 'L1H1 (compacta)',
    plazas: 3,
    intro:
      'Para furgos compactas y escapadas sin complicaciones: lo esencial para dormir y cocinar en un espacio funcional y ligero.',
    destacados: ['Sofá-cama', 'Batería AGM', 'Nevera 85 L', 'Ducha exterior'],
    incluye: [
      { grupo: 'Mobiliario', items: ['Aislante Kaiflex y panelado liso', 'Mobiliario en madera en crudo', 'Mueble para cocina portátil, sofá-cama y armario lateral', 'Claraboya Turbovent 40×40'] },
      { grupo: 'Energía', items: ['Instalación eléctrica básica', 'Batería AGM', 'Iluminación LED', 'Tomas USB', 'Nevera 85 L'] },
      { grupo: 'Agua', items: ['Depósitos de agua 25–50 L', 'Fregadero', 'Ducha exterior'] },
      { grupo: 'Cocina', items: ['Cocina portátil'] },
    ],
  },
  {
    id: 'start',
    nombre: 'Start',
    lema: 'El paso que lo cambia todo',
    precio: 13000,
    furgo: 'A partir de L2H2',
    plazas: 3,
    intro:
      'Para empezar a viajar sin una gran inversión: lo básico para dormir y escaparte, con comedor y cama, sin peso extra.',
    destacados: ['Comedor + cama', 'Batería AGM', 'Nevera 85 L', 'Ducha exterior'],
    incluye: [
      { grupo: 'Mobiliario', items: ['Aislante Kaiflex y panelado', 'Mobiliario en madera en crudo', 'Mueble para cocina portátil, comedor, cama y armario lateral', 'Claraboya Turbovent 40×40'] },
      { grupo: 'Energía', items: ['Instalación eléctrica básica', 'Batería AGM', 'Iluminación LED', 'Tomas USB', 'Nevera 85 L'] },
      { grupo: 'Agua', items: ['Depósitos de agua 25–50 L', 'Fregadero', 'Ducha exterior'] },
      { grupo: 'Cocina', items: ['Cocina portátil'] },
    ],
  },
  {
    id: 'advance',
    nombre: 'Advance',
    lema: 'El equilibrio que buscas',
    precio: 25000,
    furgo: 'A partir de L2H2',
    plazas: 4,
    intro:
      'Si vas a usar la furgo de verdad y quieres viajar cómodo: más autonomía y comodidad con una inversión equilibrada.',
    destacados: ['Litio 150 Ah', 'Solar 200–400 W', 'Ducha interior', 'Calefacción Autoterm 2D'],
    incluye: [
      { grupo: 'Mobiliario', items: ['2 plazas giratorias', 'Aislante + panelado', 'Mobiliario en HPL + encimera de madera natural', 'Mueble de cocina con fuego fijo, comedor, cama y armario superior', 'Ventanas correderas 70×40 y 60×45 cm', 'Claraboya Turbovent 40×40', 'Colchón'] },
      { grupo: 'Energía', items: ['Instalación eléctrica completa', 'Batería de litio 150 Ah', 'Placas solares 200–400 W', 'Inversor 1.500–2.000 W', 'Iluminación LED', 'Nevera 85 L'] },
      { grupo: 'Agua', items: ['Depósito de agua 100 L', 'Fregadero', 'Ducha interior', 'Calentador de agua (boiler)'] },
      { grupo: 'Cocina y clima', items: ['Cocina fija', 'Calefacción Autoterm 2D'] },
    ],
  },
  {
    id: 'full-equip',
    nombre: 'Full Equip',
    lema: 'Viaja a lo grande',
    precio: 36500,
    furgo: 'A partir de L2H2',
    plazas: 4,
    intro:
      'Una auténtica casa sobre ruedas: energía, agua y confort pensados para viajar sin depender de nada.',
    destacados: ['Litio 280 Ah', 'Solar 400–800 W', 'Aire acondicionado', 'Toldo Fiamma F45S'],
    incluye: [
      { grupo: 'Mobiliario', items: ['4 plazas (2 giratorias + 2 fijas)', 'Aislante + panelado (opción friso)', 'Mobiliario en HPL + madera natural', 'Cocina, comedor, cama, 2 armarios superiores y armario lateral', 'Ventana corredera 70×40 SRT y abatible 90×45 cm', 'Claraboyas Turbovent 40×40 y 70×50'] },
      { grupo: 'Energía', items: ['Batería de litio 280 Ah', 'Placas solares 400–800 W', 'Inversor 3.000–4.000 W', 'Sistema inteligente con centralita + app', 'Iluminación LED'] },
      { grupo: 'Agua', items: ['Depósitos de agua 115 L', 'Fregadero', 'Ducha interior y exterior'] },
      { grupo: 'Cocina, clima y confort', items: ['Fuego fijo y horno', 'Nevera de compresor 85 L', 'Calefacción Dualheat', 'Aire acondicionado', 'Toldo Fiamma F45S', 'Colchón premium'] },
    ],
  },
];

/** Tabla comparativa (página 6 del catálogo). `true` = incluido, `false` = no incluido. */
export const comparativa: { etiqueta: string; valores: (string | boolean)[] }[] = [
  { etiqueta: 'Plazas', valores: ['3', '3', '4', '4'] },
  { etiqueta: 'Tamaño de furgo', valores: ['L1H1', 'Desde L2H2', 'Desde L2H2', 'Desde L2H2'] },
  { etiqueta: 'Distribución', valores: ['Cocina + sofá-cama + armario lateral', 'Cocina + comedor + cama + armario lateral', 'Cocina + comedor + baño + cama + armario superior', 'Cocina + comedor + baño + cama + armarios superior y lateral'] },
  { etiqueta: 'Batería', valores: ['AGM', 'AGM', 'Litio 150 Ah', 'Litio 280 Ah'] },
  { etiqueta: 'Placa solar', valores: [false, false, '200–400 W', '400–800 W'] },
  { etiqueta: 'Inversor 220 V', valores: [false, false, '1.500–2.000 W', '3.000–4.000 W'] },
  { etiqueta: 'Sistema inteligente', valores: [false, false, 'Básico', 'Centralita + app'] },
  { etiqueta: 'Iluminación LED', valores: [true, true, true, true] },
  { etiqueta: 'Cocina', valores: ['Portátil', 'Portátil', 'Fija', 'Fija + horno'] },
  { etiqueta: 'Fregadero', valores: [true, true, true, true] },
  { etiqueta: 'Depósito de agua', valores: ['25–50 L', '25–50 L', '100 L', '115 L'] },
  { etiqueta: 'Ducha exterior', valores: [true, true, false, true] },
  { etiqueta: 'Ducha interior', valores: [false, false, true, true] },
  { etiqueta: 'Calentador de agua', valores: [false, false, true, true] },
  { etiqueta: 'Calefacción', valores: [false, false, 'Autoterm 2D', 'Dualheat'] },
  { etiqueta: 'Aire acondicionado', valores: [false, false, false, true] },
  { etiqueta: 'Colchón', valores: [false, false, true, 'Premium'] },
  { etiqueta: 'Toldo', valores: [false, false, false, 'Fiamma F45S'] },
  { etiqueta: 'Homologación', valores: [true, true, true, true] },
];

export const formatoPrecio = (n: number) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(n) + ' €';
