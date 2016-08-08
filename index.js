  // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAonQbZOHwhSRXNzcNBaI2cch0MKs-SSVk",
      authDomain: "locus-7167b.firebaseapp.com",
      databaseURL: "https://locus-7167b.firebaseio.com",
     storageBucket: "locus-7167b.appspot.com",
    };
    firebase.initializeApp(config);

    var database = firebase.database().ref()
    console.log("storage: " + database);
    var storage = database.storage;
    console.log("storage: " + storage);



      function next(){
        var Username = $("#username").val();
        var Password = $("#password").val();
        database.push({
          'INFO':grabUI(),
          'DATA':data
        });
      }


      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 20
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
            map
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }