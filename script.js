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
      let sumC = 0;
      let sumD = 0;
      for (let i = 0; i < covidUSData.length; i++) {
        if (covidUSData[i].Province_State === state) {
          sumC += Number(covidUSData[i].Confirmed);
          sumD += Number(covidUSData[i].Deaths);
        }
      }
      statesConfirmedCases.push({
        state: state,
        confirmed: sumC,
        deaths: sumD,
      });
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
            states[i].confirmed = state.confirmed;
            states[i].deaths = state.deaths;
            console.log(state, state.confirmed);
          }
        }
      });

      console.log(states);

      const confirmedCasesChart = new Chart(
        document.getElementById('confirmed-cases-chart').getContext('2d'),
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
                  value: d.confirmed,
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
                  position: 'top-left',
                  // align: 'bottom',
                },
              },
            },
          },
        }
      );

      const deathCasesChart = new Chart(
        document.getElementById('death-cases-chart').getContext('2d'),
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
                  value: d.deaths,
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
                  position: 'top-left',
                  // align: 'bottom',
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
