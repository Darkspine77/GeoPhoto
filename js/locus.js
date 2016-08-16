var lat;
var lon;
var coords = [];
var location;
var area;

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

account = localStorage.getItem('_account');
if(account == null){
    document.location.href = "index.html";
}
localStorage.removeItem('_account');
account = atob(account);
account = JSON.parse(account);

function locator() {
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
                }
            });
        }
    });
}

locator();

var storageRef = firebase.storage().ref();
var click = false;

function upload() {
    var name = account.User;
    var like = 0;
    if($('#file2').val() != ""){
        var file = document.getElementById("file2").files[0];
        var ranId = guid();
        // We can use the 'name' property on the File API to get our file name
        var uploadTask = storageRef.child('images/' + ranId + file.name).put(file);
        uploadTask.on('state_changed', function(snapshot){
        }, function(error) {
        }, function() {
            var img = uploadTask.snapshot.downloadURL;
            firebase.database().ref('images/').push({
                'name': name,
                'locus': area,
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

function likeme(id) {
    var liked = false;
    firebase.database().ref('images/' + id).on('value', function(snapshot) {
        firebase.database().ref('users/' + account.User + "/userlike").on('value', function(snapshot1) {
            var data = snapshot.val();
            var almost = snapshot1.val();
            for (i in almost) {
                if (i == id) {
                    liked = true;
                }
            }
            if (liked == false) {
                var likes = (data.like + 1);
                firebase.database().ref('images/' + id).update({
                    'like': likes
                });
                $("#" + id + " .likes").eq(0).text(likes);
                firebase.database().ref('users/' + account.User + "/userlike/" + id).push({blank: id});
            } else if (liked) {
                var likes = (data.like - 1);
                firebase.database().ref('images/' + id).update({
                    'like': likes
                });
                $("#" + id + " .likes").eq(0).text(likes);
                firebase.database().ref('users/' + account.User + "/userlike/" + id).remove();
            }
        })
    });
    clean();
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

function clean() {
    $('.locus').text('');
    locator();
    firebase.database().ref('/images').on('value', function(a) {
        var b = a.val();
        console.log(b);
        for (k in b) {
            firebase.database().ref('/images/' + k).on('value', function(d) {
                var c = d.val();
                withinLat = c.coords[0] < (lat + .00723) && c.coords[0] > (lat - .00723);
                withinLon = c.coords[1] < (lon + .00723) && c.coords[1] > (lon - .00723);
                if(withinLat && withinLon) {
                    $(".locus").prepend(
                        '<div id="' + d.key + '" class="photo"><div class="info"><h2 class="user">' + c.name + '|' + c.locus +
                        '</h2><button type="button" name="button" class="button" onclick="likeme(' + "'" + d.key + "'" +
                        ')">like</button><h2 class="likes">' + c.like +
                        '</h2></div><div class="center"><img src="' + c.image + '" class="width"/></div></div>'
        	        );
                }
    		})
    	}
    })
}

clean();

firebase.database().ref('/images').on('child_added', function(asdf) {
    $('.locus').text('');
    locator();
    firebase.database().ref('/images').on('value', function(a) {
        var b = a.val();
        console.log(b);
        for (k in b) {
            firebase.database().ref('/images/' + k).on('value', function(d) {
                var c = d.val();
                withinLat = c.coords[0] < (lat + .00723) && c.coords[0] > (lat - .00723);
                withinLon = c.coords[1] < (lon + .00723) && c.coords[1] > (lon - .00723);
                if(withinLat && withinLon) {
                    $(".locus").prepend(
                        '<div id="' + d.key + '" class="photo"><div class="info"><h2 class="user">' + c.name + '|' + c.locus +
                        '</h2><button type="button" name="button" class="button" onclick="likeme(' + "'" + d.key + "'" +
                        ')">like</button><h2 class="likes">' + c.like +
                        '</h2></div><div class="center"><img src="' + c.image + '" class="width"/></div></div>'
        	        );
                }
    		})
    	}
    })
});
