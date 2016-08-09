  // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      // Initialize Firebase
    var account = [] 
    var Gprofile =     var config = {
      apiKey: "AIzaSyAonQbZOHwhSRXNzcNBaI2cch0MKs-SSVk",
      authDomain: "locus-7167b.firebaseapp.com",
      databaseURL: "https://locus-7167b.firebaseio.com",
     storageBucket: "locus-7167b.appspot.com",
    };
    firebase.initializeApp(config);

    var database = firebase.database().ref()

//     database.on('value',function(dataRow){
//   //getting raw values
//     var row = dataRow.val();
//     //adding to the div
//     console.log(row);

      function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;
        $("#username").val() = profile.getGivenName();
        $("#password").val() = profile.getID();
        firebase.database().ref('users/' + $("#username").val()).on('value', function(snapshot) {
          if(snapshot.val() = null){
              signup();
          }
          login();
        }); 
      };
// }
      function signup(){
        var Username = $("#username").val();
        var Password = $("#password").val();
        firebase.database().ref('users/' + Username).set({
          'Username': Username,
          'Password': Password
        });
        alert("Account created under username: " + Username)
      }

      function login(){

          var Username = $("#username").val();
          var Password = $("#password").val();
        if(Username != "" || Password != ""){
          var passCheck = null
        firebase.database().ref('users/' + Username).on('value', function(snapshot) {
            if(snapshot.val() != null){
            passCheck = snapshot.val().Password
          } else {
            alert("An acoount has not been made with that user name")
          }
        }); 
        } else {
          alert("Please Enter Something In Both Fields")
        }
        
        if(passCheck = Password && passCheck != null){
          alert("Welcome back " + Username);
        }
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