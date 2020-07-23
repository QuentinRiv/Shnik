
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
    //$('#div_tab').append(`<table class="thetab" style="margin: 0 auto; border:1px solid;text-align:center">`)
    var full_tab = ``;
    $('#div_tab').empty();
    for (var value of allWords) {
//         $('#div_tab').append(`<tr>`);
//         $('#div_tab').append(`<td><td>salut</td>`);
        
        //$('#div_tab').append(`<tr><td><input type="checkbox" id="${value}" name="interest" value="${value}"></td></tr>`)    // Rajoute checkbox
        //$('#div_tab').append(`<th><label for="${value}">${value}</label></th>`)                              // Associe le nom
        //$('#div_tab').append(`<th><button class="flag" value="${value}"><i class="fa fa-flag"></i></button></th>`) // Met le bouton principal
//         $('#div_tab').append(`</tr>`)
        full_tab += `<tr>`;
        full_tab += `<td><input type="checkbox" id="${value}" name="interest" value="${value}"></td>`;
        full_tab += `<td><label for="${value}">${value}</label></td>`;
        full_tab += `<td><button class="flag" value="${value}"><i class="fa fa-flag"></i></button></td>`;
        full_tab += `</tr>`;
    }
    $('#div_tab').append(full_tab);
    //$('#div_tab').append(`</table>`)
    console.debug('Modif 3');
    $('#imElem').attr("src", fin["path"]);          // Source de l'image a affiché
    flaggedWords = [];

    //console.debug(getUserAsync(`http://retry-unige.herokuapp.com/get_my_ip`));

    return fin
}


async function show_ip() {
    path = `http://retry-unige.herokuapp.com/tester`;
    var ipdata = await getUserAsync(path);
    console.debug(ipdata);
}

show_ip();

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


