var petApiKey = '6ca77f8d1b56fdd653755579c78a336d';
var petApiSecret = '65bb1fcddf5de94b4da39e27c387bf5e';

var queryString = 'https://api.petfinder.com/pet.find?key=' + petApiKey;
queryString += '&format=json'

$('button[type=submit]').on("click", function (event) {
    event.preventDefault();

    var type = $('#animalType').val().trim();
    var age = $('#ageType').val().trim();
    var sex = $('#sexType').val().trim();
    var zip = $('#inputZip').val().trim();

    if (type !== '') queryString += '&animal=' + type;
    if (age !== '') queryString += '&age=' + age;
    if (sex !== '') queryString += '&sex=' + sex;
    if (zip !== '') queryString += '&location=' + zip;

    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    })
})