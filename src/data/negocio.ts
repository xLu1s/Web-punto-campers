/**
 * ÚNICA fuente de datos de contacto del negocio.
 * Origen: brief.md (Google Maps, OSM, web antigua, BORME). Dirección confirmada por el cliente: Carrer Filà Benimerins, 25.
 */
export const direccion = {
  calle: 'Carrer Filà Benimerins, 25',
  cp: '03801',
  localidad: 'Alcoi',
  provincia: 'Alicante',
  pais: 'ES',
  geo: { lat: 38.68483, lng: -0.48853 },
};

export const negocio = {
  nombre: 'Punto Campers',
  razonSocial: 'Punto Campers SL',
  cif: 'B26632521',
  descripcion:
    'Taller de camperización de furgonetas en Alcoi (Alicante): camperizaciones completas, kits camper, muebles a medida, electricidad, agua y calefacción, y homologación para la ITV.',
  telefono: '+34 601 57 60 41',
  telefonoE164: '+34601576041',
  whatsapp: '34601576041',
  email: 'puntocampers@gmail.com',
  direccion,
  // Lunes a jueves 08:00–14:00 y 15:30–18:00 · viernes 08:00–14:00 (Google Maps y OSM coinciden)
  horario: [
    { dias: 'Lunes a jueves', horas: '08:00–14:00 · 15:30–18:00' },
    { dias: 'Viernes', horas: '08:00–14:00' },
    { dias: 'Sábado y domingo', horas: 'Cerrado' },
  ],
  horarioSchema: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '08:00', closes: '14:00' },
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '15:30', closes: '18:00' },
    { dayOfWeek: ['Friday'], opens: '08:00', closes: '14:00' },
  ],
  google: { nota: 4.9, resenas: 13, url: 'https://www.google.com/maps/place/?q=place_id:ChIJbdoNTYOHYQ0R5uP7ECS-iVo' },
  redes: {
    instagram: 'https://www.instagram.com/puntocampers/',
    tiktok: 'https://www.tiktok.com/@puntocampers',
    youtube: 'https://www.youtube.com/@puntocampers',
  },
  accesible: true, // "Entrada accesible para personas en silla de ruedas" (Google Maps)
};

export const direccionTexto = (d = negocio.direccion) => `${d.calle}, ${d.cp} ${d.localidad} (${d.provincia})`;

export const mapaEmbedUrl = (d = negocio.direccion) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${d.calle}, ${d.cp} ${d.localidad}, ${d.provincia}`)}&output=embed&hl=es`;

export const mapaEnlace = (d = negocio.direccion) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Punto Campers, ${d.calle}, ${d.cp} ${d.localidad}`)}`;
