//@ts-check

import { ref, db, onValue, set, push, remove } from './firebase.js';

let snap;

jQuery(() =>{
    onValue(ref(db, "/books"), (snapshot) => {
        snap = snapshot;
    })
});

let search = () =>
{
    $("#found").html("");
    let books = snap.val();
    let bookIds = Object.entries(books);
    let searchedFor = $("#searchingFor").val();
    
    for(let book of bookIds)
    {
        if(book[1].name == searchedFor)
        {
            let author = $("<p>");
            let description = $("<p>");
            let name = $("<p>");
            let something = $("<p>");
            let ID = $("<p id='bookId'>");
            let button = $("<button onclick='removeBook()' id='removeBook'>Remove this book</button>");
            
            name.text("Name: " + book[1].name);
            description.text("description: " + book[1].description);
            author.text("Author: " + book[1].author);
            something.text("Something: " + book[1].something);
            ID.text("ID: " + book[0]);

            $("#found").append(name, author, something, description, ID, button);
            $("#found").show();

            $("#searchingFor").val("");
        }
    }
}

let removeBook = () =>
{
    let answer = confirm("Selected book will be permanently removed");
    if(answer)
    {
        let book = $("#bookId").text().split(":")[1].trim();
        remove(ref(db, "/books/" + book));
        $("#found").hide();
    }
}
//@ts-ignore
window.search = search;
//@ts-ignore
window.removeBook = removeBook;