import './styles.css';

const entry = document.getElementById('studio-entry');
const entryPlay = document.getElementById('entry-play') as HTMLButtonElement | null;
if (entry && entryPlay) {
  document.documentElement.classList.add('intro-active');
  entryPlay.focus({ preventScroll: true });
  let entered = false;
  const finish = () => {
    entry.hidden = true;
    document.documentElement.classList.remove('intro-active');
    document.body.classList.add('entry-revealed');
    const mainLink = document.querySelector<HTMLAnchorElement>('.nav a[href="#cases"]');
    mainLink?.focus({ preventScroll: true });
  };
  entryPlay.addEventListener('click', () => {
    if (entered) return;
    entered = true;
    entryPlay.disabled = true;
    entry.classList.add('is-opening');
    window.setTimeout(finish, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 270 : 1300);
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

const filters = document.querySelectorAll<HTMLButtonElement>('.filter');
const cases = document.querySelectorAll<HTMLElement>('.case');

filters.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter || 'all';
    filters.forEach(filter =>
      filter.classList.toggle('active', filter === button)
    );
    cases.forEach(item => {
      item.hidden = selected !== 'all' && item.dataset.category !== selected;
    });
  });
});

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
