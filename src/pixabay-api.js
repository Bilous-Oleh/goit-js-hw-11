import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '34901251-e528368449684f37c93d349fd';
  #BASE_URL = 'https://pixabay.com/api/';

  query = null;
  page = 1;

  async fetchPhotos() {
    try {
      return await axios.get(`${this.#BASE_URL}`, {
        params: {
          q: this.query,
          page: this.page,
          key: this.#API_KEY,
          per_page: 40,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
        },
      });
    } catch (error) {
      throw new Error(response.massage);
    }
  }
}
