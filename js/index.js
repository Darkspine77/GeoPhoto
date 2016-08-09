  // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      // Initialize Firebase
    
    var newURL = "https://picjumbo.imgix.net/DJI_0142.jpg?q=40&w=1650&sharp=30"
    var prevURL ="https://picjumbo.imgix.net/HNCK3505.jpg?q=40&w=1650&sharp=30"
    
    var config = {
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
// }
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
          document.location.href = "feed.html";
        }
    } 

          function nxtImg(){
      $(body).css("background-image",'url('+newURL);
      if (newURL == "https://picjumbo.imgix.net/DJI_0142.jpg?q=40&w=1650&sharp=30"){
        newURL = "https://picjumbo.imgix.net/HNCK3054.jpg?q=40&w=1650&sharp=30"
        prevURL = "https://picjumbo.imgix.net/HNCK3505.jpg?q=40&w=1650&sharp=30"
      }
      if (newURL == "https://picjumbo.imgix.net/HNCK3054.jpg?q=40&w=1650&sharp=30"){
        prevURL = "https://picjumbo.imgix.net/DJI_0142.jpg?q=40&w=1650&sharp=30"
      }
  }  
  function backImg(){
    $(body).css("background-image",'url('+prevURL);
    if (prevURL == "https://picjumbo.imgix.net/DJI_0142.jpg?q=40&w=1650&sharp=30"){
        prevURL = "https://picjumbo.imgix.net/HNCK3505.jpg?q=40&w=1650&sharp=30"
    if (prevURL == "https://picjumbo.imgix.net/HNCK3505.jpg?q=40&w=1650&sharp=30"){
        newURL = "https://picjumbo.imgix.net/DJI_0142.jpg?q=40&w=1650&sharp=30"
    }
    }
    
}