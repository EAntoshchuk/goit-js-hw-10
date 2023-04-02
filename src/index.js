import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import country_card from '../src/templates/country-card.hbs';
import country_list from '../src/templates/country-list.hbs';
import { fetchCountry } from './js/fetch-countries';
import getRefs from './js/get-refs';

const BASE_URL = 'https://restcountries.com/v3.1/name';
// const options = {
//   fields: 'name,capital,population,flags,languages',
// };

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

refs.searchBox.addEventListener(
  'input',
  debounce(searchCountry, DEBOUNCE_DELAY)
);

function searchCountry(event) {
  const seachedCountry = refs.searchBox.value.trim();

  fetchCountry(seachedCountry)
    .then(data => {
      if (seachedCountry.length < 2) {
        Notiflix.Notify.warning('Make a searh request');
        return;
      } else if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (data.length >= 2 && data.length <= 10) {
        refs.countryInfo.innerHTML = '';
        return renderCountryList(data);
      }
      refs.countryList.innerHTML = '';
      renderCountryInfo(data);
    })
    .catch(error => {
      refs.countryList.innerHTML = '';
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryInfo(countries) {
  const countryInfoMarkup = country_card(countries);
  refs.countryInfo.innerHTML = countryInfoMarkup;
}

function renderCountryList(countries) {
  const countryListMarkup = country_list(countries);
  refs.countryList.innerHTML = countryListMarkup;
}

// function fetchCountry(countryName) {
//   return fetch(
//     `${BASE_URL}/${countryName}?fields=name,capital,population,flags,languages`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
