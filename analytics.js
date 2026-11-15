/* Brandboy — medición con Google Analytics 4, solo con permiso del visitante. */
var BB_CONFIG = {
  // ID de medición de GA4 (formato G-XXXXXXXXXX). Vacío = Analytics apagado y sin aviso de cookies.
  GA_ID: 'G-BJM1TZXH0L'
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

  var COOKIE_SVG = '<svg viewBox="0 0 80 80" aria-hidden="true" focusable="false"><circle cx="40" cy="40" r="36" fill="#c8864a"/><circle cx="40" cy="40" r="35" fill="none" stroke="#a5602c" stroke-width="2"/><g fill="#4a2414"><circle cx="25" cy="27" r="4.5"/><circle cx="50" cy="22" r="3.5"/><circle cx="58" cy="44" r="5"/><circle cx="34" cy="50" r="4"/><circle cx="21" cy="44" r="3"/><circle cx="45" cy="63" r="3.2"/><circle cx="63" cy="62" r="2.4"/></g></svg>';

  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'bb-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Aviso de cookies');

    var x = document.createElement('button');
    x.type = 'button'; x.className = 'bb-x'; x.setAttribute('aria-label', 'Cerrar y no aceptar'); x.textContent = '×';

    var icon = document.createElement('div');
    icon.className = 'bb-cookie';
    icon.innerHTML = COOKIE_SVG;

    var body = document.createElement('div');
    body.className = 'bb-cbody';

    var title = document.createElement('p');
    title.className = 'bb-title';
    title.textContent = 'Usamos cookies';

    var p = document.createElement('p');
    p.className = 'bb-text';
    p.appendChild(document.createTextNode('Las usamos para mejorar tu experiencia. '));
    var link = document.createElement('a');
    link.href = 'privacidad.html';
    link.textContent = 'Políticas de privacidad';
    p.appendChild(link);

    var btns = document.createElement('div');
    btns.className = 'bb-consent-btns';
    var no = document.createElement('button');
    no.type = 'button'; no.className = 'no'; no.textContent = 'No, gracias';
    var yes = document.createElement('button');
    yes.type = 'button'; yes.textContent = 'Aceptar galleta';
    function decline() { write('denied'); hide(); }
    x.addEventListener('click', decline);
    no.addEventListener('click', decline);
    yes.addEventListener('click', function () { write('granted'); hide(); load(); });
    btns.appendChild(no); btns.appendChild(yes);

    body.appendChild(title); body.appendChild(p);
    banner.appendChild(x); banner.appendChild(icon); banner.appendChild(body); banner.appendChild(btns);
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
