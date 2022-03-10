'use strict';

const baseURL = `https://coronavirus.m.pipedream.net/`;

fetch(baseURL)
  .then(response => response.json())
  .then(data => {
    displayUSData(data);
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
