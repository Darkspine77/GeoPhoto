var lat;
var lon;
var coords = [];
var location;
var area;

account = localStorage.getItem('_account');
if(account == null){
    document.location.href = "index.html";
}
localStorage.removeItem('_account');
//decodes a string data encoded using base-64
account = atob(account);
//parses to Object the JSON string
account = JSON.parse(account);
//do what you need with the Object
navigator.geolocation.getCurrentPosition(function(position){
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    coords.push(lat);
    coords.push(lon);
    var geocoder = new google.maps.Geocoder;
    geocodeLatLng(geocoder);
    function geocodeLatLng(geocoder) {
        var latlng = {lat: parseFloat(coords[0]), lng: parseFloat(coords[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                var locinfo = results[1].formatted_address.split(',')
                area = locinfo[0];
                console.log(area);
            }
        });
    }
});

// Create a root reference
var storageRef = firebase.storage().ref();
var database = firebase.database().ref('images/');
var click = false;

function upload() {
    var name = account.User;
    var like = 0;
    var userlike = ["blank"];
    if($('#file2').val() != ""){
        var file = document.getElementById("file2").files[0];
        // We can use the 'name' property on the File API to get our file name
        var uploadTask = storageRef.child('images/' + file.name).put(file);
        uploadTask.on('state_changed', function(snapshot){
        }, function(error) {
        }, function() {
            var img = uploadTask.snapshot.downloadURL;
            database.push({
                'name': name,
                'locus': area,
                'userlike': userlike,
                'coords': coords,
                'image': img,
                'like': like
            });
        });
        $('.upload').animate({
            marginLeft: '-=520px'}, 520
        )
        click = false;
        $('#name').val("");
        $('#geo').val("");
        $('#file1').val("");
        $('#file2').val("");
    } else {
        $('#input').text('You must add a location and upload an image first');
    }
}

database.on('child_added', function(dataRow) {
	//getting raw values
	var row = dataRow.val();
  	//adding to the div
  	withinLat = row.coords[0] < (lat + .00723) && row.coords[0] > (lat - .00723);
  	withinLon = row.coords[1] < (lon + .00723) && row.coords[1] > (lon - .00723);

    	if(withinLat && withinLon) {
	        $(".locus").append(
	            '<div id="' + dataRow.key + '" class="photo"><div class="info"><h2 class="user">' + row.name + '|' + row.locus +
	            '</h2><button type="button" name="button" class="button" onclick="likeme(' + "'" + dataRow.key + "'" +
	            ')">like</button><h2 class="likes">' + row.like +
	            '</h2></div><div class="center"><img src="' + row.image + '" class="width"/></div></div>'
	        );
    	}
});
/*
function likeme(id) {
    var like = firebase.database().ref('images/' + id);
    like.once('value').then(function(snapshot) {
        var data = snapshot.val();
        var liked = false;
        var index;
        for (var i = 0; i < (data.userlike.length - 1); i++) {
            if (data.userlike[i] == account.User) {
                liked = true;
                index = i;
            }
        }
        if (liked) {
            console.log("you liked it already");
            console.log(liked);
            var likes = (data.like - 1);
            like.update({
                'like': likes
            });
            $("#" + id + " .likes").eq(0).text(likes);
            firebase.database().ref('images/' + id + "/userlike/" + index).remove();
        } else if (liked == false) {
            console.log("you liked me");
            console.log(liked);
            var likes = (data.like + 1);
            var you = data.userlike[i];
            like.update({
                'like': likes
            });
            $("#" + id + " .likes").eq(0).text(likes);
            firebase.database().ref('images/' + id + "/userlike").push({
                no: account.User
            })
        }
    });
}
*/

function likeme(id) {
    var like = firebase.database().ref('images/' + id);
    var likedimages = firebase.database().ref('users/' + account.User + "/userlike");
    like.once('value').then(function(snapshot) {
        likedimages.once('value').then(function(snapshot1) {
            var data = snapshot.val();
            var almost = snapshot1.val();
            for (i in almost) {
                console.log(i);
            }
            var likes = (data.like + 1);
            like.update({
                'like': likes
            });
            $("#" + id + " .likes").eq(0).text(likes);
            var why = snapshot.val().key;
            firebase.database().ref('users/' + account.User + "/userlike").push({
                imageliked: why
            })
        })
    });
}

$("#cancel").click(function() {
    $('.upload').animate({
        marginLeft: '-=520px'}, 500
    )
    click = false;
})

$('#plus').click(function() {
    if (click == false) {
        $('.upload').animate({
            marginLeft: '+=520px'}, 500
        )
        click = true;
    }
})
