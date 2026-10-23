import { validar, urlWhatsApp, type DatosPresupuesto } from './whatsapp';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));

/* Header sólido al hacer scroll */
const header = $('[data-header]');
const fab = $('.wa-fab');
const onScroll = () => {
  header?.classList.toggle('is-solido', window.scrollY > 40);
  fab?.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* Menú móvil */
const menuBtn = $('[data-menu-btn]');
const menu = $('[data-menu]');
const setMenu = (open: boolean) => {
  menuBtn?.setAttribute('aria-expanded', String(open));
  menu?.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* Vídeo del hero: respeta prefers-reduced-motion y botón de pausa */
const video = $<HTMLVideoElement>('[data-hero-video]');
const toggle = $('[data-video-toggle]');
const setIcon = (paused: boolean) => {
  if (!toggle) return;
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'Reproducir vídeo de fondo' : 'Pausar vídeo de fondo');
  $('[data-icon-pause]', toggle)?.toggleAttribute('hidden', paused);
  $('[data-icon-play]', toggle)?.toggleAttribute('hidden', !paused);
};
if (video) {
  if (reduce.matches) { video.removeAttribute('autoplay'); video.pause(); setIcon(true); }
  else video.play().catch(() => setIcon(true));
  toggle?.addEventListener('click', () => {
    if (video.paused) { video.play(); setIcon(false); } else { video.pause(); setIcon(true); }
  });
}

/* Reveals + dibujo de triángulos + contadores */
const fmt = (n: number, dec: number) => n.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const cuenta = (el: HTMLElement) => {
  const fin = parseFloat(el.dataset.count || '0');
  const dec = parseInt(el.dataset.decimals || '0', 10);
  if (reduce.matches) { el.textContent = fmt(fin, dec); return; }
  const t0 = performance.now(); const dur = 1300;
  const paso = (t: number) => {
    const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(fin * e, dec);
    if (k < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
};
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement;
      el.classList.add('is-in');
      $$<HTMLElement>('[data-count]', el).forEach(cuenta);
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el) => io.observe(el));
}

/* Lightbox de la galería */
const dlg = $<HTMLDialogElement>('[data-lightbox-dialog]');
$$<HTMLButtonElement>('[data-lightbox]').forEach((b) => b.addEventListener('click', () => {
  if (!dlg) return;
  const img = $<HTMLImageElement>('[data-lightbox-img]', dlg)!;
  img.src = b.dataset.lightbox!; img.alt = b.dataset.caption || '';
  $('[data-lightbox-cap]', dlg)!.textContent = b.dataset.caption || '';
  dlg.showModal();
}));
$('[data-lightbox-close]')?.addEventListener('click', () => dlg?.close());
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

/* Slider antes/después: input range nativo (ratón, táctil y teclado) */
$$('[data-ad]').forEach((ad) => {
  const r = $<HTMLInputElement>('[data-ad-rango]', ad)!;
  const set = () => {
    ad.style.setProperty('--pos', `${r.value}%`);
    r.setAttribute('aria-valuetext', `${r.value} % antes`);
  };
  r.addEventListener('input', set);
  set();
});

/* YouTube lite: el iframe solo se carga al pulsar */
$$<HTMLButtonElement>('[data-yt]').forEach((b) => b.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
  f.title = b.dataset.ytTitle || 'Vídeo de YouTube';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.allowFullscreen = true;
  const wrap = document.createElement('div');
  wrap.className = 'lite-yt'; wrap.appendChild(f);
  b.replaceWith(wrap);
  f.focus();
}, { once: true }));

/* Mapa: carga diferida cuando se acerca a la pantalla */
const mapa = $('[data-mapa]');
if (mapa) {
  const carga = () => {
    if (mapa.querySelector('iframe:not(noscript iframe)')) return;
    const f = document.createElement('iframe');
    f.src = mapa.dataset.src!; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.title = 'Mapa: ubicación del taller de Punto Campers en Alcoi';
    mapa.appendChild(f);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { carga(); io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(mapa);
  } else carga();
}

/* Formulario -> WhatsApp */
const form = $<HTMLFormElement>('[data-form]');
const selServicio = $<HTMLSelectElement>('#f-servicio');
$$<HTMLAnchorElement>('[data-modelo], [data-servicio]').forEach((a) => a.addEventListener('click', () => {
  if (!selServicio) return;
  const v = a.dataset.modelo || '';
  const map: Record<string, string> = {
    'Camperizaciones completas': 'Camperización a medida', 'Kits camper a medida': 'Kit camper (a medida, modular o automontaje)',
    'Muebles a medida': 'Muebles a medida', 'Homologación ITV': 'Homologación ITV',
    'Electricidad, agua y calefacción': 'Electricidad, agua o calefacción', 'Reparaciones y modificaciones': 'Reparación o modificación',
  };
  const val = v || map[a.dataset.servicio || ''] || '';
  if (val && Array.from(selServicio.options).some((o) => o.value === val)) selServicio.value = val;
}));
if (form) {
  const estado = $('[data-form-estado]', form)!;
  const campos = ['nombre', 'telefono', 'furgoneta', 'servicio', 'mensaje'] as const;
  const lee = (): DatosPresupuesto => {
    const fd = new FormData(form);
    return Object.fromEntries(campos.map((c) => [c, String(fd.get(c) ?? '')])) as DatosPresupuesto;
  };
  const pinta = (errores: ReturnType<typeof validar>) => {
    for (const c of campos) {
      const el = form.elements.namedItem(c) as HTMLInputElement | null;
      const msg = errores[c] || '';
      el?.setAttribute('aria-invalid', String(Boolean(msg)));
      const p = document.getElementById(`e-${c}`); if (p) p.textContent = msg;
    }
  };
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.getAttribute('aria-invalid') === 'true') {
      const err = validar(lee())[t.name as keyof DatosPresupuesto];
      if (!err) { t.setAttribute('aria-invalid', 'false'); const p = document.getElementById(`e-${t.name}`); if (p) p.textContent = ''; }
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = lee();
    const errores = validar(d);
    pinta(errores);
    const primero = campos.find((c) => errores[c]);
    if (primero) {
      (form.elements.namedItem(primero) as HTMLElement).focus();
      estado.hidden = true;
      return;
    }
    const url = urlWhatsApp(form.dataset.wa || '', d);
    form.dataset.waUrl = url;
    estado.hidden = false;
    estado.innerHTML = '';
    estado.append('Abriendo WhatsApp con tu mensaje… Si no se abre, ');
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'pulsa aquí para enviarlo';
    a.setAttribute('data-wa-link', '');
    estado.append(a, '.');
    window.open(url, '_blank', 'noopener');
  });
}
