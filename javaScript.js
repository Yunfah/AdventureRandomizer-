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
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+long+"&radius=1500&type=restaurant&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo",
      headers: {"Accept": "application/json"}
    })
    .done(function(data) {
      console.log(data);
    });
  //console.log(long);
  //console.log(lat);
}
