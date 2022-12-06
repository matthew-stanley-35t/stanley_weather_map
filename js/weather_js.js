"use strict";

mapboxgl.accessToken = mapBoxKey;

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 8,
    center: [-104.9903, 39.7392],
});

let marker = new mapboxgl.Marker()
//let clickLocation = $('#weatherLocation');

function add_marker(event) {
    let coords = event.lngLat;
    marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat(coords)
        .addTo(map);
    getWeather(coords.lat, coords.lng);
    reverseGeocode({lat: coords.lat, lng: coords.lng}, mapBoxKey).then(function (results) {
        console.log(results);
        locationOfClick.html(results);
    })
}

map.on('click', add_marker);

let cardContainer = $('#cards')

let lat = 39.7392;
let long = -104.9903;
function getWeather(lat,long){
    $.get("https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ long +"&appid=" + weatherKey + "&units=imperial").done(function(data) {
        let reports = data.list;
        let html = '';

        for(let i = 0; i < reports.length; i += 8) {
            let cardHeader = reports[i].dt_txt.split(' ');
            let highT = reports[i].main.temp_max;
            let lowT = reports[i].main.temp_min;
            let icon = reports[i].weather[0].icon;
            let weatherDesc = reports[i].weather[0].description;
            let humidity = reports[i].main.humidity;
            let windSpeed = reports[i].wind.speed;
            let pressure = reports[i].main.pressure;

            html +=
                '<div class="card text-center" style="width: 15rem; background: lightblue">' +
                '<div class="card-header">' + cardHeader[0] + '</div>' +
                '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><span>' + parseInt(highT) + '*F / ' + parseInt(lowT) + '*F</span><br><img src="https://openweathermap.org/img/w/' + icon + '.png" alt="Weather Icon"></li>'+
                '<li class="list-group-item"><span>Condtions: ' + weatherDesc + '</span><br><span>Humidity: ' + humidity + '%</span></li>'+
                '<li class="list-group-item">Wind Speed: ' + parseInt(windSpeed) + ' MPH</li>'+
                '<li class="list-group-item">Pressure: ' + pressure + ' psi</li>'+
                '</ul>'+
                '</div>'
        }
        cardContainer.html(html);
    });
}
getWeather(lat,long);