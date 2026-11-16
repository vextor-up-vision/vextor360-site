(function () {
  'use strict';
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };
  var evento = function (nome, params) { if (window.gtag) gtag('event', nome, params || {}); };

  // ---------- topo e menu ----------
  var topo = $('#topo');
  addEventListener('scroll', function () { topo.classList.toggle('rolou', scrollY > 8); }, { passive: true });
  var menuBt = $('.menu-bt'), menu = $('#menu');
  menuBt.addEventListener('click', function () {
    var a = menu.classList.toggle('aberto'); menuBt.setAttribute('aria-expanded', a);
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('aberto'); menuBt.setAttribute('aria-expanded', 'false'); } });
  document.querySelectorAll('[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () { evento('cta_click', { posicao: a.dataset.cta }); });
  });

  // ---------- órbita do lead (hero) ----------
  var ponto = $('#lead-ponto'), estacoes = document.querySelectorAll('.estacao');
  var oNum = $('#o-num'), oEv = $('#o-ev'), oRot = $('#o-rot');
  var cenas = [
    { ev: 'Marina clicou no anúncio do Instagram', rot: 'Leads atendidos hoje' },
    { ev: 'A IA respondeu em 9 segundos e agendou a visita', rot: 'Leads atendidos hoje' },
    { ev: 'Bruno, da loja Tatuapé, recebeu o lead no celular', rot: 'Leads atendidos hoje' },
    { ev: 'Venda fechada: cozinha e quarto', rot: 'Vendido hoje' }
  ];
  var nomes = ['Marina', 'Paulo', 'Juliana', 'Rafael', 'Camila', 'Diego'];
  var lojas = ['Tatuapé', 'Mooca', 'Penha', 'Santo André', 'Moema', 'Guarulhos'];
  var leads = 37, vendido = 184300, volta = 0;
  var fmt = function (v) { return v.toLocaleString('pt-BR'); };
  function pos(t) { // t de 0 a 1 ao redor do círculo, começando no topo
    var a = t * 2 * Math.PI - Math.PI / 2;
    return [50 + 44 * Math.cos(a), 50 + 44 * Math.sin(a)];
  }
  function marcar(i) {
    estacoes.forEach(function (e, k) { e.classList.toggle('ativa', k === i); });
    var c = cenas[i], n = nomes[volta % nomes.length], l = lojas[volta % lojas.length];
    oEv.textContent = c.ev.replace('Marina', n).replace('Tatuapé', l);
    oRot.textContent = c.rot;
    if (i === 3) { vendido += 12000 + Math.round(Math.random() * 30) * 1000; oNum.textContent = 'R$ ' + fmt(vendido); }
    else { if (i === 0) leads++; oNum.textContent = fmt(leads); }
  }
  if (calmo) { marcar(3); var p = pos(.75); ponto.setAttribute('cx', p[0]); ponto.setAttribute('cy', p[1]); }
  else {
    var inicio = null, DUR = 9000, ultima = -1, rodando = true;
    var obs = new IntersectionObserver(function (es) { rodando = es[0].isIntersecting; if (rodando) requestAnimationFrame(passo); }, { threshold: .1 });
    obs.observe($('#orbita'));
    function passo(ts) {
      if (!rodando) { inicio = null; return; }
      if (inicio === null) inicio = ts - (ultima >= 0 ? (ultima / 4) * DUR : 0);
      var t = ((ts - inicio) % DUR) / DUR;
      // pausa curta em cada estação: avança em degraus suaves
      var q = Math.floor(t * 4), f = (t * 4) - q, suave = f < .55 ? 0 : (f - .55) / .45;
      suave = suave * suave * (3 - 2 * suave);
      var p = pos((q + suave) / 4);
      ponto.setAttribute('cx', p[0].toFixed(2)); ponto.setAttribute('cy', p[1].toFixed(2));
      if (q !== ultima) { if (q === 0 && ultima === 3) volta++; ultima = q; marcar(q); }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  // ---------- animações que tocam uma vez ao aparecer ----------
  function aoVer(el, fn) {
    if (!el) return;
    if (calmo || !('IntersectionObserver' in window)) { fn(); return; }
    var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); fn(); } }, { threshold: .35 });
    o.observe(el);
  }
  // conversa da IA
  aoVer($('#chat'), function () {
    var msgs = Array.prototype.slice.call(document.querySelectorAll('#chat .msg')), pontos = $('#chat .pontos');
    if (calmo) { msgs.forEach(function (m) { m.classList.add('v'); }); return; }
    var i = 0;
    (function prox() {
      if (i >= msgs.length) { pontos.classList.remove('v'); return; }
      var m = msgs[i], ia = m.classList.contains('ia');
      pontos.classList.toggle('v', ia);
      setTimeout(function () { pontos.classList.remove('v'); m.classList.add('v'); i++; setTimeout(prox, 500); }, ia ? 1100 : 600);
    })();
  });
  // painel da gestão
  var barras = $('#barras');
  var alturas = [38, 52, 44, 61, 58, 73, 49, 66, 81, 70, 88, 76, 92, 84];
  alturas.forEach(function () { barras.appendChild(document.createElement('i')); });
  aoVer($('#dash'), function () {
    barras.querySelectorAll('i').forEach(function (b, k) { setTimeout(function () { b.style.height = alturas[k] + '%'; }, calmo ? 0 : k * 60); });
    document.querySelectorAll('#funil div').forEach(function (d, k) { setTimeout(function () { d.style.width = d.dataset.w + '%'; }, calmo ? 0 : 300 + k * 180); });
    document.querySelectorAll('#dash [data-alvo]').forEach(function (b) {
      var alvo = +b.dataset.alvo, suf = b.dataset.suf || '';
      if (calmo) { b.textContent = fmt(alvo) + suf; return; }
      var t0 = performance.now();
      (function anim(ts) { var p = Math.min(1, (ts - t0) / 1400); p = 1 - Math.pow(1 - p, 3); b.textContent = fmt(Math.round(alvo * p)) + suf; if (p < 1) requestAnimationFrame(anim); })(t0);
    });
    setTimeout(function () { $('#alerta').classList.add('v'); }, calmo ? 0 : 1800);
  });

  // ---------- calculadora ----------
  var brl = function (v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); };
  function calc() {
    var leads = +$('#c-leads').value, fora = +$('#c-fora').value / 100, conv = +$('#c-conv').value / 100,
        ticket = +$('#c-ticket').value, min = +$('#c-min').value;
    $('#o-leads').textContent = fmt(leads); $('#o-fora').textContent = Math.round(fora * 100) + '%';
    $('#o-conv').textContent = (conv * 100).toLocaleString('pt-BR') + '%'; $('#o-ticket').textContent = brl(ticket); $('#o-min').textContent = min + ' min';
    var vendas = leads * fora * conv, receita = vendas * ticket, horas = leads * min / 60;
    $('#r-receita').textContent = brl(receita);
    $('#r-horas').textContent = fmt(Math.round(horas)) + ' h';
    $('#r-vendas').textContent = vendas.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    $('#r-conta').textContent = 'Conta: ' + fmt(leads) + ' leads × ' + Math.round(fora * 100) + '% fora do horário × ' + (conv * 100).toLocaleString('pt-BR') + '% de conversão × ' + brl(ticket) + ' de ticket. É o valor das vendas que dependem de alguém responder fora do expediente, não uma promessa de resultado. As horas são o tempo de qualificação que a IA assume.';
  }
  var tocou = false;
  $('#calc').addEventListener('input', function () { calc(); if (!tocou) { tocou = true; evento('calculadora_uso'); } });
  calc();

  // ---------- formulário de demonstração ----------
  $('#form-demo').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, msg = $('#msg-form');
    if (!f.checkValidity()) { msg.textContent = 'Preencha nome, empresa, WhatsApp e um e-mail válido.'; f.reportValidity(); return; }
    var d = new FormData(f);
    var corpo = 'Nome: ' + d.get('nome') + '\nEmpresa: ' + d.get('empresa') + '\nWhatsApp: ' + d.get('whatsapp') + '\nLojas: ' + d.get('lojas') + '\nE-mail: ' + d.get('email');
    evento('generate_lead', { lojas: d.get('lojas') });
    var m = window.VEXTOR_MEDICAO || {};
    if (m.ADS && m.ADS_ROTULO_LEAD) evento('conversion', { send_to: m.ADS + '/' + m.ADS_ROTULO_LEAD });
    msg.textContent = 'Abrimos o seu e-mail com o pedido pronto. É só enviar que respondemos no mesmo dia útil.';
    location.href = 'mailto:contato@vextor360.com?subject=' + encodeURIComponent('Demonstração Vextor360 — ' + d.get('empresa')) + '&body=' + encodeURIComponent(corpo);
  });

  // ---------- cookies (LGPD + Consent Mode) ----------
  var ck = $('#cookies'), salvo = null;
  try { salvo = localStorage.getItem('v360_consentimento'); } catch (e) {}
  if (!salvo) ck.classList.add('v');
  function escolher(sim) {
    try { localStorage.setItem('v360_consentimento', sim ? 'sim' : 'nao'); } catch (e) {}
    var v = sim ? 'granted' : 'denied';
    if (window.gtag) gtag('consent', 'update', { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v });
    ck.classList.remove('v');
  }
  $('#ck-sim').addEventListener('click', function () { escolher(true); });
  $('#ck-nao').addEventListener('click', function () { escolher(false); });
  $('#abrir-cookies').addEventListener('click', function (e) { e.preventDefault(); ck.classList.add('v'); });
})();
