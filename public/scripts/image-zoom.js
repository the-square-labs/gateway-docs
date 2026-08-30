const imageSelector = '.sl-markdown-content img';

function createDialog() {
	const dialog = document.createElement('dialog');
	dialog.className = 'gg-image-zoom';
	dialog.setAttribute('aria-label', 'Expanded image');

	const figure = document.createElement('figure');
	figure.className = 'gg-image-zoom__content';

	const image = document.createElement('img');
	image.className = 'gg-image-zoom__image';
	image.alt = '';

	const caption = document.createElement('figcaption');
	caption.className = 'gg-image-zoom__caption';

	const close = document.createElement('button');
	close.className = 'gg-image-zoom__close';
	close.type = 'button';
	close.setAttribute('aria-label', 'Close expanded image');
	close.textContent = '×';
	close.addEventListener('click', () => dialog.close());

	figure.append(image, caption);
	dialog.append(figure, close);
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) dialog.close();
	});
	document.body.append(dialog);

	return { dialog, image, caption };
}

const zoom = createDialog();

function openImage(source) {
	zoom.image.src = source.currentSrc || source.src;
	zoom.image.alt = source.alt || '';
	zoom.caption.textContent = source.alt || '';
	zoom.dialog.showModal();
}

document.addEventListener('click', (event) => {
	const image = event.target.closest?.(imageSelector);
	if (image) openImage(image);
});

document.addEventListener('keydown', (event) => {
	if (event.key !== 'Enter' && event.key !== ' ') return;
	const image = event.target.closest?.(imageSelector);
	if (!image) return;
	event.preventDefault();
	openImage(image);
});

for (const image of document.querySelectorAll(imageSelector)) {
	image.tabIndex = 0;
	image.setAttribute('role', 'button');
	image.setAttribute('aria-label', image.alt ? `Expand image: ${image.alt}` : 'Expand image');
}
