var county;
var
$(document).ready(function() {
});

//Latitude: -90 to +90, toFixed() decides the amount of decimals
function getCoordinatesLat() {
  return (Math.random() * (-90 - 90) + 90).toFixed(7) * 1;
}
//Longitude: -180 to +180, toFixed() decides the amount of decimals
function getCoordinatesLong() {
  return (Math.random() * (-180 - 180) + 180).toFixed(7) * 1;
}
