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

//database.on('value',function(dataRow){
//  //getting raw values
//  var row = dataRow.val();
//  //adding to the div
//  console.log(row);

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    var email = profile.getEmail().split('@');
    $("#username").val(email[0]);
    $("#password").val(profile.getId());
    firebase.database().ref('users/' + $("#username").val()).on('value', function(snapshot) {
        if(snapshot.val() == null){
            signup();
        }
            login();
        });
};

function signup(){
    var Username = $("#username").val();
    var Password = $("#password").val();
    firebase.database().ref('users/' + Username).set({
        'Username': Username,
        'Password': Password
    });
}

function login(){
    var Username = $("#username").val();
    var Password = $("#password").val();
    if(Username != "" || Password != "") {
        var passCheck = null
        firebase.database().ref('users/' + Username).on('value', function(snapshot) {
            if(snapshot.val() != null){
                passCheck = snapshot.val().Password
            } else {
                $('#alert').text("An account has not been made with that user name");
            }
        });
    } else {
        $('#alert').text("Please Enter Something In Both Fields");
    }
    if(passCheck = Password && passCheck != null){
           var account = {
             User: Username,
             Pass: Password
           };
           console.log(account)
           //converts to JSON string the Object
           account = JSON.stringify(account);
           //creates a base-64 encoded ASCII string
           account = btoa(account);
           //save the encoded accout to web storage
           localStorage.setItem('_account', account);
            document.location.href = "feed.html";

    }
}

var stuff = ["pictures/img1.jpg", "pictures/img2.jpg", "pictures/img3.jpg", "pictures/img4.jpg", "pictures/img5.jpg", "pictures/img6.jpg"];
var counter = 0;

var pleasework = setInterval(function() {
    if (counter > (stuff.length - 1) ) {
        counter = 0;
    }
    $("body").css("background-image",'url(' + stuff[counter] + ')');

    counter++;
}, 3000);




