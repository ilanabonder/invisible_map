
const GmapsAPIKey = 'AIzaSyD5xyTbq7-qUk6xWmO61-yFiD0FIkzoB4I';

let cities = [];
let city_index = 0;
let commands = []
let commandButton = 1;
let firstCommand = 0;

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


let citiesNumber = 1;
createInputs();

function createInputs(){

  for (i=0; i<citiesNumber; i++){
    let input = document.createElement("input");
    input.id = "text-input"+i;
    document.getElementById("city-inputs").appendChild(input);
    // document.getElementById("text-input"+i).style. = center;
  }
}

document.querySelector('#button').onclick = () => {
  for (i=0; i<citiesNumber; i++){
    let name = document.querySelector('#text-input'+i).value;
    let city = new City(name);
    // city.mapToSteps();
    cities.push(city);
  }
  cities[city_index].mapToSteps();
}

document.querySelector('#button3').onclick = () => {
  //   for (i=0; i<citiesNumber; i++){
  // input.id = "text-input"+i;
  // document.getElementById("city-inputs").removeChild(input.id);
  //   }
  document.getElementById("city-inputs").innerHTML = '';
  citiesNumber++;
  createInputs();
}

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

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // console.log(data);

        this.lat = data.results[0].geometry.location.lat;
        this.lng = data.results[0].geometry.location.lng;
        console.log(this.lat, this.lng);

        // get past lat minus current lat
        let realLatMovement = this.lat;
        let realLngMovement = this.lng;
        //

        if(city_index > 0){
          // let realLatMovement;
          console.log ("before: " + realLatMovement);
          realLatMovement = cities[city_index].lat - cities[city_index - 1].lat;
          realLngMovement = cities[city_index].lng - cities[city_index - 1].lng;
          console.log ("after: " + realLatMovement);
        }


        console.log("difference: " + realLatMovement + ',' + realLngMovement);

        //lat: left is positive, right is negative
        //lng: up is negative, down is positive
        if (realLatMovement>0){this.latSteps = "front";} else {this.latSteps = "back";}
        if (realLngMovement>0){this.lngSteps = "right";} else {this.lngSteps = "left";}

        console.log (this.latSteps, this.lngSteps);

        let mappedLat = map(realLatMovement, -90, 90, -8, 8);
        let mappedLng = map(realLngMovement, -180, 180, -16, 16);

        let mappedLatRound = Math.abs(Math.round(mappedLat));
        let mappedLngRound = Math.abs(Math.round(mappedLng));

        this.directionLat = "walk "+mappedLatRound+" steps to the "+this.latSteps;
        this.directionLng = "walk "+mappedLngRound+" steps to the "+this.lngSteps;

        commands.push(this.directionLat);
        commands.push(this.directionLng);

        if (firstCommand == 0){
          speak(this.directionLat);
          hide(document.querySelector('#title'));
          hide(document.querySelector('#button3'));
          hide(document.querySelector('#button'));
          hide(document.querySelector('#city-inputs'))
          show(document.querySelector('#button2'));
        }

        firstCommand++;

        city_index++;
        if(city_index < cities.length){
          cities[city_index].mapToSteps();
        }
      });
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
