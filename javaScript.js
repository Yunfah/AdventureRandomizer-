var map;

/* Function that randomizes coordinates */
function getCoordinates() {
  //Longitude: -180 to +180, toFixed() decides the amount of decimals
  var long = (Math.random() * (-180 - 180) + 180).toFixed(7) * 1;
  //Latitude: -90 to +90, toFixed() decides the amount of decimals
  var lat = (Math.random() * (-90 - 90) + 90).toFixed(7) * 1;
  getHotels(long, lat);
}

/* Function that given a certain pair of coordinates gets a list of the "hotels" within a radius of 50km of those coordinates */
function getHotels(long, lat) {
  $.ajax({
      //Using the Google maps nearbysearch API to recieve the hotels
      //Changed API key
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=50000&type=lodging&keyword=hotel,lodging,motel&key=AIzaSyBCZEoS8cNuNkHxDzdIw0KhBil7oMgd2jM",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      //If there are no hotels within 50km of the given coordinates, coordinates will be regenerated
      if (data['results'] == 0) {
        getCoordinates();
      } else {
        randomizeHotel(data['results']);
      }
    });
}

/* Function that randomizes a hotel within the given list */
function randomizeHotel(hotels) {
  var hotel = hotels[Math.floor(Math.random() * hotels.length)];
  extractFacts(hotel);
}

/* Function showing name and rating of the hotel, while also calling other functions with data extracted from the hotelresult */
function extractFacts(hotel) {
  $('#hotel').text(hotel['name']);
  $('#rating').text(hotel['rating']);

  var hotelLat = hotel['geometry']['location']['lat'];
  var hotelLong = hotel['geometry']['location']['lng'];
  var placeID = hotel['place_id'];

  placeHotelMarker(hotelLat, hotelLong);
  getLocation(placeID);
  getRestaurant(hotelLat, hotelLong);
  getMuseums(hotelLat, hotelLong);
  getArt(hotelLat, hotelLong);
}

/* Function that changes the frame showing when clicking on the X in upper left corner */
function changeWindow() {
  window.location.pathname = '/index.html';
}

/* Function that initializes the map, and drops a marker on the hotel location */
function placeHotelMarker(hotelLat, hotelLong) {
  var location = {
    lat: hotelLat,
    lng: hotelLong
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: location
  });
  var marker = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,
    map: map
  });
}

/* Function that drops yellow markers on the location of the coordinates
given(restaurants, museums or art galleries) */
function placeAttractionMarker(lat, long) {
  var location = {
    lat: lat,
    lng: long
  };
  map.setZoom(15);
  map.panTo(location);
  var marker = new google.maps.Marker({
    map: map,
    position: location,
    animation: google.maps.Animation.DROP,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
    }
  });
}

/* Function that recieves the given picture of the hotel */
function getPicture(imageRef) {
  $.ajax({
      //Using the Google maps place photos API to recieve the picture
      //Changed API KEY
      url: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + imageRef + "&key=AIzaSyBCZEoS8cNuNkHxDzdIw0KhBil7oMgd2jM ",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      $('#destination-img').attr('src', this.url);
    });
}

/* Function that recieves further details of the hotel, given a ID */
function getLocation(placeID) {
  $.ajax({
      //Using the Google maps place details API to recieve the data
      //Changed API Key
      url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeID + "&key=AIzaSyBCZEoS8cNuNkHxDzdIw0KhBil7oMgd2jM",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      //Checks if the result provides pictures
      if (typeof data['result']['photos'] == "undefined") {
          console.log("Hotell ger ej bilder");
      } else {
        var imageRef = data['result']['photos']['0']['photo_reference'];
        getPicture(imageRef);
      }
      //Checks if the result provides a website link
      var webpage = data['result']['website'];
      if (webpage == null) {
          document.getElementById("proceed-btn").innerHTML = "Hotel does not have webpage";
      } else {
          $("#proceed-btn").removeAttr("disabled");
          var butt = document.getElementById("proceed-btn").href = webpage;
      }
      var address = data['result']['address_components'];
      displayCityAndCountry(address);
    });
}

/* Function displaying the country and city there the hotel is placed */
function displayCityAndCountry(arr) {
  var obj = null;
  for (var i = 0; i < arr.length; i++) {
    obj = arr[i];
    //Since not all results return the same type of term for city, if-statements are rank in accurcy of "citiness"
    if (obj.types['0'] == 'postal_town') {
        $('#city').text(obj.long_name);
        console.log("Postal town");
        break;
    }
    if (obj.types['0'] == 'locality') {
        $('#city').text(obj.long_name);
        console.log("Locality");
        break;
    }
    if (obj.types['0'] == 'administrative_area_level_3') {
        $('#city').text(obj.long_name);
        console.log("Administrative level 3");
        break;
    }
    if (obj.types['0'] == 'administrative_area_level_2') {
        $('#city').text(obj.long_name);
        console.log("Administrative level 2");
        break;
    }

  }
  for (var i = 0; i < arr.length; i++) {
    obj = arr[i];
    if (obj.types['0'] == 'country') {
        $('#country').text(obj.long_name);
        console.log(obj.long_name);
        convertCountryToRegion(obj.long_name);
        break;
    }
  }
}

