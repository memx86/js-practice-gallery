import galleryItems from './galleryItems';
const refs = {
  gallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalOverlay: document.querySelector('.lightbox__overlay'),
  modalImg: document.querySelector('.lightbox__image'),
  closeBtn: document.querySelector('[data-action="close-lightbox"]'),
};

const galleryMarkup = createGalleryMarkup(galleryItems);
renderGallery(galleryMarkup);
addModalButtons();
refs.gallery.addEventListener('click', onItemCLick);

function createGalleryMarkup(arr) {
  return arr
    .map(
      ({ preview, original, description }) => `
<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`,
    )
    .join('');
}
function renderGallery(markup) {
  refs.gallery.innerHTML = markup;
}
function onItemCLick(e) {
  e.preventDefault();
  if (e.target === e.currentTarget) return;
  const url = e.target.dataset.source;
  const alt = e.target.alt;
  modalOpen(url, alt);
}
function modalOpen(url, alt) {
  refs.closeBtn.addEventListener('click', closeModal);
  refs.modalOverlay.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeydown);
  refs.modal.classList.add('is-open');
  populateModalImg(url, alt);
}
function closeModal() {
  refs.closeBtn.removeEventListener('click', closeModal);
  refs.modalOverlay.removeEventListener('click', onBackdropClick);
  document.removeEventListener('keydown', onKeydown);
  refs.modal.classList.remove('is-open');
  populateModalImg();
}
function populateModalImg(url = '', alt = '') {
  refs.modalImg.src = url;
  refs.modalImg.alt = alt;
}
function onBackdropClick(e) {
  if (e.target === e.currentTarget) {
    closeModal();
    return;
  }
  if (e.target.classList.contains('lightbox__btn--back')) {
    showPrevNextImg(-1);
    return;
  }
  if (e.target.classList.contains('lightbox__btn--forward')) {
    showPrevNextImg(1);
    return;
  }
}
function onKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  if (e.key === 'ArrowLeft') {
    showPrevNextImg(-1);
    return;
  }
  if (e.key === 'ArrowRight') {
    showPrevNextImg(1);
    return;
  }
}
function showPrevNextImg(num) {
  const { original, description } = findImage(num);
  populateModalImg(original, description);
}
function findImage(num) {
  const currentSrc = refs.modalImg.src;
  const currentImgIndx = galleryItems.findIndex(item => item.original === currentSrc);
  const newImgIndx = currentImgIndx + num > galleryItems.length - 1 ? 0 : currentImgIndx + num;
  const { original, description } = galleryItems.at(newImgIndx);
  return { original, description };
}
function addModalButtons() {
  const backBtnMarkup = '<span class="lightbox__btn lightbox__btn--back"><</span>';
  const forwardBtnMarkup = '<span class="lightbox__btn lightbox__btn--forward">></span>';
  refs.modalOverlay.insertAdjacentHTML('beforeend', backBtnMarkup);
  refs.modalOverlay.insertAdjacentHTML('beforeend', forwardBtnMarkup);
}
