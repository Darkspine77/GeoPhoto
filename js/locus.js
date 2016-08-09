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
