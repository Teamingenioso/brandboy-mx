/* Brandboy — animaciones y formulario */
(function () {
  'use strict';
    var cursor = document.getElementById('cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        cursor.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      }, { passive: true });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var spawn = document.getElementById('spawn');
    var name = document.getElementById('name');
    if (!spawn || !name) return;

    var symbols = ['$', '↗', '+', '✦', '↑', '$', '↗'];
    var colors = ['#e6ff8f', '#b7e046', '#f0f4e4'];

    function rand(min, max) { return min + Math.random() * (max - min); }

    function emit(xPct) {
      if (spawn.children.length > 18) return;
      var el = document.createElement('span');
      var dur = rand(1.6, 2.8);
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.setProperty('--x', (xPct != null ? xPct : rand(6, 94)) + '%');
      el.style.setProperty('--y', rand(4, 40) + '%');
      el.style.setProperty('--s', rand(1.1, 2.1).toFixed(2) + 'rem');
      el.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
      el.style.setProperty('--dx', rand(-60, 60).toFixed(0) + 'px');
      el.style.setProperty('--dy', (-rand(70, 190)).toFixed(0) + 'px');
      el.style.setProperty('--rot', rand(-40, 40).toFixed(0) + 'deg');
      el.style.setProperty('--dur', dur.toFixed(2) + 's');
      el.addEventListener('animationend', function () { el.remove(); });
      spawn.appendChild(el);
    }

    // empiezan cuando el nombre ya terminó de armarse
    setTimeout(function () {
      setInterval(function () { if (!document.hidden) emit(); }, 420);
    }, 1900);

    // al tocar el nombre, salen de golpe
    name.addEventListener('pointerdown', function (e) {
      var r = name.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      for (var i = 0; i < 9; i++) emit(Math.min(94, Math.max(6, x + rand(-14, 14))));
    });
  })();

(function () {
  'use strict';
    var WA_NUMBER = '5219932872959';
    // Medición: solo respuestas de opción múltiple. Nunca nombre, correo ni teléfono.
    function track(name, params) { if (window.BB) window.BB.track(name, params); }
    document.addEventListener('click', function (e) {
      var l = e.target.closest && e.target.closest('a[href^="http"]');
      if (l) track('click_enlace', { destino: l.hostname });
    });

    var SERV = {
      ventas:    { label: 'Vender más', yes: 'Sí, quiero empezar a vender más ya', ranges: ['$20,000 – $25,000', '$25,000 – $32,000', '$32,000 – $40,000', '$40,000 – $50,000'] },
      branding:  { label: 'Diseñar la identidad de mi marca', yes: 'Sí, mi marca ya necesita verse a la altura', ranges: ['$25,000 – $40,000', '$40,000 – $60,000', '$60,000 – $80,000', '$80,000 – $100,000'] },
      anuncios:  { label: 'Hacer anuncios que vendan', yes: 'Sí, quiero anuncios que sí vendan', ranges: ['$15,000 – $25,000', '$25,000 – $40,000', '$40,000 – $55,000', '$55,000 – $70,000'] },
      registro:  { label: 'Registrar mi marca', yes: 'Sí, quiero proteger mi marca', ranges: ['$20,000 – $25,000', '$25,000 – $32,000', '$32,000 – $40,000', '$40,000 – $50,000'] },
      contenido: { label: 'Grabar o editar contenido', yes: 'Sí, quiero contenido que venda', ranges: ['$15,000 – $19,000', '$19,000 – $23,000', '$23,000 – $27,000', '$27,000 – $30,000'] }
    };
    var SERV_ORDER = ['branding', 'ventas', 'anuncios', 'registro', 'contenido'];

    // tier = opción de inversión que se resalta (0 a 3) según la industria
    var INDUSTRIES = [
      { id: 'restaurante', label: 'Restaurante o comida', tier: 1 },
      { id: 'servicios', label: 'Servicios profesionales', tier: 1 },
      { id: 'salud', label: 'Salud y bienestar', tier: 2 },
      { id: 'belleza', label: 'Belleza y estética', tier: 1 },
      { id: 'retail', label: 'Tienda o comercio', tier: 1 },
      { id: 'inmobiliaria', label: 'Inmobiliaria', tier: 3 },
      { id: 'construccion', label: 'Construcción e industria', tier: 3 },
      { id: 'petroleo', label: 'Petróleo y energía', tier: 3 },
      { id: 'automotriz', label: 'Automotriz', tier: 3 },
      { id: 'educacion', label: 'Educación', tier: 1 },
      { id: 'moda', label: 'Moda y accesorios', tier: 1 },
      { id: 'tecnologia', label: 'Tecnología', tier: 2 },
      { id: 'turismo', label: 'Turismo y hoteles', tier: 2 },
      { id: 'fitness', label: 'Gimnasio o deporte', tier: 1 },
      { id: 'otro', label: 'Otro', tier: 1 }
    ];

    var MONEDAS = {
      MXN: { label: 'Pesos mexicanos (MXN)', sym: '$', rate: 1 },
      USD: { label: 'Dólares estadounidenses (USD)', sym: 'US$', rate: 1 / 18 },
      EUR: { label: 'Euros (EUR)', sym: '€', rate: 1 / 20 },
      GTQ: { label: 'Quetzales guatemaltecos (GTQ)', sym: 'Q', rate: 0.43 },
      COP: { label: 'Pesos colombianos (COP)', sym: 'COL$', rate: 222 },
      CAD: { label: 'Dólares canadienses (CAD)', sym: 'CA$', rate: 0.076 },
      GBP: { label: 'Libras esterlinas (GBP)', sym: '£', rate: 0.042 },
      ARS: { label: 'Pesos argentinos (ARS)', sym: 'ARS$', rate: 55.6 },
      CLP: { label: 'Pesos chilenos (CLP)', sym: 'CLP$', rate: 52.8 },
      PEN: { label: 'Soles peruanos (PEN)', sym: 'S/', rate: 0.206 },
      BRL: { label: 'Reales brasileños (BRL)', sym: 'R$', rate: 0.294 },
      DOP: { label: 'Pesos dominicanos (DOP)', sym: 'RD$', rate: 3.33 }
    };
    // rate = unidades de la moneda por 1 MXN. Valores PROVISIONALES: confirmar tipo de cambio vigente antes de publicar.
    function rangoTexto(r, m) {
      var n = r.match(/[\d,]+/g).map(function (x) { return Math.round(parseInt(x.replace(/,/g, ''), 10) * m.rate).toLocaleString('en-US'); });
      return m.sym + n[0] + ' – ' + m.sym + n[1];
    }

    var a = {}; // respuestas
    var idx = 0;

    var dlg = document.getElementById('bbDialog');
    var body = document.getElementById('bbBody');
    var bar = document.getElementById('bbBar');
    var prog = document.getElementById('bbProgress');
    var back = document.getElementById('bbBack');
    var stepLabel = document.getElementById('bbStepLabel');
    var toast = document.getElementById('bbToast');
    var toastTimer;

    var ARROW = '<svg class="bb-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var INFO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';

    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

    function industry() { for (var i = 0; i < INDUSTRIES.length; i++) if (INDUSTRIES[i].id === a.industria) return INDUSTRIES[i]; return null; }
    function industryLabel() { var ind = industry(); if (!ind) return ''; return ind.id === 'otro' ? (a.otro || 'Otro') : ind.label; }

    function steps() {
      var s = ['servicio', 'industria'];
      if (a.servicio === 'anuncios') s.push('material');
      if (a.servicio === 'registro') s.push('identidad');
      if (a.servicio === 'contenido') s.push('zona');
      s.push('anos', 'decision');
      if (a.decision === 'viendo') { s.push('fin_viendo'); return s; }
      s.push('inversion', 'contacto', 'fin');
      return s;
    }

    function setProgress() {
      var s = steps();
      var last = s.length - 1;
      var pct = Math.round((idx / last) * 100);
      bar.style.width = pct + '%';
      prog.setAttribute('aria-valuenow', pct);
      var isEnd = s[idx].indexOf('fin') === 0;
      stepLabel.textContent = isEnd ? 'Listo' : 'Paso ' + (idx + 1) + ' de ' + last;
      back.hidden = idx === 0 || isEnd;
    }

    function optButtons(list, key) {
      return '<div class="bb-opts">' + list.map(function (o) {
        var sel = a[key] === o.value;
        return '<button type="button" class="bb-opt' + (o.hot ? ' is-hot' : '') + '" data-key="' + key + '" data-value="' + esc(o.value) + '" aria-pressed="' + sel + '">' +
          (o.hot
            ? '<span class="bb-main"><span class="bb-badge">Lo más común en tu industria</span><span class="bb-price">' + esc(o.label) + '</span></span>'
            : '<span' + (o.price ? ' class="bb-price"' : '') + '>' + esc(o.label) + '</span>') +
          ARROW + '</button>';
      }).join('') + '</div>';
    }

    function note(text) { return '<div class="bb-note">' + INFO + '<span>' + text + '</span></div>'; }

    function render() {
      var id = steps()[idx];
      var h = '';
      if (id === 'servicio') {
        h = '<h2 id="bbTitle">¿Qué buscas?</h2><p class="bb-sub">Elige lo que más necesita tu marca hoy.</p>' +
          optButtons(SERV_ORDER.map(function (k) { return { value: k, label: SERV[k].label }; }), 'servicio');
      } else if (id === 'industria') {
        var first = a.servicio === 'branding' ? 'restaurante' : null;
        var list = INDUSTRIES.slice();
        if (a.servicio === 'ventas') {
          // Industrias de mayor valor de venta primero; "Otro" siempre al final
          var RANK = ['petroleo', 'inmobiliaria', 'automotriz', 'construccion', 'servicios', 'salud', 'turismo', 'tecnologia', 'educacion', 'belleza', 'restaurante', 'retail', 'moda', 'fitness', 'otro'];
          list.sort(function (x, y) { return RANK.indexOf(x.id) - RANK.indexOf(y.id); });
        } else if (first) {
          list.sort(function (x, y) { return (y.id === first) - (x.id === first); });
        }
        h = '<h2 id="bbTitle">¿En qué industria está tu marca?</h2><p class="bb-sub">Así sabemos qué le funciona a negocios como el tuyo.</p>' +
          '<div class="bb-field"><label for="bbInd">Industria</label><select class="bb-select" id="bbInd"><option value="" disabled' + (a.industria ? '' : ' selected') + '>Elige una opción</option>' +
          list.map(function (o) { return '<option value="' + o.id + '"' + (a.industria === o.id ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="bb-field" id="bbOtroWrap"' + (a.industria === 'otro' ? '' : ' hidden') + '><label for="bbOtro">Escribe tu industria</label><input class="bb-input" id="bbOtro" maxlength="50" autocomplete="off" placeholder="Ej. Florería, despacho contable…" value="' + esc(a.otro || '') + '"><span class="bb-count" id="bbOtroCount">' + (a.otro || '').length + '/50</span></div>' +
          '<button type="button" class="bb-next" id="bbIndNext">Continuar ' + ARROW + '</button>';
      } else if (id === 'material') {
        h = '<h2 id="bbTitle">¿Ya tienes flyers o videos para tus anuncios?</h2><p class="bb-sub">Si no, también los hacemos.</p>' +
          optButtons([{ value: 'Sí, flyers y videos', label: 'Sí, flyers y videos' }, { value: 'Solo flyers', label: 'Solo flyers' }, { value: 'Solo videos', label: 'Solo videos' }, { value: 'No, hay que hacerlos', label: 'No, hay que hacerlos' }], 'material');
      } else if (id === 'identidad') {
        h = '<h2 id="bbTitle">¿Ya tienes identidad o manual de marca?</h2><p class="bb-sub">Para registrarla necesitamos saber de dónde partimos.</p>' +
          optButtons([{ value: 'Sí, logo y manual de marca', label: 'Sí, logo y manual de marca' }, { value: 'Solo tengo logo', label: 'Solo tengo logo' }, { value: 'No tengo nada todavía', label: 'No tengo nada todavía' }], 'identidad');
      } else if (id === 'zona') {
        h = '<h2 id="bbTitle">¿Dónde está tu negocio?</h2><p class="bb-sub">Para saber si vamos a grabar contigo.</p>' +
          optButtons([{ value: 'Sur de México', label: 'Sur de México (Tabasco, Chiapas, Veracruz, Campeche, Yucatán, Q. Roo, Oaxaca)' }, { value: 'Otra parte de México', label: 'Otra parte de México' }], 'zona') +
          note('Grabamos solo en el sur de México y los viáticos ya van incluidos. Si estás en otra zona, te ayudamos con la edición.');
      } else if (id === 'anos') {
        h = '<h2 id="bbTitle">¿Cuántos años tiene tu negocio?</h2>' +
          optButtons([{ value: 'Menos de 1 año', label: 'Menos de 1 año' }, { value: '1 a 3 años', label: '1 a 3 años' }, { value: 'Más de 3 años', label: 'Más de 3 años' }], 'anos');
      } else if (id === 'decision') {
        h = '<h2 id="bbTitle">¿Ya tienes claro si quieres avanzar?</h2><p class="bb-sub">Sin presión, solo queremos saber en qué punto vas.</p>' +
          optButtons([{ value: 'si', label: SERV[a.servicio].yes }, { value: 'despues', label: 'Sí, pero no para este mes' }, { value: 'viendo', label: 'Solo estoy viendo' }], 'decision');
      } else if (id === 'inversion') {
        var ind = industry(); var tier = ind ? ind.tier : 1;
        var mon = MONEDAS[a.moneda || 'MXN'];
        h = '<h2 id="bbTitle">¿Cuánto estás dispuesto a invertir en este proyecto?</h2><p class="bb-sub">Elige la moneda en la que quieres ver los precios.</p>' +
          '<div class="bb-field"><label for="bbMoneda">Moneda</label><select class="bb-select" id="bbMoneda">' +
          Object.keys(MONEDAS).map(function (k) { return '<option value="' + k + '"' + (k === (a.moneda || 'MXN') ? ' selected' : '') + '>' + esc(MONEDAS[k].label) + '</option>'; }).join('') +
          '</select></div>' +
          optButtons(SERV[a.servicio].ranges.map(function (r, i) { return { value: rangoTexto(r, mon) + ' ' + (a.moneda || 'MXN'), label: rangoTexto(r, mon), price: true, hot: i === tier }; }), 'inversion') +
          (a.servicio === 'contenido' ? note('Si buscas videos horizontales o podcast, los costos pueden ser más altos según tu industria.') : '');
      } else if (id === 'contacto') {
        h = '<h2 id="bbTitle">¿A quién contactamos?</h2><p class="bb-sub">Con esto te escribimos para agendar la llamada.</p>' +
          '<form id="bbContact" novalidate>' +
          '<div class="bb-field"><label for="bbNombre">Tu nombre</label><input class="bb-input" id="bbNombre" autocomplete="name" maxlength="60" required value="' + esc(a.nombre || '') + '"></div>' +
          '<div class="bb-field"><label for="bbNegocio">Nombre de tu negocio</label><input class="bb-input" id="bbNegocio" autocomplete="organization" maxlength="60" required value="' + esc(a.negocio || '') + '"></div>' +
          '<div class="bb-field"><label for="bbCorreo">Correo</label><input class="bb-input" id="bbCorreo" type="email" autocomplete="email" inputmode="email" maxlength="80" required value="' + esc(a.correo || '') + '"></div>' +
          '<div class="bb-field"><label for="bbTel">WhatsApp (10 dígitos)</label><input class="bb-input" id="bbTel" type="tel" autocomplete="tel-national" inputmode="numeric" maxlength="14" required placeholder="993 000 0000" value="' + esc(a.tel || '') + '"></div>' +
          '<button type="submit" class="bb-next" id="bbSend" disabled>Enviar por WhatsApp ' + ARROW + '</button>' +
          '<p class="bb-legal">Al enviar aceptas la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a>. Tus datos solo se usan para contactarte.</p>' +
          '</form>';
      } else if (id === 'fin') {
        h = '<div class="bb-done"><div class="bb-check" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
          '<h2 id="bbTitle">Listo, ' + esc((a.nombre || '').split(' ')[0]) + '</h2><p class="bb-sub">Se abrió WhatsApp con tu información. Mándalo y te escribimos para agendar tu llamada.</p>' +
          '<button type="button" class="bb-next ghosty" id="bbResend">Abrir WhatsApp otra vez</button></div>';
      } else if (id === 'fin_viendo') {
        h = '<div class="bb-done"><h2 id="bbTitle">Va, sin presión</h2><p class="bb-sub">Mientras lo piensas, sígueme. Ahí suelto lo que sí le funciona a los negocios para vender más.</p>' +
          '<a class="bb-next" href="https://www.instagram.com/brandboy.mx/" target="_blank" rel="noopener noreferrer">Seguir a @brandboy.mx ' + ARROW + '</a></div>';
      }
      body.innerHTML = '<div class="bb-q">' + h + '</div>';
      body.scrollTop = 0;
      setProgress();
      wire(id);
    }

    function go(n) { idx = Math.max(0, Math.min(steps().length - 1, n)); render(); }
    function next() { go(idx + 1); }

    function wire(id) {
      body.querySelectorAll('.bb-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          var key = b.getAttribute('data-key');
          var val = b.getAttribute('data-value');
          if (key === 'servicio' && a.servicio !== val) { delete a.material; delete a.identidad; delete a.zona; delete a.inversion; }
          a[key] = val;
          track('form_respuesta', { pregunta: key, respuesta: val });
          body.querySelectorAll('.bb-opt').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
          if (key === 'decision' && val !== 'viendo') showToast();
          setTimeout(next, 220);
        });
      });

      if (id === 'inversion') {
        var monSel = document.getElementById('bbMoneda');
        monSel.addEventListener('change', function () {
          a.moneda = monSel.value;
          delete a.inversion;
          render();
        });
      }

      if (id === 'industria') {
        var sel = document.getElementById('bbInd');
        var wrap = document.getElementById('bbOtroWrap');
        var otro = document.getElementById('bbOtro');
        var count = document.getElementById('bbOtroCount');
        var btn = document.getElementById('bbIndNext');
        var check = function () {
          a.industria = sel.value || undefined;
          wrap.hidden = sel.value !== 'otro';
          a.otro = otro.value.trim();
          count.textContent = otro.value.length + '/50';
          btn.disabled = !sel.value || (sel.value === 'otro' && !a.otro);
        };
        sel.addEventListener('change', function () { check(); if (sel.value === 'otro') otro.focus(); });
        otro.addEventListener('input', check);
        check();
        btn.addEventListener('click', function () { if (!btn.disabled) { track('form_respuesta', { pregunta: 'industria', respuesta: a.industria }); next(); } });
      }

      if (id === 'contacto') {
        var f = document.getElementById('bbContact');
        var send = document.getElementById('bbSend');
        var n = document.getElementById('bbNombre'), g = document.getElementById('bbNegocio'), c = document.getElementById('bbCorreo'), t = document.getElementById('bbTel');
        var valid = function () {
          a.nombre = n.value.trim(); a.negocio = g.value.trim(); a.correo = c.value.trim(); a.tel = t.value.trim();
          var digits = a.tel.replace(/\D/g, '');
          send.disabled = !(a.nombre && a.negocio && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.correo) && digits.length >= 10);
        };
        [n, g, c, t].forEach(function (el) { el.addEventListener('input', valid); });
        valid();
        f.addEventListener('submit', function (e) { e.preventDefault(); if (send.disabled) return; track('generate_lead', { servicio: a.servicio, industria: a.industria }); openWhatsApp(); next(); });
      }

      if (id === 'fin') {
        document.getElementById('bbResend').addEventListener('click', openWhatsApp);
      }
    }

    function message() {
      var lines = [
        'Hola Brandboy, vengo de la página de Brandboy y quiero platicar de mi proyecto.',
        '',
        '*Nombre:* ' + a.nombre,
        '*Negocio:* ' + a.negocio,
        '*Correo:* ' + a.correo,
        '*WhatsApp:* ' + a.tel,
        '',
        '*Busco:* ' + SERV[a.servicio].label,
        '*Industria:* ' + industryLabel()
      ];
      if (a.material) lines.push('*Material para anuncios:* ' + a.material);
      if (a.identidad) lines.push('*Identidad de marca:* ' + a.identidad);
      if (a.zona) lines.push('*Ubicación:* ' + a.zona);
      lines.push('*Años del negocio:* ' + a.anos);
      lines.push('*Decisión:* ' + (a.decision === 'si' ? 'Quiero empezar este mes' : 'Sí, pero no para este mes'));
      lines.push('*Inversión:* ' + a.inversion);
      lines.push('', 'Entiendo que agendaremos una llamada de 15 a 25 minutos.');
      return lines.join('\n');
    }

    function openWhatsApp() {
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message()), '_blank', 'noopener,noreferrer');
    }

    function showToast() {
      clearTimeout(toastTimer);
      toast.classList.add('show');
      toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 6000);
    }

    function open() { if (!dlg.open) { a = {}; idx = 0; render(); dlg.showModal(); track('form_abierto'); } }

    document.querySelectorAll('[data-open-form]').forEach(function (b) { b.addEventListener('click', open); });
    document.getElementById('bbClose').addEventListener('click', function () { dlg.close(); });
    back.addEventListener('click', function () { go(idx - 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    toast.addEventListener('click', function () { toast.classList.remove('show'); });
  })();
