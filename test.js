'use strict';

const baseURL = `https://coronavirus.m.pipedream.net/`;
const countrySelectElement = document.getElementById(`countries`);
const provinceStateElement = document.getElementById(`province-state`);
const submitBtn = document.querySelector(`.submit-Btn`);

let covidData = [];

fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    covidData = data;
    displayUSData(data);
    createCountrySelection(data);
    console.log(data);
    console.log(covidData);
  })
  .catch(err => console.log(err));

const displayUSData = data => {
  for (let i = 0; i < data.rawData.length; i++) {
    if (data.rawData[i].Country_Region === `US`) {
      console.log(data.rawData[i].Combined_Key);
    }
  }
};

const createCountrySelection = data => {
  let countrySet = new Set();

  for (const element of data.rawData) {
    countrySet.add(element.Country_Region);
  }

  for (const country of countrySet) {
    const htmlCountry = `<option class="selection--country">${country}</option>`;
    countrySelectElement.insertAdjacentHTML(`beforeend`, htmlCountry);
  }
};

countrySelectElement.addEventListener(`change`, function (e) {
  for (const selection of covidData.rawData.Country_Region) {
    console.log(selection);
  }
});
