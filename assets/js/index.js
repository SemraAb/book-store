//@ts-check

import { ref, db, set, push } from './firebase.js';

$("#addButton").on('click', () => {
    let bookBranch = ref(db, "/books");
    let bookPush = push(bookBranch);

    let name = $("#bookName").val().toString().trim(); 
    let author = $("#authorName").val().toString().trim(); 
    let something = $("#something").val().toString().trim(); 
    let description = $("#description").val().toString().trim();
    let publishDate = $("#pubDate").val();

    if(name != "" && author != "" && something != "" && description != "")
    {
        $("#bookName").val("");
        $("#authorName").val("");
        $("#something").val("");
        $("#description").val("");
        $("#publishDate").val("");
        set(bookPush, {
            name,
            author,
            something,
            description,
            publishDate
        });
    }
    else
    {
        alert("Please fill the form correctly");
    }

});

//@ts-ignore
window.logout = logout;
