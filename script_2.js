
const GmapsAPIKey = 'AIzaSyD5xyTbq7-qUk6xWmO61-yFiD0FIkzoB4I';

let cities = [];
let commands = []
let commandButton = 1;
let firstCommand = 0;
// let currentLat = 0;
// let currentLng = 0;

const synth = window.speechSynthesis;

const speak = text => {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  let utterThis = new SpeechSynthesisUtterance(text);
  // utterThis.pitch = 2;
  utterThis.rate = 0.8;
  synth.speak(utterThis);
};


let citiesNumber = 3;

let cityInputs = [];

for (i=0; i<citiesNumber; i++){
  let input = document.createElement("input");
  //input.id = "text-input"+i;
  //document.getElementById("city-inputs").appendChild(input);
  // document.getElementById("text-input"+i).style. = center;
  cityInputs.push(input);
}

document.querySelector('#button3').onclick = () => {
  let input = document.createElement("input");
  document.getElementById("city-inputs").appendChild(input);
  cityInputs.push(input);
}

document.querySelector('#button').onclick = () => {
  let queries = [];
  for (i=0; i < cityInputs.length; i++){
    let name = cityInputs[i].value;
    console.log(name);
    let city = new City(name);
    cities.push(city);
    let req = city.mapToSteps();
    queries.push(req);
  }
  console.log(queries);

  Promises.all(queries).then(values => {
    console.log(values);
    for (let i = 0; i < values.length; i++) {
      // data for all three cities is here
      // in values[i]

      // putting some results in the associated city object
      cities[i].lat = values[i].results[0].geometry.location.lat
    }
  });

}



// document.querySelector('#button').onclick = () => {
//   for (i=0; i<citiesNumber; i++){
//     let name = document.querySelector('#text-input'+i).value;
//     let city = new City(name);
//     city.mapToSteps();
//     cities.push(city);
//   }
// }

document.querySelector('#button2').onclick = () => {
  console.log(commands[commandButton]);
  speak(commands[commandButton])
  commandButton ++;
}


function City(name){
  this.name = name;
  this.lat=0;
  this.lng=0;
  this.latSteps=0;
  this.lngSteps=0;
  this.directionLat = ' ';
  this.directionLng = ' ';

  this.mapToSteps = function(){
    let url =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${GmapsAPIKey}`
    console.log(url);

    return fetch(url)
      .then(response => response.json())
      // .then(data => {
      //   // console.log(data);
      //   this.lat = data.results[0].geometry.location.lat;
      //   this.lng = data.results[0].geometry.location.lng;
      //   console.log(this.lat, this.lng);
      //   //lat: left is positive, right is negative
      //   //lng: up is negative, down is positive
      //   if (this.lat>0){this.latSteps = "front";} else {this.latSteps = "back";}
      //   if (this.lng>0){this.lngSteps = "right";} else {this.lngSteps = "left";}
      //
      //   console.log (this.latSteps, this.lngSteps);
      //
      //   let mappedLat = map(this.lat, -180, 180, 0, 16);
      //   let mappedLng = map(this.lng, -90, 90, 0, 8);
      //
      //   let mappedLatRound = Math.round(mappedLat);
      //   let mappedLngRound = Math.round(mappedLng);
      //
      //   this.directionLat = "walk "+mappedLatRound+" steps to the "+this.latSteps;
      //   this.directionLng = "walk "+mappedLngRound+" steps to the "+this.lngSteps;
      //
      //   // ?? is this a problem to put stuff in a global variable
      //   // outside the city object
      //   commands.push(this.directionLat);
      //   commands.push(this.directionLng);
      //
      //   if (firstCommand == 0){
      //     speak(this.directionLat);
      //     hide(document.querySelector('#button'));
      //     hide(document.querySelector('#city-inputs'))
      //     show(document.querySelector('#button2'));
      //   }
      //
      //
      //   firstCommand++;
      // });
  }
}

function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getDirection(city1, city2){
        return {directionLat: city2.mappedLat - city1.mappedLat }
}

function show(elem) {
	elem.style.display = 'block';
};

function hide(elem) {
	elem.style.display = 'none';
};
