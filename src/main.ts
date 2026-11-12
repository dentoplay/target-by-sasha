import './styles.css';
import './cases';

const entry = document.getElementById('studio-entry');
const entryPlay = document.getElementById('entry-play') as HTMLButtonElement | null;
const portfolio = document.getElementById('app');
if (entry && entryPlay && portfolio) {
  document.documentElement.classList.add('intro-active');
  portfolio.inert = true;
  entryPlay.focus({ preventScroll: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tracking = new AbortController();
  const pointerOptions = { passive: true, signal: tracking.signal };
  let entered = false;

  entry.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduceMotion.matches) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const distance = Math.hypot(event.clientX - width / 2, event.clientY - height / 2);
    const buttonRadius = 40;
    const radius = Math.max(buttonRadius + 1, Math.min(440, Math.min(width, height) * .58));
    const proximity = 1 - Math.min(1, Math.max(0, (distance - buttonRadius) / (radius - buttonRadius)));
    entry.style.setProperty('--proximity', proximity.toFixed(3));
  }, pointerOptions);

  entry.addEventListener('pointerleave', () => {
    entry.style.removeProperty('--proximity');
  }, pointerOptions);

  const finish = () => {
    entry.hidden = true;
    portfolio.inert = false;
    document.documentElement.classList.remove('intro-active');
    const mainLink = document.querySelector<HTMLAnchorElement>('.nav a[href="#cases"]');
    mainLink?.focus({ preventScroll: true });
  };
  entryPlay.addEventListener('click', () => {
    if (entered) return;
    entered = true;
    entryPlay.disabled = true;
    tracking.abort();
    entry.classList.add('is-opening');
    const [exitAnimation] = entry.getAnimations();
    if (exitAnimation) {
      void exitAnimation.finished.then(finish, finish);
    } else {
      finish();
    }
  });
}


const beautyCover = document.querySelector<HTMLImageElement>('.beauty-uploaded-cover');
if (beautyCover) {
  beautyCover.addEventListener('load', () => {
    beautyCover.style.display = 'block';
    const fallback = document.querySelector<HTMLElement>('.beauty-fallback');
    if (fallback) fallback.style.display = 'none';
  });
  beautyCover.src = beautyCover.dataset.src || '';
}
const beautyDetail = document.querySelector<HTMLImageElement>('.beauty-detail-image');
if (beautyDetail) {
  beautyDetail.addEventListener('load', () => { beautyDetail.style.display = 'block'; });
  beautyDetail.src = beautyDetail.dataset.src || '';
}

document.querySelectorAll<HTMLButtonElement>('.case-more').forEach(button => {
  button.addEventListener('click', () => {
    const details = button.nextElementSibling as HTMLElement | null;
    if (!details) return;
    details.hidden = !details.hidden;
    button.setAttribute('aria-expanded', String(!details.hidden));
    button.innerHTML = details.hidden
      ? 'Подробнее о кейсе <span>↗</span>'
      : 'Свернуть кейс <span>↑</span>';
  });
});
