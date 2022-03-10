'use strict';

const baseURL = `https://coronavirus.m.pipedream.net/`;
const countrySelectElement = document.getElementById(`countries`);
const submitBtn = document.querySelector(`.submit-Btn`);

fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    displayUSData(data);
    createCountrySelection(data);
    console.log(data);
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
    const htmlOption = `<option class="selection--country">${country}</option>`;
    countrySelectElement.insertAdjacentHTML(`beforeend`, htmlOption);
  }
};
