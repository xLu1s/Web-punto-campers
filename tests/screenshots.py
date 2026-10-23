"""Capturas: preview-hero.png (1280x800, con fotograma del vídeo), preview-desktop.png y preview-mobile.png (página completa).
Uso: npm run build && python3 tests/screenshots.py"""
import http.server, threading, functools, os, urllib.parse
from playwright.sync_api import sync_playwright
ROOT = os.path.join(os.path.dirname(__file__), '..', 'dist'); OUT = os.path.join(os.path.dirname(__file__), '..')
BASE = '/Web-punto-campers'
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = urllib.parse.urlparse(path).path
        if p.startswith(BASE): p = p[len(BASE):] or '/'
        return super().translate_path(p)
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 4398), functools.partial(H, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:4398{BASE}/'

def recorre(pg):
    h = pg.evaluate('document.body.scrollHeight')
    for y in range(0, h, 500):
        pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(120)
    pg.locator('[data-mapa]').scroll_into_view_if_needed(); pg.wait_for_timeout(5000)
    pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(1200)

with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 1280, 'height': 800})
    pg.goto(URL, wait_until='networkidle')
    pg.wait_for_function('() => { const v=document.querySelector("[data-hero-video]"); return v && v.currentTime > 6.4 && !v.paused }', timeout=20000)
    pg.wait_for_timeout(1500)
    print('video t=', pg.evaluate('document.querySelector("[data-hero-video]").currentTime'), pg.evaluate('document.querySelector("[data-hero-video]").currentSrc'))
    pg.screenshot(path=os.path.join(OUT, 'preview-hero.png'))
    recorre(pg)
    tag = pg.add_style_tag(content='.header,.wa-fab{visibility:hidden!important}')
    for sel, name in [('#antes-despues', 'preview-antes-despues.png'), ('#modelos .modelos', 'preview-modelos.png')]:
        el = pg.locator(sel); el.scroll_into_view_if_needed(); pg.wait_for_timeout(1500)
        el.screenshot(path=os.path.join(OUT, name))
    tag.evaluate('t => t.remove()')
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(500)
    pg.add_style_tag(content='.hero{min-height:800px!important}')
    h = pg.evaluate('document.documentElement.scrollHeight')
    pg.set_viewport_size({'width': 1280, 'height': h}); pg.wait_for_timeout(6000)
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector('.wa-fab').classList.add('is-visible')"); pg.wait_for_timeout(500)
    pg.screenshot(path=os.path.join(OUT, 'preview-desktop.png'), full_page=True)
    m = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    m.goto(URL, wait_until='networkidle'); m.wait_for_timeout(2500)
    recorre(m)
    m.add_style_tag(content='.hero{min-height:844px!important}')
    h = m.evaluate('document.documentElement.scrollHeight')
    m.set_viewport_size({'width': 390, 'height': h}); m.wait_for_timeout(6000)
    m.evaluate('window.scrollTo(0,0)'); m.wait_for_timeout(500)
    m.evaluate("document.querySelector('.wa-fab').classList.add('is-visible')"); m.wait_for_timeout(500)
    m.screenshot(path=os.path.join(OUT, 'preview-mobile.png'), full_page=True)
    b.close()
srv.shutdown()
