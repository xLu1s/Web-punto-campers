"""Pruebas E2E con Playwright (Python): slider antes/después y formulario -> URL de WhatsApp.
Uso: npm run build:test && python3 tests/test_site.py  (sirve dist-test en :4399)"""
import http.server, threading, functools, os, sys, urllib.parse
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(__file__), '..', 'dist-test')
BASE = '/Web-punto-campers'

class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = urllib.parse.urlparse(path).path
        if p.startswith(BASE): p = p[len(BASE):] or '/'
        return super().translate_path(p)
    def log_message(self, *a): pass

srv = http.server.ThreadingHTTPServer(('127.0.0.1', 4399), functools.partial(H, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:4399{BASE}'
fallos = []
def check(cond, msg):
    print(('OK   ' if cond else 'FAIL ') + msg)
    if not cond: fallos.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---- Slider ----
    pg = b.new_page(viewport={'width': 1000, 'height': 800})
    pg.goto(f'{URL}/prueba-antes-despues/')
    ad = pg.locator('[data-ad]'); r = pg.locator('[data-ad-rango]')
    pos = lambda: ad.evaluate("e => e.style.getPropertyValue('--pos')")
    check(pos() == '50%', f'posición inicial 50% ({pos()})')
    box = ad.bounding_box()
    pg.mouse.move(box['x'] + box['width'] * .5, box['y'] + box['height'] / 2); pg.mouse.down()
    pg.mouse.move(box['x'] + box['width'] * .2, box['y'] + box['height'] / 2, steps=8); pg.mouse.up()
    v = int(pos().rstrip('%')); check(15 <= v <= 25, f'arrastre con ratón a ~20% ({v}%)')
    r.focus(); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight')
    v2 = int(pos().rstrip('%')); check(v2 == v + 2, f'teclado flecha derecha x2 ({v}% -> {v2}%)')
    pg.keyboard.press('End'); check(pos() == '100%', 'tecla Fin -> 100%')
    pg.keyboard.press('Home'); check(pos() == '0%', 'tecla Inicio -> 0%')
    check(r.get_attribute('aria-valuetext') == '0 % antes', 'aria-valuetext actualizado')
    clip = pg.locator('.ad__antes').evaluate('e => getComputedStyle(e).clipPath')
    check('inset' in clip, f'clip-path aplicado ({clip})')
    # táctil
    tp = b.new_page(viewport={'width': 390, 'height': 800}, has_touch=True, is_mobile=True)
    tp.goto(f'{URL}/prueba-antes-despues/')
    tb = tp.locator('[data-ad]').bounding_box()
    tp.touchscreen.tap(tb['x'] + tb['width'] * .8, tb['y'] + tb['height'] / 2)
    tv = int(tp.locator('[data-ad]').evaluate("e => e.style.getPropertyValue('--pos')").rstrip('%'))
    check(70 <= tv <= 90, f'toque en móvil a ~80% ({tv}%)')

    # ---- Slider en producción (portada) ----
    hp = b.new_page(viewport={'width': 1280, 'height': 900})
    hp.goto(f'{URL}/')
    ads = hp.locator('#proyectos [data-ad]')
    check(ads.count() >= 1, f'slider antes/después visible en la portada ({ads.count()})')
    hp.locator('#antes-despues').scroll_into_view_if_needed(); hp.wait_for_timeout(1200)
    check(ads.first.is_visible(), 'slider visible tras scroll')
    srcs = hp.locator('#proyectos [data-ad] img').evaluate_all('els => els.map(e => e.currentSrc || e.src)')
    check(any('jennifer-antes' in x for x in srcs) and any('jennifer-despues' in x for x in srcs), 'usa el par real de Jennifer')
    bb = ads.first.bounding_box()
    hp.mouse.move(bb['x'] + bb['width'] * .5, bb['y'] + bb['height'] / 2); hp.mouse.down()
    hp.mouse.move(bb['x'] + bb['width'] * .75, bb['y'] + bb['height'] / 2, steps=8); hp.mouse.up()
    pv = int(ads.first.evaluate("e => e.style.getPropertyValue('--pos')").rstrip('%'))
    check(70 <= pv <= 80, f'arrastre en portada a ~75% ({pv}%)')
    # ---- Precio Advance y dirección única ----
    html = hp.content()
    card = hp.locator('#m-advance').locator('xpath=..').inner_text()
    check('26.300' in card and '25.000' not in card, 'tarjeta Advance a 26.300 €')
    th = hp.locator('.tabla thead th').nth(3).inner_text()
    check('26.300' in th, f'tabla comparativa Advance 26.300 € ({th!r})')
    import json
    ld = [json.loads(x) for x in hp.locator('script[type="application/ld+json"]').all_text_contents()][0]
    prices = [o['price'] for o in ld[0]['makesOffer']]
    check(prices == [12000, 13000, 26300, 36500], f'JSON-LD ofertas {prices}')
    check('25.000' not in html and '25000' not in html, 'no queda 25.000 € en la página')
    check(ld[0]['address']['streetAddress'] == 'Carrer Filà Benimerins, 25', 'JSON-LD con la dirección confirmada')
    check('Vilaplana' not in html and 'Enginyer' not in html, 'sin dirección alternativa en la página')
    check(html.count('Benimerins') >= 3, 'dirección única Filà Benimerins en contacto/pie/mapa')
    msrc = hp.locator('[data-mapa]').get_attribute('data-src')
    check('Benimerins' in urllib.parse.unquote(msrc), 'mapa con Filà Benimerins')
    check(hp.locator('.modelo .modelo__foto img').count() == 4, 'foto en cada tarjeta de modelo')
    hp.close()

    # ---- Formulario ----
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    abiertas = []
    pg.context.on('page', lambda np: abiertas.append(np))
    pg.goto(f'{URL}/')
    pg.locator('#presupuesto').scroll_into_view_if_needed()
    pg.click('[data-form] button[type=submit]')
    inval = pg.locator('[data-form] [aria-invalid=true]').count()
    check(inval == 4, f'4 campos obligatorios marcados como inválidos ({inval})')
    check(pg.evaluate('document.activeElement.id') == 'f-nombre', 'foco en el primer campo con error')
    pg.fill('#f-nombre', 'Ana Pérez'); pg.fill('#f-telefono', '12')
    pg.fill('#f-furgoneta', 'Fiat Ducato L2H2'); pg.select_option('#f-servicio', 'Modelo Advance')
    pg.click('[data-form] button[type=submit]')
    check(pg.text_content('#e-telefono').startswith('Revisa'), 'teléfono corto rechazado')
    pg.fill('#f-telefono', '+34 612 345 678')
    pg.fill('#f-mensaje', 'Quiero ducha interior & calefacción. ¿Para marzo?')
    pg.click('[data-form] button[type=submit]')
    pg.wait_for_timeout(1500)
    url = pg.locator('[data-form]').get_attribute('data-wa-url') or ''
    check(url.startswith('https://wa.me/34601576041?text='), f'URL wa.me correcta')
    txt = urllib.parse.unquote(url.split('text=', 1)[1]) if 'text=' in url else ''
    for frag in ['Nombre: Ana Pérez', 'Teléfono: +34 612 345 678', 'Furgoneta: Fiat Ducato L2H2', 'Servicio: Modelo Advance', 'Mensaje: Quiero ducha interior & calefacción. ¿Para marzo?']:
        check(frag in txt, f'mensaje contiene «{frag}»')
    check('&' not in url.split('text=', 1)[1], 'texto bien codificado (sin & sin escapar)')
    check(pg.locator('[data-wa-link]').get_attribute('href') == url, 'enlace de respaldo con la misma URL')
    nuevas = [x.url for x in pg.context.pages if x != pg]
    check(len(nuevas) == 1 and 'whatsapp' in (nuevas[0] if nuevas else ''), f'se abre una pestaña nueva de WhatsApp ({nuevas})')
    # botón de modelo preselecciona servicio
    pg.click('a[data-modelo="Modelo Go!"]')
    check(pg.input_value('#f-servicio') == 'Modelo Go!', 'botón «Presupuesto Go!» preselecciona el modelo')
    # botón flotante
    fab = pg.locator('.wa-fab').get_attribute('href')
    check(fab.startswith('https://wa.me/34601576041'), 'botón flotante de WhatsApp')
    # mapa diferido
    pg.locator('[data-mapa]').scroll_into_view_if_needed(); pg.wait_for_timeout(400)
    src = pg.locator('[data-mapa] iframe').first.get_attribute('src') or ''
    check('google.com/maps?q=' in src and 'output=embed' in src, 'mapa Google embed (sin API key) cargado al acercarse')
    # vídeo hero
    vid = pg.locator('[data-hero-video]')
    check(vid.evaluate('v => v.muted && v.loop && v.playsInline'), 'vídeo muted/loop/playsinline')
    # reduced motion
    rm = b.new_page(reduced_motion='reduce'); rm.goto(f'{URL}/'); rm.wait_for_timeout(500)
    check(rm.locator('[data-hero-video]').evaluate('v => v.paused'), 'prefers-reduced-motion: vídeo en pausa')
    b.close()
srv.shutdown()
print('\n' + ('TODO OK' if not fallos else f'{len(fallos)} FALLO(S)'))
sys.exit(1 if fallos else 0)
