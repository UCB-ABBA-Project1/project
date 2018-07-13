var petApiKey = '6ca77f8d1b56fdd653755579c78a336d';
var petApiSecret = '65bb1fcddf5de94b4da39e27c387bf5e';

var mapApiKey = '1BYwMmUp5rI9OVgRVumVUiBrUG3u8IKl';

var petQueryString = '';

var mapQueryString = '';

var resetPetQueryString = function () {
    petQueryString = 'https://api.petfinder.com/pet.find?key=' + petApiKey;
    petQueryString += '&format=json';
}

var resetMapQueryString = function () {
    mapQueryString = 'https://www.mapquestapi.com/staticmap/v5/map?key=' + mapApiKey;
    mapQueryString += '&locations=';
}

resetPetQueryString();

resetMapQueryString();

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

    var usedAddresses = [];

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

        var petIndex = 1;

        var petElements = [];

        var prevGroupDiv = '';

        var prevAddress = '';

        var pets = response.petfinder.pets.pet;

        if (pets.length == undefined) {
            var temppet = pets;
            pets = [];
            pets.push(temppet);
        }

        pets.forEach(pet => {
            $("#map").html('');

            var groupDiv = $("<div>");
            groupDiv.addClass("location-group");

            var petDiv = $("<div>");
            petDiv.addClass("pet-result");

            var imgDiv = $("<div>");
            imgDiv.addClass("Pet-Pic");

            var petImg = $("<img>");

            if (pet.media.photos && pet.media.photos.photo) {
                var photosArray = pet.media.photos.photo;
                photosArray.forEach(image => {
                    if (image["@size"] == "x") {
                        petImg.attr("src", image.$t);
                    }
                });
                imgDiv.append(petImg);
                petDiv.append(imgDiv);
            }

            var petInfo = $("<div>");
            petInfo.addClass("Pet-Info");

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

            petInfo.append(petTxt);

            petDiv.append(petInfo);

            var petAddress = pet.contact
            if (petAddress.city.$t !== undefined && petAddress.state.$t !== undefined && petAddress.zip.$t !== undefined) {
                var addressStr = petAddress.city.$t + ',' +
                    petAddress.state.$t + ' ' + petAddress.zip.$t;

                if (petAddress.address1.$t !== undefined) addressStr = petAddress.address1.$t + ' ' + addressStr;

                //if (!addresses.includes(addressStr)) addresses.push(addressStr);
                //if (!addresses.includes(addressStr)) mapQueryString += addressStr + '|marker-' + petIndex + '||';
                if (addressStr !== prevAddress) {
                    mapQueryString += addressStr + '|marker-' + petIndex + '||';

                    if (prevGroupDiv !== '') $("#results").append(prevGroupDiv);

                    var groupTitle = $("<h3>");
                    groupTitle.text(petIndex + ": " + addressStr);
                    groupDiv.append(groupTitle);

                    groupDiv.append(petDiv);
                    //addresses.push(addressStr);

                    prevGroupDiv = groupDiv;

                    prevAddress = addressStr;

                    petIndex++;
                } else {
                    prevGroupDiv.append(petDiv);
                }
            } else {
                var noLocTitle = $("<h3>");
                noLocTitle.text("No location");
                groupDiv.append(noLocTitle);

                groupDiv.append(petDiv);
                $("#results").append(groupDiv);
            }
            //$("#results").append(petDiv);
            petElements.push(petDiv);
        });

        mapQueryString = mapQueryString.slice(0, -2);

        var realMapStr = '';

        for (var i = 0; i < mapQueryString.length; i++) {
            if (mapQueryString[i] == ' ') {
                realMapStr += '+';
            } else {
                realMapStr += mapQueryString[i];
            }
        }

        var mapImg = $("<img>");
        mapImg.attr("src", realMapStr);
        mapImg.attr("id", "map-img");

        $("#map").append(mapImg);

        resetPetQueryString();

        resetMapQueryString();

        prevGroupDiv = '';

        prevAddress = '';
    })
})