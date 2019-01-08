var county;
var continent;
$(document).ready(function() {
});

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
        console.log(data);
        console.log('hej');
      }
    });
  //console.log(long);
  //console.log(lat);
}

function randomizeHotel(hotels) {
  var hotelIndex = hotels[Math.floor(Math.random() * hotels.length)];
  console.log(hotelIndex);
}
