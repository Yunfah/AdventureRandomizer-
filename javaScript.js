var county;
var continent;

//Longitude: -180 to +180, toFixed() decides the amount of decimals
//Latitude: -90 to +90, toFixed() decides the amount of decimals
function getCoordinates() {
  var long = (Math.random() * (-180 - 180) + 180).toFixed(7) * 1;
  var lat = (Math.random() * (-90 - 90) + 90).toFixed(7) * 1;
  getHotels(long, lat);
}

function getHotels(long, lat) {
    $.ajax({
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+long+"&radius=50000&type=lodging&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo",
      //url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?latlng="+lat+","+long+"&result_type=locality&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo",
      headers: {"Accept": "application/json"}
    })
    .done(function(data) {
      if(data['results'] == 0) {
        getCoordinates();
      } else {
        var hotelAmount = data['results'].length;
        randomizeHotel(data['results']);
      }
    });
}

function randomizeHotel(hotels) {
  var hotel = hotels[Math.floor(Math.random() * hotels.length)];
  extractFacts(hotel);
}

function extractFacts(hotel) {
  var hotelName = hotel['name'];
  var hotelRating = hotel['rating'];
  var address = hotel['vicinity'];
  var hotelLat = hotel['geometry']['location']['lat'];
  var hotelLong = hotel['geometry']['location']['lng'];
  console.log(hotelRating);
  console.log(address);
  console.log(hotelName);
  console.log(hotelLat);
  console.log(hotelLong);
  displayInfo(hotelLat, hotelLong);
}

function changeWindow() {
  window.location.pathname = '/index.html';
}

function displayInfo(hotelLat, hotelLong) {
  initMap(hotelLat, hotelLong);
}

function initMap(hotelLat, hotelLong) {
  var location = {lat: hotelLat, lng: hotelLong};
  var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: location});
  var marker = new google.maps.Marker({position: location, map: map});
}
