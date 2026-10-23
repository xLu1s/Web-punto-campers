# Punto Campers — web (v1, demo)

Web estática en Astro para **Punto Campers** (taller de camperización en Alcoi, Alicante).

- Producción: GitHub Pages → `https://xlu1s.github.io/Web-punto-campers/` (repo `xLu1s/Web-punto-campers`).
- `site`/`base` configurables: `SITE_URL=https://puntocampers.com BASE_PATH=/ npm run build`.
- Node 22.23.4+ (`~/.local/node22/bin`).

```bash
npm ci
npm run dev        # desarrollo
npm run build      # dist/
npm run build:test && python3 tests/test_site.py   # E2E: slider antes/después + formulario → WhatsApp
npm run build && python3 tests/screenshots.py      # preview-hero/desktop/mobile.png
```

## Dónde se cambian los datos
- `src/data/negocio.ts` — **único** archivo con teléfono, WhatsApp, email, dirección, horario, redes y nota de Google.
  Dirección confirmada: Carrer Filà Benimerins, 25, 03801 Alcoi.
- `src/data/modelos.ts` — modelos, fotos, precios (catálogo de mayo de 2026, IVA incl.; Advance 26.300 € según vídeo de YouTube) y tabla comparativa.
- `src/data/resenas.ts` — reseñas reales de Google (5★, en español).
- `src/data/proyectos.ts` — galería y pares **antes/después** (Jennifer, con permiso).
- `src/data/faq.ts` — FAQ de homologación.

## Notas
- Formulario sin backend: valida en cliente y abre `wa.me` con el mensaje (sin servicios de terceros).
- Mapa: Google Maps embed por dirección (sin API key), carga diferida.
- Vídeo del hero: vídeo de la web antigua del negocio, recortado a 21 s, sin audio (webm 1,8 MB / mp4 2,5 MB), con póster y respeto a `prefers-reduced-motion`.
- La página `/prueba-antes-despues/` solo se genera con `PC_FIXTURES=1` (tests), nunca en producción.
