//@ts-check

import { ref, db, onValue, set, push, remove } from './firebase.js';

let snap;
let couldBeRemoved;

jQuery(() =>{
    onValue(ref(db, "/books"), (snapshot) => {
        snap = snapshot;
    })
});

let search = () =>
{
    $("#found").html("");
    let books = snap.val();
    if($("#searchingFor").val() == "")
    {    
        $("#found").append($("<p>Search field can't be empty.</p>"));
        $("#found").show();
        return;
    }

    else if(books == null)
    {
        $("#found").append($("<p>Database is empty. Please <strong>add book</strong> or <strong>talk to the databse admin</strong> if you think there is a problem.</p>"));
        $("#found").show();
        return;
    }
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
            let button = $("<button onclick='removeBook()' id='removeBook'>Remove this book</button>");
            
            name.text("Name: " + book[1].name);
            description.text("description: " + book[1].description);
            author.text("Author: " + book[1].author);
            something.text("Something: " + book[1].something);
            couldBeRemoved = book[0];

            $("#found").append(name, author, something, description, button);
            $("#found").show();

            $("#searchingFor").val("");

            return;
        }
    }

    $("#found").append($("<p>Couldn't find this book. If you think it is there, Please contact with the database admin.</p>"))
    $("#found").show();
    return;
}

let removeBook = () =>
{
    let answer = confirm("Selected book will be permanently removed");
    if(answer)
    {
        remove(ref(db, "/books/" + couldBeRemoved));
        $("#found").hide();
    }
}
//@ts-ignore
window.search = search;
//@ts-ignore
window.removeBook = removeBook;