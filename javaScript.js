
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
        //var hotelAmount = data['results'].length;
        randomizeHotel(data['results']);
      }
    });
}

function randomizeHotel(hotels) {
  var hotel = hotels[Math.floor(Math.random() * hotels.length)];
  extractFacts(hotel);
}

function extractFacts(hotel) { //kan vara onödig
  var hotelName = hotel['name'];
  var hotelRating = hotel['rating'];
  var hotelLat = hotel['geometry']['location']['lat'];
  var hotelLong = hotel['geometry']['location']['lng'];
  var image = hotel['photos'];
  $('#city').text(hotel['name']);
  //var photoref = image[0];
  //$('#destination-img').html('<img src="' + photoref+'">');
  console.log(image);
  //console.log(photoref);
  console.log(hotelRating);
  console.log(hotelName);
  console.log(hotelLat);
  console.log(hotelLong);
  displayInfo(hotelLat, hotelLong, hotelName, hotelRating);
}

function changeWindow() {
  window.location.pathname = '/index.html';
}

function placeMarker(hotelLat, hotelLong) {
  var location = {lat: hotelLat, lng: hotelLong};
  var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: location});
  var marker = new google.maps.Marker({position: location, map: map});
}

function displayInfo(hotelLat, hotelLong, hotelName, hotelRating) {
  placeMarker(hotelLat, hotelLong);
  getContinent(hotelLat, hotelLong);
  //Uppdatera vänstra delen av med namn, bild??, rating, stad, land
}

function getContinent(lat, long) {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo",
    headers: {"Accept": "application/json"}
  })
  .done(function(data) {

    var addresses = data['results'];
    console.log(addresses);

  });
}
