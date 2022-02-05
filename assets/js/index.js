//@ts-check

import { ref, db, onValue, set, push } from './firebase.js';

$("#addButton").on('click', () => {
    let bookBranch = ref(db, "/books");
    let bookPush = push(bookBranch);

    let name = $("#bookName").val().toString().trim().toLowerCase(); 
    let author = $("#authorName").val().toString().trim().toLowerCase(); 
    let something = $("#something").val().toString().trim().toLowerCase(); 
    let description = $("#description").val().toString().trim(); 

    if(name != "" && author != "" && something != "" && description != "")
    {
        $("#bookName").val("");
        $("#authorName").val("");
        $("#something").val("");
        $("#description").val("");
        set(bookPush, {
            name,
            author,
            something,
            description
        });
    }
    else
    {
        alert("Please fill the form correctly");
    }

});


//@ts-ignore
window.logout = logout;