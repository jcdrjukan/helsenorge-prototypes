// Ordforklaring popover, copied from the Prøvesvar prototype (data.js) so
// both behave the same: any .dictionarytrigger with data-ord opens a
// PopOver + HelpBubble with ORDFORKLARINGER[data-ord]. Esc, ✕ or a click
// outside closes it and returns focus to the word. Added 2026-10-26.
// The explanations are drafts until approved by content/clinical staff.
const ORDFORKLARINGER = {
  'Hemoglobin (Hb)': 'Proteinet i de røde blodcellene som frakter oksygen rundt i kroppen. I svangerskapet måles Hb for å se om du har blodmangel (anemi).',
  'Hepatitt B': 'En virussykdom som kan gi betennelse i leveren. Alle gravide testes, fordi viruset kan smitte til barnet ved fødselen. Barnet kan da beskyttes med vaksine rett etter fødselen.',
};

(function () {
  let pop = null, aktiv = null;
  const ARROW = '<svg class="popover__arrow" viewBox="0 0 14 14" aria-hidden="true"><path fill="none" stroke="#7D7C79" stroke-width="3" d="M0,0 H14 L7,7 Q7,7 7,7 Z" clip-path="inset(1px -1px -1px -1px)"/><path fill="#fff" stroke="#fff" d="M0,0 H14 L7,7 Q7,7 7,7 Z"/></svg>';
  const CLOSE = '<path d="M25.773 24l10.432-10.432-1.772-1.773-10.432 10.433-10.433-10.433-1.773 1.772L22.229 24 11.795 34.433l1.773 1.772 10.433-10.433 10.432 10.433 1.772-1.773z"/>';
  function lukk(fokus) {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    if (aktiv) { aktiv.setAttribute('aria-expanded', 'false'); if (fokus) aktiv.focus(); }
    aktiv = null;
  }
  function apne(t) {
    const tekst = ORDFORKLARINGER[t.dataset.ord];
    if (!tekst) return;
    const screen = document.querySelector('.phone-frame__screen') || document.body;
    if (!pop) {
      pop = document.createElement('div');
      pop.className = 'popover';
      pop.tabIndex = -1;
      pop.setAttribute('role', 'group');
      pop.setAttribute('aria-label', 'Hjelpetekst');
      pop.hidden = true;
      screen.appendChild(pop);
      pop.addEventListener('click', e => { if (e.target.closest('.helpbubble__close')) lukk(true); });
    }
    if (aktiv && aktiv !== t) aktiv.setAttribute('aria-expanded', 'false');
    aktiv = t;
    t.setAttribute('aria-expanded', 'true');
    pop.innerHTML = `<div class="helpbubble"><div class="helpbubble__content"><p></p></div><button type="button" class="helpbubble__close" aria-label="Lukk"><span><svg viewBox="0 0 48 48" aria-hidden="true">${CLOSE}</svg></span></button></div>${ARROW}`;
    pop.querySelector('p').textContent = tekst;
    pop.hidden = false;
    // Under the word inside the (scrolling) phone screen, or above it if
    // it would run past the bottom of the visible area.
    const s = screen.getBoundingClientRect(), r = t.getBoundingClientRect();
    const scrollTop = screen.scrollTop || 0;
    const w = pop.offsetWidth, h = pop.offsetHeight;
    const midt = r.left + r.width / 2 - s.left;
    const left = Math.max(8, Math.min(midt - w / 2, s.width - w - 8));
    const nedenfor = r.bottom + 10 + h <= s.bottom || r.top - 10 - h < s.top;
    pop.classList.toggle('popover--below', nedenfor);
    pop.classList.toggle('popover--above', !nedenfor);
    pop.style.left = left + 'px';
    pop.style.top = (nedenfor ? r.bottom - s.top + scrollTop + 10 : r.top - s.top + scrollTop - 10 - h) + 'px';
    pop.querySelector('.popover__arrow').style.left = Math.max(12, Math.min(midt - left - 8, w - 28)) + 'px';
    pop.focus();
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('.dictionarytrigger[data-ord]');
    if (t) { e.preventDefault(); (aktiv === t && pop && !pop.hidden) ? lukk(true) : apne(t); return; }
    if (pop && !pop.hidden && !e.target.closest('.popover')) lukk(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop && !pop.hidden) lukk(true); });
})();
