var config = {
    apiKey: "AIzaSyA1n9MmgGXH8mUX8YCcpj8-tuzDW8Y3wVc",
    authDomain: "locusimg.firebaseapp.com",
    databaseURL: "https://locusimg.firebaseio.com",
    storageBucket: "locusimg.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database().ref();

function onSignIn(googleUser) {
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
}

function signup(){
    var blank = "blank";
    var Username = $("#username").val();
    var Password = $("#password").val();
    if (Username.length > 8 && Password.length > 8) {
        firebase.database().ref('users/' + Username).set({
            'Username': Username,
            'Password': Password,
            'userlike': blank
        });
        firebase.database().ref('users/' + Username + '/userlike').set({
            'blank': blank
        });
        $('#alert').text("");
        login();
    } else {
        $('#alert').text("Username and Password needs to be more than 8 characters.");
    }
}

function login(){
    var Username = $("#username").val();
    var Password = $("#password").val();
    if(Username != "" && Password != "") {
        var passCheck = null
        firebase.database().ref('users/' + Username).on('value', function(snapshot) {
            if(snapshot.val() != null){
                passCheck = snapshot.val().Password;
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
                    document.location.href = "locus.html";
                }
            } else {
                $('#alert').text("Username and/or Password is incorrect.");
            }
        });
    } else {
        $('#alert').text("You didn't enter in the field(s).");
    }
}

var stuff = ["pictures/img1.jpg", "pictures/img2.jpg", "pictures/img3.jpg", "pictures/img4.jpg", "pictures/img5.jpg", "pictures/img6.jpg"];
var counter = 0;

/*
var pleasework = setInterval(function() {
    function delay(){
        $("#div1").css("background-image",'url(' + stuff[counter] + ')');
        }
        if (counter > (stuff.length - 1) ) {
        counter = 0;
        }
$("#div1").fadeOut(1500);
$("#div1").fadeIn(1500);
setTimeout(delay,1500)
counter++;
}, 5000);
var music = false;
*/

function play(){
    if (music = false){
        $('body').append('<embed src="Battle!Zinnia.mp3" autostart="false" loop="true" width="0" height="0"> </embed>')
        music = true
    }
    if (music = true){
        music = false
    }
}

function member(a) {
    if (a) {
        $("#member").css("display",'block');
        $("#notamember").css("display",'none');
        $("#signup").css("display",'block');
        $("#login").css("display",'none');
        $('#alert').text("");
    } else {
        $("#member").css("display",'none');
        $("#notamember").css("display",'block');
        $("#signup").css("display",'none');
        $("#login").css("display",'block');
        $('#alert').text("");
    }
}
