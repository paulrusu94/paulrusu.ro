/*
 * Google Analytics 4 with a consent banner (GDPR).
 * gtag.js loads only after the visitor clicks Accept. Until then nothing is
 * sent to Google; events are only queued in window.dataLayer.
 *
 * Custom events: add data-track="event_name" to any clickable element, and
 * optionally data-track-label="..." for an extra parameter.
 */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; // replace with your GA4 Measurement ID
  var KEY = 'pr_analytics_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  var loaded = false;
  function loadGA() {
    if (loaded || !/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
    loaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function clearGACookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=.' + host, '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  // Custom events
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    var params = { page_path: location.pathname };
    var label = el.getAttribute('data-track-label');
    if (label) params.label = label;
    if (el.href) params.link_url = el.href;
    gtag('event', el.getAttribute('data-track'), params);
  });

  // Banner
  var css = '' +
    '.cc{position:fixed;z-index:50;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));' +
    'max-width:420px;padding:18px 20px;border-radius:18px;background:var(--cc-bg,#ffffff);color:var(--cc-fg,#18202b);' +
    'box-shadow:0 2px 4px rgba(0,0,0,.08),0 24px 60px -18px rgba(0,0,0,.35);font:15px/1.5 "Figtree","Segoe UI",system-ui,sans-serif;' +
    'animation:cc-in .4s cubic-bezier(.2,.7,.2,1) both}' +
    '.cc p{margin:0 0 14px}' +
    '.cc .cc-row{display:flex;gap:10px;flex-wrap:wrap}' +
    '.cc button{font:600 14px/1 "Figtree","Segoe UI",system-ui,sans-serif;padding:11px 18px;border-radius:999px;border:0;cursor:pointer}' +
    '.cc .cc-yes{background:var(--cc-accent,#a5560a);color:var(--cc-on-accent,#ffffff)}' +
    '.cc .cc-no{background:var(--cc-muted-bg,#e4e8e0);color:var(--cc-fg,#18202b)}' +
    '.cc button:focus-visible{outline:2px solid var(--cc-accent,#a5560a);outline-offset:2px}' +
    '@keyframes cc-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.cc{animation:none}}' +
    '@media print{.cc{display:none}}';

  function showBanner() {
    if (document.querySelector('.cc')) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    var box = document.createElement('div');
    box.className = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie consent');
    box.innerHTML = '<p>This site uses Google Analytics cookies to understand how visitors use it. Nothing is tracked unless you accept.</p>' +
      '<div class="cc-row"><button type="button" class="cc-yes" id="cc-accept">Accept</button>' +
      '<button type="button" class="cc-no" id="cc-decline">Decline</button></div>';
    document.body.appendChild(box);
    box.querySelector('#cc-accept').addEventListener('click', function () {
      setConsent('granted'); box.remove(); loadGA();
    });
    box.querySelector('#cc-decline').addEventListener('click', function () {
      setConsent('denied'); box.remove();
      gtag('consent', 'update', { analytics_storage: 'denied' });
      clearGACookies();
    });
  }

  function init() {
    if (GA_ID === 'G-XXXXXXXXXX') return; // not configured yet: no banner, no tracking
    var c = getConsent();
    if (c === 'granted') loadGA();
    else if (c !== 'denied') showBanner();
    document.querySelectorAll('[data-consent-open]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
