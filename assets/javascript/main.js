var petApiKey = '6ca77f8d1b56fdd653755579c78a336d';
var petApiSecret = '65bb1fcddf5de94b4da39e27c387bf5e';

var queryString = '';

var resetQueryString = function () {
    queryString = 'https://api.petfinder.com/pet.find?key=' + petApiKey;
    queryString += '&format=json'
}

resetQueryString();

jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

$('button[type=submit]').on("click", function (event) {
    event.preventDefault();

    var type = $('#animalType').val().trim();
    var age = $('#ageType').val().trim();
    var sex = $('#sexType').val().trim();
    var zip = $('#inputZip').val().trim();

    if (type !== 'Choose...') queryString += '&animal=' + type;
    if (age !== 'Choose...') queryString += '&age=' + age;
    if (sex !== 'Choose...') {
        if (sex == 'Male') {
            sex = 'M';
        } else {
            sex = 'F';
        }
        queryString += '&sex=' + sex;
    }
    if (zip !== '') queryString += '&location=' + zip;

    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function (response) {
        $("#results").html("");

        var pets = response.petfinder.pets.pet;
        pets.forEach(pet => {
            var petDiv = $("<div>");
            petDiv.addClass("pet-result");

            var imgDiv = $("<img>");
            var photosArray = pet.media.photos.photo;
            photosArray.forEach(image => {
                if (image["@size"] == "x") {
                    imgDiv.attr("src", image.$t);
                }
            });
            petDiv.append(imgDiv);

            var name = $("<h4>");
            name.text(pet.name.$t);
            petDiv.append(name);

            var breed = $("<p>");
            breed.text("Breed: " + pet.breeds.breed.$t);
            petDiv.append(breed);

            var gender = $("<p>");
            gender.text("Gender: " + pet.sex.$t);
            petDiv.append(gender);

            var ageType = $("<p>");
            ageType.text("Age: " + pet.age.$t);
            petDiv.append(ageType);

            var description = $("<p>");
            description.text(pet.description.$t);
            petDiv.append(description);

            var phone = $("<p>");
            phone.text("Phone contact: " + pet.contact.phone.$t);
            petDiv.append(phone);

            $("#results").append(petDiv);

            resetQueryString();
        });
    })
})