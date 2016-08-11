function likeme(id) {
    var like = firebase.database().ref('images/-' + id + '/like').val()
    firebase.database().ref('images/-' + id).set({
        'like': like + 1
    })
    console.log("clicked worked bithc")
}
