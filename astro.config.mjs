// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages: https://xlu1s.github.io/Web-punto-campers/
// Con dominio propio: SITE_URL=https://puntocampers.com BASE_PATH=/ npm run build
const site = process.env.SITE_URL || 'https://xlu1s.github.io';
const base = process.env.BASE_PATH ?? '/Web-punto-campers';

/** Página de prueba del slider antes/después: solo con PC_FIXTURES=1 (nunca en producción). */
const fixtures = {
  name: 'pc-fixtures',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (process.env.PC_FIXTURES === '1') {
        injectRoute({ pattern: '/prueba-antes-despues', entrypoint: './tests/fixtures/antes-despues.astro' });
      }
    },
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [sitemap({ filter: (p) => !p.includes('prueba-') && !p.includes('404') && p.endsWith('/') }), fixtures],
  build: { inlineStylesheets: 'auto' },
});
