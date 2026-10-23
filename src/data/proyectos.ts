import type { ImageMetadata } from 'astro';
import vito from '../assets/img/vito-110-cdi.jpg';
import trasera from '../assets/img/trasera-muebles-naranja.jpg';
import armarios from '../assets/img/armarios-columna-cama.jpg';
import lamas1 from '../assets/img/techo-lamas-cama-1.jpg';
import lamasLateral from '../assets/img/techo-lamas-lateral.jpg';
import interiorMadera from '../assets/img/interior-techo-madera.jpg';
import panelado from '../assets/img/panelado-hornacinas.jpg';
import cocinaExtraible from '../assets/img/modulo-cocina-extraible.jpg';
import cocinaPortatil from '../assets/img/modulo-cocina-portatil.jpg';
import goLamas from '../assets/img/modelo-go-cama-lamas.jpg';
import goInterior from '../assets/img/modelo-go-interior.jpg';
import claraboya from '../assets/img/techo-lamas-claraboya.jpg';
import jenAntes from '../assets/img/jennifer-antes.jpg';
import jenDespues from '../assets/img/jennifer-despues.jpg';
import jenMar from '../assets/img/jennifer-despues-mar.jpg';
import jenSuelo from '../assets/img/jennifer-proceso-suelo.jpg';
import advance from '../assets/img/modelo-advance.jpg';
import fullEquip from '../assets/img/modelo-full-equip.jpg';

/** Fotos de la empresa (web antigua, Google, Instagram, catálogo, vídeo) y de la clienta Jennifer (con su permiso). */
export type Proyecto = { img: ImageMetadata; titulo: string; detalle: string; tipo: string };

export const proyectos: Proyecto[] = [
  { img: vito, titulo: 'Mercedes Vito 110 CDI', detalle: 'Techo de lamas, tira LED y muebles de madera', tipo: 'Camperización completa' },
  { img: trasera, titulo: 'Bloque trasero', detalle: 'Cocina, cajones y armarios en madera', tipo: 'Camperización completa' },
  { img: lamas1, titulo: 'Techo de lamas', detalle: 'Suelo de madera y cama-banco abatible', tipo: 'Camperización completa' },
  { img: armarios, titulo: 'Armarios en columna', detalle: 'Cama elevable y almacenaje', tipo: 'Camperización completa' },
  { img: cocinaExtraible, titulo: 'Cocina extraíble', detalle: 'Módulo en el portón trasero', tipo: 'Kit camper' },
  { img: interiorMadera, titulo: 'Interior en madera', detalle: 'Techo oscuro, cama y cortinas', tipo: 'Camperización completa' },
  { img: goLamas, titulo: 'Modelo Go!', detalle: 'Estructura de cama de lamas', tipo: 'Modelo Go!' },
  { img: panelado, titulo: 'Panelado con hornacinas', detalle: 'Lateral blanco con huecos de madera', tipo: 'Muebles a medida' },
  { img: cocinaPortatil, titulo: 'Módulo de cocina', detalle: 'Mueble de madera para hornillo portátil', tipo: 'Kit camper' },
  { img: claraboya, titulo: 'Claraboya y encimera', detalle: 'Encimera de madera bajo la claraboya', tipo: 'Camperización completa' },
  { img: goInterior, titulo: 'Modelo Go!', detalle: 'Cajonera y cama en madera en crudo', tipo: 'Modelo Go!' },
  { img: lamasLateral, titulo: 'Vista lateral', detalle: 'Desde la puerta corredera', tipo: 'Camperización completa' },
  { img: jenSuelo, titulo: 'En el taller', detalle: 'Suelo y paneles antes de los muebles', tipo: 'Proceso' },
  { img: jenMar, titulo: 'Lista para viajar', detalle: 'La furgo de Jennifer, frente al mar', tipo: 'Camperización a medida' },
  { img: advance, titulo: 'Modelo Advance', detalle: 'Cocina fija con encimera de madera', tipo: 'Modelo Advance' },
  { img: fullEquip, titulo: 'Modelo Full Equip', detalle: 'Armarios en columna y claraboya', tipo: 'Modelo Full Equip' },
];

/** Pares ANTES / DESPUÉS reales del mismo vehículo (fotos de la reseña de Jennifer, con su permiso). */
export type AntesDespues = { antes: ImageMetadata; despues: ImageMetadata; titulo: string; detalle?: string };
export const antesDespues: AntesDespues[] = [
  { antes: jenAntes, despues: jenDespues, titulo: 'La furgo de Jennifer', detalle: 'De caja de carga vacía a camper a medida' },
];
