import './css/styles.css';
// import country_card from './templates/country-card.hbs';
import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const options = {
  fields: 'capital,population,flags,languages',
};

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(event => {
    searchCountry();
  }, DEBOUNCE_DELAY)
);

function searchCountry(event) {
  const seachedCountry = refs.searchBox.value.trim();
  if (seachedCountry === '') {
    Notify.warning('Make a searh request');
    return;
  }
  if (fetchCountry(refs.searchBox.value).length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else
    fetchCountry(refs.searchBox.value).then(data => {
      refs.countryInfo.innerHTML = countryInfo(data);
    });
}

// fetchCountry()
//   .then()
//   .catch(error => console.log(error));

function fetchCountry() {
  const nameCountry = refs.searchBox.value;
  return fetch(`${BASE_URL}${nameCountry}?${options}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      const markup = country_card(data);
      console.log(markup);
    })
    .catch(error => {
      console.warn(error);
    });
}
