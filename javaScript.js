
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
        headers: {"Accept": "application/json"}
      })
      .done(function(data) {
        if(data['results'] == 0) {
          getCoordinates();
        } else {
          randomizeHotel(data['results']);
        }
      });
  }

  function randomizeHotel(hotels) {
    var hotel = hotels[Math.floor(Math.random() * hotels.length)];
    extractFacts(hotel);
  }

function extractFacts(hotel) { //kan vara onödig
  $('#hotel').text(hotel['name']);
  $('#rating').text(hotel['rating']);

  var hotelLat = hotel['geometry']['location']['lat'];
  var hotelLong = hotel['geometry']['location']['lng'];
  //hantera 0 om den är undefined, ha en hårdkodad bild

  //var imageRef = hotel['photos'];
  var placeID = hotel['place_id'];

  displayInfo(hotelLat, hotelLong);
  getLocation(placeID);
  getRestaurant(hotelLat, hotelLong);
//  console.log(placeID);
//  console.log(hotelLat);
//  console.log(hotelLong);
//  console.log(imageRef);

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
    //Uppdatera vänstra delen av med namn, bild??, rating, stad, land
  }

function getPicture(imageRef) {

  $.ajax({
    url: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+imageRef+"&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo ",
    headers: {"Accept": "application/json"}
  })
  .done(function(data) {

    $('#destination-img').attr('src', this.url );
  });
}

function getLocation(placeID) {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/place/details/json?placeid="+placeID+"&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo",
    headers: {"Accept": "application/json"}
  })
  .done(function(data) {
    var webpage = data['result']['website'];

    if (typeof data['result']['photos'] == "undefined" ) {
      console.log("finns ej bilder");
  } else {

    var imageRef = data['result']['photos']['0']['photo_reference'];
    //console.log(imageRef);
    getPicture(imageRef);
  }
    if(webpage == null){
      document.getElementById("proceed-btn").innerHTML="Hotel does not have webpage";
    //  console.log('disabled');
    } else {
      $("#proceed-btn").removeAttr("disabled");
      var butt = document.getElementById("proceed-btn").href=webpage;
    //  console.log(webpage);
    }
    var address = data['result']['address_components'];
  //  console.log(address);
    displayCityAndCountry(address);

    //länka knappen till hemsidan
  });
}

function displayCityAndCountry(arr) {
   var obj = null;
   for(var i=0; i<arr.length;i++) {
     obj = arr[i];
      if(obj.types['0'] == 'postal_town') {
      //  console.log(obj.long_name + " locality");
        $('#city').text(obj.long_name);
        break;
    }
      if(obj.types['0'] == 'locality') {
      //  console.log(obj.long_name + " locality");
        $('#city').text(obj.long_name);
        break;
      }
      if(obj.types['0'] == 'administrative_area_level_3') {
    //    console.log(obj.long_name + " lvl 3");
        $('#city').text(obj.long_name);
        break;
      }
      if(obj.types['0'] == 'administrative_area_level_2') {
      //  console.log(obj.long_name + " lvl 2");
        $('#city').text(obj.long_name);
        break;
      }

    }
    for(var i=0; i<arr.length;i++) {
      obj = arr[i];
      if(obj.types['0'] == 'country') {
           $('#country').text(obj.long_name);
           convertCountryToRegion(obj.long_name);
       }
    }
   }


   function convertCountryToRegion(country) {
     $.ajax({
       url: "https://restcountries.eu/rest/v2/name/"+ country + "?fields=name;country;region;region;subregion;region=true",
       headers: {"Accept": "application/json"}
     })
     .done(function(data) {
       console.log(data);
       if(data['0'].region == 'Americas') {
         console.log(data['0'].subregion);
       } else{
      console.log(data['0'].region);
       }
     });
   }

 
   function getRestaurant(hotelLat, hotelLong) {
    $.ajax({
      //Radie på 1500 (standard)
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+hotelLat+","+hotelLong+"&radius=1500&type=restaurant&key=AIzaSyBLs-NPmwcLLjovVoIC4tKKhysLzND7vuo",
      headers: {"Accept": "application/json"}
    })
    .done(function(data) {
      console.log(data['results'] );
      var obj = data['results']

      // show a list of restaurants if there are 

      //TODO
      // Make  an error handling if there are no restaurants
      for(var i=0; i<obj.length ;i++) {
        console.log(obj[i]['name']);
        $("#mylist").append('<li>'+ obj[i]['name'] + '</li>');

      }

    });
}
   
