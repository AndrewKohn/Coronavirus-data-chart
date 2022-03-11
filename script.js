'use strict';
const baseURL = `https://coronavirus.m.pipedream.net/`;
const countrySelectElement = document.getElementById(`countries`);
const provinceStateElement = document.getElementById(`province-state`);
const submitBtn = document.querySelector(`.submit-Btn`);

var covidData = [];

const getCountryData = () => {
  fetch(baseURL)
    .then(response => response.json())
    .then(data => {
      covidData = data;
      createCountrySelection(data);
      console.log(covidData);
    })
    .catch(err => console.log(err));
};

// Creates select->option html elements of all the countries
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

// Creates select->option elements of all the states/provinces
const getProvinceSelection = country => {
  let provinceSet = new Set();

  for (let i = 0; i < covidData.rawData.length; i++) {
    if (covidData.rawData[i].Country_Region === country) {
      provinceSet.add(covidData.rawData[i].Province_State);
    }
  }

  for (const province of provinceSet) {
    const htmlProvince = `<option class="selection--province-state">${province}</option>`;
    provinceStateElement.insertAdjacentHTML(`beforeend`, htmlProvince);
  }
};

// Collect Confirmed cases for country if no province available
const getCountryCases = country => {
  let confirmedcases = [];

  for (let i = 0; i < covidData.rawData.length; i++) {
    if (covidData.rawData[i].Country_Region === country) {
      confirmedcases.push(covidData.rawData[i].Confirmed);
    }
  }
  return confirmedcases;
};

// Collect Confirmed cases for State/Province
const getProvinceCases = (country, province) => {
  let confirmedcases = [];

  for (let i = 0; i < covidData.rawData.length; i++) {
    if (
      covidData.rawData[i].Country_Region === country &&
      covidData.rawData[i].Province_State === province
    ) {
      confirmedcases.push(covidData.rawData[i].Confirmed);
    }
  }
  return confirmedcases;
};

// Collect County names if present
const getCountyNames = (country, province) => {
  let countyNames = [];
  for (let i = 0; i < covidData.rawData.length; i++) {
    if (
      covidData.rawData[i].Country_Region === country &&
      covidData.rawData[i].Province_State === province
    ) {
      if (covidData.rawData[i].Province_State === province) {
        countyNames.push(covidData.rawData[i].Admin2);
      }
    }
  }
  return countyNames;
};

// Initializes Data
getCountryData();

// Event Listeners
countrySelectElement.addEventListener(`change`, e => {
  provinceStateElement.innerHTML = '';
  getProvinceSelection(e.target.value);
});

submitBtn.addEventListener(`click`, e => {
  const selectedCountry = countrySelectElement.value;
  const selectedProvince = provinceStateElement.value;
  console.log(selectedCountry + ': ' + selectedProvince);
  if (selectedCountry && selectedProvince === ``) {
    console.log(getCountryCases(selectedCountry));
  } else {
    console.log(getCountyNames(selectedCountry, selectedProvince));
    console.log(getProvinceCases(selectedCountry, selectedProvince));
  }
  // [TODO] Remove this chart underneath and create new variable functions that passes conditions
  const ctx = document.getElementById(`myChart`);
  const myChart = new Chart(ctx, {
    type: `bar`,
    data: {
      labels: [...getCountyNames(selectedCountry, selectedProvince)],
      datasets: [
        {
          label: `${selectedProvince}, ${selectedCountry}`,
          data: [...getCountryCases(selectedCountry, selectedProvince)],
          backgroundColor: `rgba(255, 99, 132, 0.2)`,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
