/* Brandboy — medición con Google Analytics 4, solo con permiso del visitante. */
var BB_CONFIG = {
  // ID de medición de GA4 (formato G-XXXXXXXXXX). Vacío = Analytics apagado y sin aviso de cookies.
  GA_ID: ''
};

window.BB = (function () {
  'use strict';
  var KEY = 'bb-consent';
  var loaded = false;
  var banner = null;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function read() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { window.localStorage.setItem(KEY, v); } catch (e) {} }
  function clear() { try { window.localStorage.removeItem(KEY); } catch (e) {} }

  function load() {
    if (loaded || !/^G-[A-Z0-9]+$/.test(BB_CONFIG.GA_ID)) return;
    loaded = true;
    gtag('js', new Date());
    gtag('config', BB_CONFIG.GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(BB_CONFIG.GA_ID);
    document.head.appendChild(s);
  }

  function track(name, params) { if (loaded) gtag('event', name, params || {}); }

  function hide() { if (banner) { banner.remove(); banner = null; } }

  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'bb-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Aviso de cookies');

    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Uso Google Analytics para saber cuánta gente visita la página y qué le interesa. No guarda tu nombre ni tu teléfono. '));
    var link = document.createElement('a');
    link.href = 'privacidad.html';
    link.textContent = 'Políticas de privacidad';
    p.appendChild(link);

    var btns = document.createElement('div');
    btns.className = 'bb-consent-btns';
    var no = document.createElement('button');
    no.type = 'button'; no.className = 'no'; no.textContent = 'No, gracias';
    var yes = document.createElement('button');
    yes.type = 'button'; yes.textContent = 'Aceptar';
    no.addEventListener('click', function () { write('denied'); hide(); });
    yes.addEventListener('click', function () { write('granted'); hide(); load(); });
    btns.appendChild(no); btns.appendChild(yes);

    banner.appendChild(p); banner.appendChild(btns);
    document.body.appendChild(banner);
  }

  function init() {
    var reset = document.getElementById('bbConsentReset');
    if (reset) {
      reset.addEventListener('click', function () {
        clear();
        var msg = document.getElementById('bbConsentMsg');
        if (BB_CONFIG.GA_ID) { show(); if (msg) msg.textContent = 'Listo. Elige de nuevo en el aviso de abajo.'; }
        else if (msg) msg.textContent = 'Por ahora esta página no tiene Google Analytics activo, así que no hay cookies de medición.';
      });
    }
    if (!BB_CONFIG.GA_ID) return;
    var c = read();
    if (c === 'granted') load();
    else if (c !== 'denied') show();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { track: track };
})();
