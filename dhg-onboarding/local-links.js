// Local preview only. dhg-onboarding and gravid deploy as separate Netlify
// sites, so links between them are absolute production URLs. On localhost,
// point those links at the local servers instead, so click-throughs show
// undeployed changes: gravid on :8766, dhg-onboarding on :8765
// (`python3 -m http.server <port>` inside each folder). Production is
// untouched. Same file in both folders — keep the copies identical.
(function () {
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  var MAP = [
    ['https://helsenorge-gravid.netlify.app', 'http://localhost:8766'],
    ['https://gravid-onboarding.netlify.app', 'http://localhost:8765'],
  ];
  function local(url) {
    MAP.forEach(function (m) { url = url.split(m[0]).join(m[1]); });
    return url;
  }
  // Links: rewritten at click time, so hrefs that page scripts set
  // (e.g. the ?kilde= breadcrumbs) are covered too.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a) a.href = local(a.href);
  }, true);
  // Buttons that navigate via onclick="location.href='…'".
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[onclick*="netlify.app"]').forEach(function (el) {
      el.setAttribute('onclick', local(el.getAttribute('onclick')));
    });
  });
})();