/* Function that given a country, gets the continent of that country */
function convertCountryToRegion(country) {
  $.ajax({
      //Using the Restcountries API to recieve the continent
      url: "https://restcountries.eu/rest/v2/name/" + country + "?fields=name;country;region;region;subregion;region=true",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      var str = '';
      if (data['0'].region == 'Americas') {
        str = data['0'].subregion;
      } else {
        str = data['0'].region;
      }
      console.log(str);
      setSpotifyPlaylist(str);
    });
}

/* Function that displays the restaurant near the hotel */
function getRestaurant(hotelLat, hotelLong) {
  $.ajax({
      //Using the Google maps nearbysearch API to recieve the restaurants
      // Chnaged API key
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + hotelLat + "," + hotelLong + "&radius=1500&type=restaurant&key=AIzaSyBCZEoS8cNuNkHxDzdIw0KhBil7oMgd2jM",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      var obj = data['results']
      var lat = null;
      var lng =null;
      if (obj === undefined || obj.length == 0) {
          $("#restList").append('<li>There are no restaurant nearby</li>');
          console.log('Det finns inga restauranger i närheten');
      } else {
          for (var i = 0; i < obj.length; i++) {
              lat = obj[i]['geometry']['location']['lat'];
              lng = obj[i]['geometry']['location']['lng'];
              $("#restList").append('<li><a onclick="placeAttractionMarker('+lat+ ','+lng+');">'+ obj[i]['name'] + '</a> </li>');
          }
      }
    });
}

/* Function that displays the art galleries near the hotel */
function getArt(hotelLat, hotelLong) {
  $.ajax({
      //Using the Google maps nearbysearch API to recieve the art galleries
      //Changed API Key
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + hotelLat + "," + hotelLong + "&radius=1500&type=art_gallery&key=AIzaSyBCZEoS8cNuNkHxDzdIw0KhBil7oMgd2jM",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      var obj = data['results']
      var lat = null;
      var lng =null;
      if (obj === undefined || obj.length == 0) {
          $("#artList").append('<li>There are no art galleries nearby</li>');
          console.log('Det finns inga art galleries i närheten');
      } else {
          for (var i = 0; i < obj.length; i++) {
              lat = obj[i]['geometry']['location']['lat'];
              lng = obj[i]['geometry']['location']['lng'];
              $("#artList").append('<li><a onclick="placeAttractionMarker('+lat+ ','+lng+');">'+ obj[i]['name'] + '</a> </li>');
          }
      }
    });
}

/* Function that displays the museums near the hotel */
function getMuseums(hotelLat, hotelLong) {
  $.ajax({
      //Using the Google maps nearbysearch API to recieve the museums
      //Changed API Key
      url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + hotelLat + "," + hotelLong + "&radius=1500&type=museum&key=AIzaSyBCZEoS8cNuNkHxDzdIw0KhBil7oMgd2jM",
      headers: {
        "Accept": "application/json"
      }
    })
    .done(function(data) {
      var obj = data['results']
      var lat = null;
      var lng =null;
      if (obj === undefined || obj.length == 0) {
          $("#musList").append('<li>There are no museums nearby</li>');
          console.log('Det finns inga museum i närheten');
      } else {
          for (var i = 0; i < obj.length; i++) {
              lat = obj[i]['geometry']['location']['lat'];
              lng = obj[i]['geometry']['location']['lng'];
              $("#musList").append('<li><a onclick="placeAttractionMarker('+lat+ ','+lng+');">'+ obj[i]['name'] + '</a> </li>');
          }
      }
    });
}

/* Function that given a continent, selects which playlist to play */
function setSpotifyPlaylist(region) {
  var str = "https://open.spotify.com/embed/user/spotify/playlist/";
  if (region == "Asia") {
    str += '37i9dQZF1DXbrQzAhQxGi4';
  }  else if (region == "Africa") {
    str += '37i9dQZF1DWYkaDif7Ztbp';
  } else if (region == "Europe") {
    str += '37i9dQZF1DX5k1GSjYBi0z';
  } else if (region == "South America") {
    str += '37i9dQZF1DX10zKzsJ2jva';
  } else if (region == "Northern America") {
    str += '37i9dQZF1DXcBWIGoYBM5M';
  } else if (region == "Oceania") {
    str += '1eAKmsN8Drc1FTHVvzH3o2';
  } else if (region == "Antarctica ") {
    str += '61ulfFSmmxMhc2wCdmdMkN';
  } else {
    str+= '37i9dQZEVXbMDoHDwVN2tF';
  }

  $('#MusicPLayer').attr('src', str);
}
