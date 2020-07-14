id = '2'

var path = "";
var fetch_path = "";
// id = Math.floor(Math.random() * 5).toString();
var path_display = "";

console.debug("********");

local = false
if (local) {
    path = `test/`;
    path_display = 'display/';
    fetch_path = `${window.origin}` + '/';
}
else {
    path = `https://retry-unige.herokuapp.com/test/`;
    path_display = `https://retry-unige.herokuapp.com/display/`;
    fetch_path = `https://retry-unige.herokuapp.com/`;
}

var allWords = [];

async function getUserAsync(path) {
    let response = await fetch(path, {
        // fetch(`https://retry-unige.herokuapp.com/addDB`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        })
    })
    let data = await response.json();
    return data;
}


async function prepareWords(path) {
    var fin = await getUserAsync(path);
    var allWords = fin['words'];
    $('#container').append(`<table>`)
    for (var value of allWords) {
        $('#container').append(`<tr>`)
        $('#container').append(`<td><input type="checkbox" id="${value}" name="interest" value="${value}"></td>`)    // Rajoute checkbox
        $('#container').append(`<td><label for="${value}">${value}</label></td>`)                              // Associe le nom
        $('#container').append(`<td><button class="flag" value="${value}"><i class="fa fa-flag"></i></button></td>`) // Met le bouton principal
        // $('#container').append(`<br>`);
        $('#container').append(`</tr>`)
    }
    $('#container').append(`</table>`)
    $('#imElem').attr("src", fin["path"]);          // Source de l'image a affiché
    flaggedWords = [];
    console.debug(fin["path"]);

    

    return fin
}






// prepareWords(path);



// Fonction qui, quand on appuie sur le drapeau, rajoute le mot flaggé dans une liste
$(document).on("click", ".flag", function () {
    flaggedWords.push($(this).attr("value"));
});


// Pour quand on confirme les choix de mots sélectionnés
async function submit_message() {
    
    console.debug("In Submit");
    console.debug('Nom dans submit_message :');
    console.debug(path + name_im);
    var result = await getUserAsync(path + name_im);
    allWords = result["words"];
    var selectedWords = [];
    for (var value of allWords) {
        var button = document.getElementById(value);
        if (button.checked) {
            selectedWords.push(button.value)
        }
    }
    var textfield = document.getElementById("autre_valeur");

    var entry = {
        name: name_im,
        selwords: selectedWords,
        flagwords: flaggedWords,
        newwords : textfield.value
    };


    fetch(fetch_path + 'addDB', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
        .then(function (response) {
            if (response.status !== 200) {
                console.log(`Looks like there was a problem. Status code: ${response.status}`);
                return;
            }
            response.json().then(function (data) {
                console.log(data);
            });
        })
        .catch(function (error) {
            console.log("Fetch error: " + error);
        });

}


async function delete_message() {
    console.debug('Nom dans delete_message :');
    console.debug(path + name_im);
    var result = await getUserAsync(path + name_im);

    allWords = result["words"];
    //console.debug('Tous les mots :');
    console.debug(allWords);
    var selectedWords = [];

    for (var value of allWords) {
        var button = document.getElementById(value);
        alert(button.checked);
        if (button.checked) {
            selectedWords.push(button.value)
            alert('oui :' + button.value);
        }
    }
    alert(selectedWords);

    var entry = {
        name: name_im,
        selwords: selectedWords,
    };

    fetch(fetch_path + 'delete', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
        .then(function (response) {
            console.log('Response:', response)
            if (response.status !== 200) {
                console.log(`Looks like there was a problem. Status code: ${response.status}`);
                return;
            }
            response.json().then(function (data) {
                console.log(data);
            });
        })
        .catch(function (error) {
            console.log("Fetch error: " + error);
        });

}


