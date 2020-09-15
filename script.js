
// Path of the API
var path_API = `https://retry-unige.herokuapp.com/`;
//var path_API = `http://172.23.32.225/`

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
    for (var word of allWords) {
        full_tab += `<tr>`;
        full_tab += `<td><input type="checkbox" class="checkbox" id="check_${word}" name="interest" value="${word}"></td>`;
        full_tab += `<td><label for="${word}"> ${word} </label></td>`;
        full_tab += `<td><button class="flag" id="flag_${word}" value="${word}"><i class="fa fa-flag"></i></button></td>`;
        full_tab += `</tr>`;
    }
    $('#div_tab').append(full_tab);

    $('#imElem').attr("src", fin["path"]);          // Source de l'image a affiché
    flaggedWords = [];                              // Empty the list, for the newt task

    return fin
}

$(document).on('change', '.checkbox', function() {
    flagged_word = $(this).attr("value");
    if(this.checked) {
        if (jQuery.inArray(flagged_word, flaggedWords) != -1)  // Check if the word is not already flagged
        {
         var index = flaggedWords.indexOf(flagged_word);
         flaggedWords.splice(index, 1);
         $("#flag_"+flagged_word).css("background-color", "white");
        }
    }
    else {
     console.log('case décochée :' + flagged_word);
    }
});



// Function that, when we click on the flag, add the flagged word into a  list
$(document).on("click", ".flag", function () {
 flagged_word = $(this).attr("value");
 if (jQuery.inArray(flagged_word, flaggedWords) == -1)  // Check if the word is not already flagged
  {
   flaggedWords.push($(this).attr("value"));
   $(this).css("background-color", "red");
   $("#check_"+flagged_word).prop( "checked", true );
   console.log("#check_"+flagged_word);
  }
 else {
  var index = flaggedWords.indexOf(flagged_word);
  flaggedWords.splice(index, 1);
  $(this).css("background-color", "white");
 }
 console.debug(flaggedWords);
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
  
    var aNewWords = [];
 
    for (i = 0; i < textfield.length; i++) { 
     aNewWords.push(textfield[i].value);
    }
 
    console.debug(aNewWords);

    var entry = {
        name: name_im,
        selwords: selectedWords,
        flagwords: flaggedWords,
        newwords : aNewWords,
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



var count = 0;

// Add text field
$("#newRow").on("click", ".addRow", function () {
   $('.plus').last().removeClass("fa-plus-circle");
   $('.plus').last().addClass("fa-times-circle");

   $('.changeRow').last().removeClass("btn-info");
   $('.changeRow').last().addClass("btn-danger");
   $('.changeRow').last().addClass("deleteRow");
   $('.changeRow').last().removeClass("addRow");

   count++;
     var html = '<br id="brs'+count.toString()+'">';

   html += '<input id="field'+count.toString()+'" type="text" class="newVal" , placeholder="other name">';
     html += '<button id="but_plus'+count.toString()+'" type="button" class="btn-info button1 addRow changeRow"><i class="fa fa-plus-circle plus"></i></button>';
     $('#newRow').append(html);
 });
  
// Delete text field
$("#newRow").on("click", ".deleteRow", function () {
    var numItems = $(this);
   var id_val = numItems.attr('id');
   var num = id_val[id_val.length - 1];
   var class_val = "#field" + num;
   var br_val = "#brs" + num;
   //$(class_val).remove();
   //$(this).remove();
   $(this).fadeOut( "slow" );
   $(class_val).fadeOut( "slow" );
   //$(".brs").last().remove();
   $(br_val).fadeOut( "slow" );

    console.debug('delete Row ' + class_val);
});
