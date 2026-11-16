// Medição (Google Analytics 4 + Google Ads) com Consent Mode v2.
// Preencha os IDs abaixo. Enquanto estiverem vazios, nada do Google é carregado.
window.VEXTOR_MEDICAO = {
  GA4: '',              // ex.: 'G-XXXXXXXXXX'  (Analytics → Administrador → Fluxos de dados)
  ADS: '',              // ex.: 'AW-1234567890' (Google Ads → Metas → Conversões)
  ADS_ROTULO_LEAD: ''   // ex.: 'AbCdEfGhIjK'   (rótulo da conversão "Pedido de demonstração")
};

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
// LGPD: tudo começa negado; só muda quando a pessoa aceita no aviso de cookies.
gtag('consent', 'default', {
  ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  wait_for_update: 500
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
(function () {
  var c = null;
  try { c = localStorage.getItem('v360_consentimento'); } catch (e) {}
  if (c === 'sim') gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
  var m = window.VEXTOR_MEDICAO, id = m.GA4 || m.ADS;
  if (!id) return;
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  gtag('js', new Date());
  if (m.GA4) gtag('config', m.GA4);
  if (m.ADS) gtag('config', m.ADS);
})();
