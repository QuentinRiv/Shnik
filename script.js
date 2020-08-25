

var path = `https://retry-unige.herokuapp.com/image/`;
var path_display = `https://retry-unige.herokuapp.com/display/`;
var fetch_path = `https://retry-unige.herokuapp.com/`;


var allWords = [];

var email = '';
var id = '';
var fullname = '';

 $.ajax({
type: "GET",
url: "/account/profile",
contentType: "application/json",
dataType: "json",
success: function(data) {
  console.debug(data.user.id);
  email = data.user.email_addr;
  id = data.user.id;
  fullname = data.user.name;
  console.debug('email : ' + email);
  console.debug('fullname : ' + fullname);
},
error: function (xhr, textStatus, errorThrown) {
  console.log(xhr.responseText);
}
});

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
    allWords = fin['words'];
    //$('#div_tab').append(`<table class="thetab" style="margin: 0 auto; border:1px solid;text-align:center">`)
    var full_tab = ``;
    $('#div_tab').empty();
    for (var value of allWords) {
        full_tab += `<tr>`;
        full_tab += `<td><input type="checkbox" id="${value}" name="interest" value="${value}"></td>`;
        full_tab += `<td><label for="${value}">${value}</label></td>`;
        full_tab += `<td><button class="flag" value="${value}"><i class="fa fa-flag"></i></button></td>`;
        full_tab += `</tr>`;
    }
    $('#div_tab').append(full_tab);

    $('#imElem').attr("src", fin["path"]);          // Source de l'image a affiché
    flaggedWords = [];

    return fin
}


async function show_ip() {
    path = `http://retry-unige.herokuapp.com/get_my_ip`;
    var ipdata = await getUserAsync(path);
    console.debug(ipdata);
}



// Fonction qui, quand on appuie sur le drapeau, rajoute le mot flaggé dans une liste
$(document).on("click", ".flag", function () {
    flaggedWords.push($(this).attr("value"));
});


// Pour quand on confirme les choix de mots sélectionnés
function submit_message() {
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

    return entry
}


function delete_message() {
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



