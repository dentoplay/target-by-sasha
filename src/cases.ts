const carousel = document.querySelector<HTMLElement>('.case-carousel');
const stage = carousel?.querySelector<HTMLElement>('.case-stage');
const dots = carousel?.querySelector<HTMLElement>('.case-dots');
const status = carousel?.querySelector<HTMLElement>('[aria-live]');
const grid = document.querySelector<HTMLElement>('.case-grid');
const dialog = document.querySelector<HTMLDialogElement>('.case-dialog');
const filters = [...document.querySelectorAll<HTMLButtonElement>('.filter')];

if (carousel && stage && dots && status && grid && dialog?.showModal) {
  const items = [...grid.querySelectorAll<HTMLElement>('.case')].map(article => {
    const title = (article.querySelector('h3')?.textContent ?? '').replace(/:\s*/u, ': ').trim();
    const category = article.querySelector('.case-tags span')?.textContent ?? title;
    const cover = article.firstElementChild?.querySelector('img');
    const source = cover?.dataset.src || cover?.getAttribute('src');
    const slide = document.createElement('button');
    slide.type = 'button';
    slide.className = 'case-slide';

    const art = document.createElement('div');
    art.className = 'case-slide-art';
    art.setAttribute('aria-hidden', 'true');
    if (source) {
      const image = new Image();
      image.alt = '';
      image.src = source;
      image.draggable = false;
      art.append(image);
    } else if (article.firstElementChild) {
      art.append(article.firstElementChild.cloneNode(true));
    }

    const footer = document.createElement('span');
    footer.className = 'case-slide-footer';
    const label = document.createElement('span');
    label.className = 'case-slide-label';
    label.textContent = category;
    const plus = document.createElement('span');
    plus.className = 'case-slide-plus';
    plus.textContent = '+';
    plus.setAttribute('aria-hidden', 'true');
    footer.append(label, plus);
    slide.append(art, footer);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'case-dot';
    dot.setAttribute('aria-label', title);
    stage.append(slide);
    dots.append(dot);
    return { article, title, slide, dot };
  });

  let visible = items;
  let active = 0;
  let trigger: HTMLButtonElement | null = null;

  const select = (index: number) => {
    const count = visible.length;
    if (!count) return;

    active = (index + count) % count;
    visible.forEach(({ article, title, slide, dot }, position) => {
      let offset = position - active;
      if (Math.abs(offset) > count / 2) offset -= Math.sign(offset) * count;

      const current = offset === 0;
      const nearby = Math.abs(offset) <= 1;
      slide.dataset.position = String(offset);
      slide.inert = !nearby;
      slide.tabIndex = current ? 0 : -1;
      slide.setAttribute('aria-label', `${current ? 'Открыть' : 'Показать'} кейс «${title}»`);
      dot.setAttribute('aria-current', String(current));
      article.hidden = !current;
    });

    status.textContent = `Кейс ${active + 1} из ${count}. ${visible[active].title}`;
  };

  const open = () => {
    const { article, slide, title } = visible[active];
    trigger = slide;
    dialog.setAttribute('aria-label', title);
    const details = article.querySelector<HTMLButtonElement>('.case-more');
    if (details?.getAttribute('aria-expanded') === 'false') details.click();
    dialog.showModal();
    dialog.scrollTop = 0;
  };

  items.forEach(item => {
    item.slide.addEventListener('click', () => {
      const index = visible.indexOf(item);
      if (index === active) open();
      else if (index >= 0) select(index);
    });
    item.dot.addEventListener('click', () => select(visible.indexOf(item)));
  });

  const applyFilter = (selected: string) => {
    visible = items.filter(({ article, slide, dot }) => {
      const match = selected === 'all' || article.dataset.category === selected;
      slide.hidden = !match;
      dot.hidden = !match;
      article.hidden = true;
      return match;
    });
    select(0);
  };

  filters.forEach(filter => {
    filter.setAttribute('aria-pressed', String(filter.classList.contains('active')));
    filter.addEventListener('click', () => {
      filters.forEach(button => {
        button.classList.toggle('active', button === filter);
        button.setAttribute('aria-pressed', String(button === filter));
      });
      applyFilter(filter.dataset.filter ?? 'all');
    });
  });

  carousel.querySelectorAll<HTMLButtonElement>('.case-arrow').forEach(button => {
    button.addEventListener('click', () => select(active + Number(button.dataset.step)));
  });

  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const focusWasOnSlide = stage.contains(document.activeElement);
    const focusWasOnDot = dots.contains(document.activeElement);
    select(active + (event.key === 'ArrowRight' ? 1 : -1));
    if (focusWasOnSlide) visible[active].slide.focus();
    if (focusWasOnDot) visible[active].dot.focus();
  });

  let gesture: { id: number; x: number; y: number } | null = null;
  let suppressClick = false;
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });
  stage.addEventListener('pointerup', event => {
    if (gesture?.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.3) return;

    suppressClick = true;
    select(active + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('click', event => {
    if (!suppressClick || event.detail === 0) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, { capture: true });

  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
  dialog.append(grid);
  applyFilter('all');
  carousel.hidden = false;
}
