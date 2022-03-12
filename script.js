'use strict';
const baseURL = `https://coronavirus.m.pipedream.net/`;

var covidUSData = [];
var statesSet = new Set();
var statesConfirmedCases;

// Collect only US data
const getUSData = data => {
  for (let i = 0; i < data.rawData.length; i++) {
    if (data.rawData[i].Country_Region === 'US') {
      if (
        data.rawData[i].Province_State != 'American Samoa' &&
        data.rawData[i].Province_State != 'Diamond Princess' &&
        data.rawData[i].Province_State != `District of Columbia` &&
        data.rawData[i].Province_State != `Grand Princess` &&
        data.rawData[i].Province_State != `Guam` &&
        data.rawData[i].Province_State != `Northern Mariana Islands` &&
        data.rawData[i].Province_State != `Puerto Rico` &&
        data.rawData[i].Province_State != `Recovered` &&
        data.rawData[i].Province_State != `Virgin Islands`
      ) {
        covidUSData.push(data.rawData[i]);
        statesSet.add(data.rawData[i].Province_State);
      }
    }
  }
  console.log(covidUSData);
  getSumOfConfirmedCases(statesSet);
};

const getSumOfConfirmedCases = () => {
  let sum = 0;
  let currentUSState = statesSet[0];
  for (let i = 0; i < covidUSData.length; i++) {
    for (let j = 0; j < statesSet.size; j++) {
      if (currentUSState === statesSet[j]) {
        console.log(currentUSState, statesSet[j]);
      }
    }
  }
};

// US MAP
const createUSMap = () => {
  fetch('https://unpkg.com/us-atlas/states-10m.json')
    .then(r => r.json())
    .then(us => {
      const nation = ChartGeo.topojson.feature(us, us.objects.nation)
        .features[0];
      const states = ChartGeo.topojson.feature(us, us.objects.states).features;

      const chart = new Chart(
        document.getElementById('canvas').getContext('2d'),
        {
          type: 'choropleth',
          data: {
            labels: states.map(d => d.properties.name),
            datasets: [
              {
                label: 'States',
                outline: nation,
                data: states.map(d => ({
                  feature: d,
                  value: Math.random() * 10,
                })),
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              xy: {
                projection: 'albersUsa',
              },
              color: {
                quantize: 5,
                legend: {
                  position: 'bottom-right',
                  align: 'bottom',
                },
              },
            },
          },
        }
      );
    });
};

// CORONAVIRUS DATA
fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    getUSData(data);
    createUSMap();
  })
  .catch(err => console.log(err));
