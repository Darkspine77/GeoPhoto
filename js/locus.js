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

var storageRef = firebase.storage().ref();
var click = false;

function upload() {
    coords = [];
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
        var name = account.User;
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
                    'image': img
                });
                loadImages()
            });
            $('.upload').animate({
                marginLeft: '-=520px'}, 520
            )
            click = false;
            $('#name').val("");
            $('#geo').val("");
            $('#file1').val("");
            $('#file2').val("");
            console.log("Image uploaded")
        } else {
            $('#input').text('You must upload an image.');
        }
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

function clean() {
    coords = [];
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
    loadImages()      
}

$(document).ready(function() {
    coords = []
    navigator.geolocation.getCurrentPosition(function(position){
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        coords.push(lat);
        coords.push(lon);
        var geocoder = new google.maps.Geocoder;
        loadImages()    
    });
})

function loadImages(){
    $('.locus').text('');
    firebase.database().ref('/images/').once('value', function(d) {
        for(i in d.val()){
            var c = d.val()[i]
            withinLat = c.coords[0] < (lat + .00723) && c.coords[0] > (lat - .00723);
            withinLon = c.coords[1] < (lon + .00723) && c.coords[1] > (lon - .00723);
            if(withinLat && withinLon) {
                $(".locus").prepend(
                    '<div class="photo"><div class="info"><h2 class="user">' + c.name + '|' + c.locus +
                    '</h2></div><div class="center"><img src="' + c.image + '" class="width"/></div></div>'
                );
            }
        }
    })    
}
