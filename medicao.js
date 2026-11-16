// Medição pelo Google Tag Manager (GTM-KT5S8QT5) com Consent Mode v2.
// GA4 (G-EP00KRSPJD) vai direto pelo gtag abaixo: NÃO crie outra tag do GA4 no GTM (contaria em dobro).
// Google Ads (AW-18219153497) via gtag aqui; a conversão de lead dispara no site.js. Outras tags: no GTM.
// Eventos enviados ao dataLayer pelo site: cta_click, calculadora_uso, generate_lead.
window.VEXTOR_MEDICAO = { GTM: 'GTM-KT5S8QT5', GA4: 'G-EP00KRSPJD', ADS: 'AW-18219153497', ADS_LEAD: 'otyfCInEwLkdENnwyO9D' };

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
// LGPD: tudo começa negado; só muda quando a pessoa aceita no aviso de cookies.
gtag('consent', 'default', {
  ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
(function () {
  var c = null;
  try { c = localStorage.getItem('v360_consentimento'); } catch (e) {}
  if (c === 'sim') gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
  var m = window.VEXTOR_MEDICAO;
  if (m.GA4) {
    var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + m.GA4;
    document.head.appendChild(g);
    gtag('js', new Date());
    gtag('config', m.GA4);
    if (m.ADS) gtag('config', m.ADS);
  }
  var id = m.GTM;
  if (!id) return;
  dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + id;
  document.head.appendChild(s);
})();
