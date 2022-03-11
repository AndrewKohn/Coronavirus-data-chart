'use strict';
const baseURL = `https://coronavirus.m.pipedream.net/`;

var covidUSData = [];
var usStates = new Set();

// Collect only US data
const getUSData = data => {
  for (let i = 0; i < data.rawData.length; i++) {
    if (data.rawData[i].Country_Region === 'US') {
      covidUSData.push(data.rawData[i]);
      usStates.add(data.rawData[i].Province_State);
    }
  }
  sumOfConfirmedCases();
};

// Get sum of confirmed cases within State
const sumOfConfirmedCases = () => {
  let stateTotal = [];

  for (let i = 0; i < usStates.length; i++) {
    for (let j = 0; j < covidUSData.length; j++) {
      let sum = 0;
      if (covidUSData[j].Province_State === usStates[i]) {
        sum += covidUSData[j].Confirmed;
        console.log(sum);
      }
      stateTotal.push(sum);
    }
  }
  console.log(stateTotal);
};

// CORONAVIRUS DATA
fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    getUSData(data);
  })
  .catch(err => console.log(err));
