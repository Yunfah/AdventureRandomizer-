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
  var pyrmont = new google.maps.LatLng(lat, long);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    type: ['hotel']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(data) {
    console.log(data);
    if(data.length === 0) {
      getCoordinates();
    } else {
      /*
      var hotelAmount = data['results'].length;
      randomizeHotel(data['results']);
      */
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

function placeMarker(hotelLat, hotelLong) {
  var location = {lat: hotelLat, lng: hotelLong};
  var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: location});
  var marker = new google.maps.Marker({position: location, map: map});
}

function displayInfo(hotelLat, hotelLong) {
  placeMarker(hotelLat, hotelLong);
}
