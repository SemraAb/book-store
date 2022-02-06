//@ts-check

import { ref, db, onValue, remove } from './firebase.js';

let snap;
let couldBeRemoved = [];
let found = false;

jQuery(() =>{
    onValue(ref(db, "/books"), (snapshot) => {
        snap = snapshot;
    })
});

let search = () =>
{
    $("#found").empty();
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
        if(book[1].name.toLowerCase() == searchedFor.toLowerCase())
        {
            let author = $("<p>");
            let description = $("<p>");
            let name = $("<p>");
            let something = $("<p>");
            let pubDate = $("<p>");
            
            name.text("Name: " + book[1].name);
            description.text("description: " + book[1].description);
            author.text("Author: " + book[1].author);
            something.text("Something: " + book[1].something);
            pubDate.text("Publish date: " + book[1].publishDate);
            couldBeRemoved.push(book[0]);

            $("#found").append(name, author, something, description, pubDate, $("<hr>"));
            $("#found").show();

            $("#searchingFor").val("");
            found = true;

        }
    }

    if(found)
    {
        let removeButton = $("<button onclick='removeBook()' id='removeBook'>Remove this book</button>");
        // let closeButton = $("<button class='ms-3' onclick='close()' id='close'>Close</button>");
        $("#found").append(removeButton);
    }
    else{
        $("#found").append($("<p>Couldn't find this book. If you think it is there, please contact with the database admin.</p>"))
        $("#found").show();
        return;
    }

}

// function close()
// {
//     console.log("Closing");
//     $("#found").empty();
//     $("#found").hide();
// }

let removeBook = () =>
{
    let message;
    if(couldBeRemoved.length > 1)
    {
        message = couldBeRemoved.length + " books will be removed permanently. Continue?";
    }
    else{
        message = "Selected book will be permanently removed";
    }
    let answer = confirm(message);
    if(answer)
    {
        for(let book of couldBeRemoved)
        {
            remove(ref(db, "/books/" + book));
        }
        $("#found").hide();
    }
}
//@ts-ignore
window.search = search;

//@ts-ignore
window.removeBook = removeBook;

//@ts-ignore
window.close = close;