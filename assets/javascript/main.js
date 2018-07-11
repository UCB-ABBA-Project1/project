var petApiKey = '6ca77f8d1b56fdd653755579c78a336d';
var petApiSecret = '65bb1fcddf5de94b4da39e27c387bf5e';

var mapQApiSecret = '1BYwMmUp5rI9OVgRVumVUiBrUG3u8IKl';

var petQueryString = '';

var resetPetQueryString = function () {
    petQueryString = 'https://api.petfinder.com/pet.find?key=' + petApiKey;
    petQueryString += '&format=json'
}

resetPetQueryString();

jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

$('button[type=submit]').on("click", function (event) {
    event.preventDefault();

    var type = $('#animalType').val().trim();
    var size = $('#sizeType').val().trim();
    var age = $('#ageType').val().trim();
    var sex = $('#sexType').val().trim();
    var zip = $('#inputZip').val().trim();

    var addresses = [];

    if (type !== 'Choose...') petQueryString += '&animal=' + type;
    if (size !== 'Choose...') petQueryString += '&size=' + size;
    if (age !== 'Choose...') petQueryString += '&age=' + age;
    if (sex !== 'Choose...') {
        if (sex == 'Male') {
            sex = 'M';
        } else {
            sex = 'F';
        }
        petQueryString += '&sex=' + sex;
    }
    if (zip !== '') petQueryString += '&location=' + zip;

    $.ajax({
        url: petQueryString,
        method: "GET"
    }).then(function (response) {
        $("#results").html("");

        var pets = response.petfinder.pets.pet;
        pets.forEach(pet => {
            console.log(pet);

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

            var petTxt = $("<div>");
            petTxt.addClass("pet-text");

            var name = $("<h4>");
            name.text(pet.name.$t);
            petTxt.append(name);

            var breed = $("<p>");
            var petBreed = pet.breeds.breed.$t;
            var breedTxt = '';
            if (petBreed !== undefined) {
                breedTxt = petBreed;
            } else {
                breedTxt = 'unspecified';
            }
            breed.text("Breed: " + breedTxt);
            petTxt.append(breed);

            var gender = $("<p>");
            gender.text("Gender: " + pet.sex.$t);
            petTxt.append(gender);

            var ageType = $("<p>");
            ageType.text("Age: " + pet.age.$t);
            petTxt.append(ageType);

            var size = $("<p>");
            size.text("Size: " + pet.size.$t);
            petTxt.append(size);

            var description = $("<p>");
            description.text(pet.description.$t);
            petTxt.append(description);

            var phone = $("<p>");
            var petPhone = pet.contact.phone.$t;
            var phoneTxt = '';

            if (petPhone !== undefined) {
                phoneTxt = petPhone;
            } else {
                phoneTxt = 'unspecified';
            }
            phone.text("Phone contact: " + phoneTxt);
            petTxt.append(phone);

            petDiv.append(petTxt);

            var petAddress = pet.contact
            var addressStr = petAddress.address1.$t + ' ' + petAddress.city.$t + ', ' +
                petAddress.state.$t + ' ' + petAddress.zip.$t;

            //if (!addresses.includes(addressStr)) addresses.push(addressStr);
            addresses.push(addressStr);

            $("#results").append(petDiv);

            resetPetQueryString();
        });

        console.log(addresses);
    })
})