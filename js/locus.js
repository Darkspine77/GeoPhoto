var lat;
var lon;
var coords = []
var img;
var url;
var location;

account = localStorage.getItem('_account');
if(account == null){
    alert("This content is only avaliable to users who have logged in")
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
    // this the section where i tried to use the location for display but fail// here Jamal
    //url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyC73wjATYJAPLcNV5Q1P69IPZvZWXV8biE";
    //$.ajax({
    //    url: url,
    //    success: function(result) {
    //        print(result);
    //    },
    //})
    //console.log(url);
    coords.push(lat);
    coords.push(lon);
});

//function print(obj) {
//    location = obj['results'][0]['address_components'][2]['long_name'];
//}

window.onbeforeunload = function(event) {
    account = JSON.stringify(account);
    //creates a base-64 encoded ASCII string
    account = btoa(account);
    //save the encoded accout to web storage
    localStorage.setItem('_account', account);
    alert("saving")
};

var config = {
    apiKey: "AIzaSyA1n9MmgGXH8mUX8YCcpj8-tuzDW8Y3wVc",
    authDomain: "locusimg.firebaseapp.com",
    databaseURL: "https://locusimg.firebaseio.com",
    storageBucket: "locusimg.appspot.com",
};
firebase.initializeApp(config);

// Create a root reference
var storageRef = firebase.storage().ref();

var database = firebase.database().ref('images/');
var click = false;

function upload() {
    var name = account.User;
    var geo = $('#geo').val();
    if($('#file2').val() != "" || geo != ""){
        var file = document.getElementById("file2").files[0];
        // We can use the 'name' property on the File API to get our file name
        var uploadTask = storageRef.child('images/' + file.name).put(file);
        uploadTask.on('state_changed', function(snapshot){
        }, function(error) {
        }, function() {
            var img = uploadTask.snapshot.downloadURL;
            database.push({
                'name':name,
                'locus': geo,
                'coords': coords,
                'image': img,
                'like': like
            });
        });
    var like = 0;
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

database.on('child_added',function(dataRow){
	//getting raw values
  	var row = dataRow.val();
  	//adding to the div
    withinLat = row.coords[0] < (lat + .00723) && row.coords[0] > (lat - .00723);
    withinLon = row.coords[1] < (lon + .00723) && row.coords[1] > (lon - .00723);
    if(withinLon && withinLat){
        $(".locus").append(
            '<div class="photo"><div class="info"><h2 class="user">' + row.name + '|' + row.locus +
            '</h2><button type="button" name="button" class="button">like</button><h2 class="likes">' + row.like +
            '</h2></div><div class="center"><img src="' + row.image + '" class="width"/></div></div>'
        );
    }
    console.log(row);
    console.log(database);
    console.log(dataRow.parent.toString());
    console.log(row.key);
})

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
