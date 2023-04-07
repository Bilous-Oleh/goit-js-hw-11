import './sass/index.scss';
import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createGalleryCards from './gallery-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryListEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('.search-input');

const pixabyAPI = new PixabayAPI();

const lightBox = new SimpleLightbox('.gallery a', {
  caption: true,
  captionDelay: 250,
  captionsData: 'alt',
});

const handleSearchFormSubmit = async event => {
  event.preventDefault();

  pixabyAPI.page = 1;
  pixabyAPI.query = event.currentTarget.elements.searchQuery.value.trim();
  searchInputEl.value = '';
  galleryListEl.innerHTML = '';

  if (!pixabyAPI.query) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  try {
    const { data } = await pixabyAPI.fetchPhotos();

    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryListEl.innerHTML = createGalleryCards(data.hits);

    lightBox.refresh();

    if (data.totalHits < pixabyAPI.per_page) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  }
};

const handleLoadMoreBtnClick = async () => {
  pixabyAPI.page += 1;

  try {
    const { data } = await pixabyAPI.fetchPhotos();

    if (pixabyAPI.page === data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
    }

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );

    lightBox.refresh();
    smoothScroll();

    if (pixabyAPI.page > data.totalHits / pixabyAPI.per_page) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

function smoothScroll() {
  const { height: cardHeight } =
    galleryListEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
