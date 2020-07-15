
var path = "";
var fetch_path = "";
// id = Math.floor(Math.random() * 5).toString();
var path_display = "";

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
    console.debug('all words :');
    console.debug(allWords);
    //$('#div_tab').append(`<table class="thetab" style="margin: 0 auto; border:1px solid;text-align:center">`)
    for (var value of allWords) {
        console.debug('avant tr')
        $('#div_tab').append(`<tr>`)
        console.debug('après tr')
        $('#div_tab').append(`<th><input type="checkbox" id="${value}" name="interest" value="${value}"></th>`)    // Rajoute checkbox
        $('#div_tab').append(`<th><label for="${value}">${value}</label></th>`)                              // Associe le nom
        $('#div_tab').append(`<th><button class="flag" value="${value}"><i class="fa fa-flag"></i></button></th>`) // Met le bouton principal
        $('#div_tab').append(`</tr>`)
    }
    //$('#div_tab').append(`</table>`)
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
    var result = await getUserAsync(path + name_im);

    allWords = result["words"];
    var selectedWords = [];

    for (var value of allWords) {
        var button = document.getElementById(value);
        if (button.checked) {
            selectedWords.push(button.value)
        }
    }

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


