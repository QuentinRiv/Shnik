
// Path of the API
var path_API = `https://retry-unige.herokuapp.com/`;

// Variable often used for fetching data
var allWords = [];

// Variables for the user infos
var email = '';
var id = '';
var fullname = '';

// Get info about the user (email, id, fullname)
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
    flaggedWords = [];                              // Empty the list, for the newt task

    return fin
}


// Function that, when we click on the flag, add the flagged word into a  list
$(document).on("click", ".flag", function () {
    flaggedWords.push($(this).attr("value"));
});


// For when we confirm the choices of selected words
function submit_entry() {
    var selectedWords = [];
    for (var value of allWords) {
        var button = document.getElementById(value);
        if (button.checked) {
            selectedWords.push(button.value)
        }
    }
    var textfield = document.getElementsByClassName("newVal");
 
    for (i = 0; i < textfield.length; i++) { 
     console.debug(textfield[i].value);
    }

    var entry = {
        name: name_im,
        selwords: selectedWords,
        flagwords: flaggedWords,
        newwords : '',
        user_data : email+','+id.toString()+','+fullname
    };


    fetch(path_API + 'addDB', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
        .then(function (response) {
            if (response.status !== 200) {    // Error handling
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

    return entry      // If no mistake, we can return
}


// Delete a word from the database
function delete_word() {
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


    fetch(path_API + 'delete', {
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
