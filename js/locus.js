function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(pos)
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
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

   var config = {
                apiKey: "AIzaSyA1n9MmgGXH8mUX8YCcpj8-tuzDW8Y3wVc",
                authDomain: "locusimg.firebaseapp.com",
                databaseURL: "https://locusimg.firebaseio.com",
                storageBucket: "locusimg.appspot.com",
            };
        firebase.initializeApp(config);


var database = firebase.database().ref();
var click = false;

function upload() {
    var name = $('#name').val();
    var locus = $('#geo').val();
    var img = $('#file').val();
    var like = 0;

    database.push({
        'name':name,
        'locus':locus,
        'image': img,
        'like': like
    });
    $('.upload').animate({
        marginLeft: '-=350px'}, 500
    )
    click = false;
}

database.on('child_added',function(dataRow){
	//getting raw values
  	var row = dataRow.val();
  	//adding to the div
    $(".locus").append(
        '<div class="photo"><div class="info"><h2 class="user">' + row.name + '|' + row.locus +
        '</h2><button type="button" name="button" class="button">like</button><h2 class="likes">' + row.like +
        '</h2></div><img src="' + row.image + '" class="width"/></div>'
    );
})

$("#cancel").click(function() {
    $('.upload').animate({
        marginLeft: '-=350px'}, 500
    )
    click = false;
})

$('#plus').click(function() {
    if (click == false) {
        $('.upload').animate({
            marginLeft: '+=350px'}, 500
        )
        click = true;
    }
})
