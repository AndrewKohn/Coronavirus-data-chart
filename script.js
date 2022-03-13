'use strict';
const baseURL = `https://coronavirus.m.pipedream.net/`;

var covidUSData = [];
var statesSet = new Set();
var statesConfirmedCases = [];

// Collect only US data
const getUSData = data => {
  for (let i = 0; i < data.rawData.length; i++) {
    if (data.rawData[i].Country_Region === 'US') {
      // Removes US Territories and miscellaneous domains
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
  console.log(statesSet);

  const getSumOfConfirmedCases = () => {
    statesSet.forEach(state => {
      let sum = 0;
      for (let i = 0; i < covidUSData.length; i++) {
        if (covidUSData[i].Province_State === state) {
          sum += Number(covidUSData[i].Confirmed);
        }
      }
      statesConfirmedCases.push({ state: state, value: sum });
    });
    // console.log(state);
    console.log(statesConfirmedCases);
    console.log(statesConfirmedCases.length);
  };

  getSumOfConfirmedCases();
};

// US MAP
const createUSMap = () => {
  fetch('https://unpkg.com/us-atlas/states-10m.json')
    .then(r => r.json())
    .then(us => {
      const nation = ChartGeo.topojson.feature(us, us.objects.nation)
        .features[0];
      const states = ChartGeo.topojson.feature(us, us.objects.states).features;

      statesConfirmedCases.forEach(state => {
        for (let i = 0; i < states.length; i++) {
          if (states[i].properties.name === state.state) {
            states[i].value = state.value;
            console.log(state, state.value);
          }
        }
      });

      console.log(states);

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
                  value: d.value,
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
                quantize: 100,
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
