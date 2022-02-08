//@ts-check

import { ref, db, set, push, onValue, remove } from './firebase.js';

/**
 * Checks if the user logged in in the current session
 * if not: redirects the user to the login page
 */

let loggedIn = !(window.sessionStorage.getItem("loggedin") == null);

if(!loggedIn)
{
    window.location.replace("../../login.html");
}

let logout = () =>
{
    window.sessionStorage.clear();
    window.location.replace("../../login.html");
}

/**
 * Adds book to the database
 */
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
        $("#pubDate").val("");
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

/**
 * Changes about part of the store in firebase
 */
let changeAbout = () =>
{
    let header = $("#aboutHeader").val();
    let url = $("#bookImageUrl").val();
    let about = $("#aboutBody").val();

    set(ref(db, "/about"), {
        header,
        url,
        about
    });

    $("#aboutHeader").val("");
    $("#aboutBody").val("");
    $("#bookImageUrl").val("");
}

/**
 * Searching part of the admin page
 */

let snap;
let couldBeRemoved = [];
let found = false;

jQuery(() =>{
    onValue(ref(db, "/books"), (snapshot) => {
        snap = snapshot;
    });
});

let search = () =>
{
    found = false;
    $("#found").html("");
    let books = snap.val();
    console.log(books);
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

    // @type: string
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
        // $("#found").empty();
        let removeButton = $("<button onclick='removeBook()' id='removeBook'>Remove this book</button>");
        // let closeButton = $("<button class='ms-3' onclick='close()' id='close'>Close</button>");
        $("#found").append(removeButton);
    }
    else{
        while(couldBeRemoved.length != 0)
        {
            couldBeRemoved.pop();
        }
        $("#found").empty();
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
        message = "Selected book will be permanently removed. Continue?";
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



/**
 * onValue method for join.html file
 */

// # 	Full Name 	Address 	Email Address 	Phone Number


onValue(ref(db, "/joinedUsers"), (snapshot) => {
    let data = snapshot.val();
    let num = 1;
    $("#table-body").empty();
    for(let user of Object.entries(data))
    {
        let tr = $("<tr>");
        let head = $("<th scope='row'>" + num + "</th>");
        let td1 = $("<td>" + user[1].fullName + "</td>");
        let td2 = $("<td>" + user[1].email + "</td>");

        tr.append(head, td1, td2);
        $("#table-body").append(tr);
        num++;
    }
});


/**
 * onValue method for contact.html file
 */

onValue(ref(db, "/contact"), (snapshot) => {
    let data = snapshot.val();
    let num = 1;
    $("#contact-table").empty();
    for(let user of Object.entries(data))
    {
        let tr = $("<tr>");
        let head = $("<th scope='row'>" + num + "</th>");
        let td1 = $("<td>" + user[1].fullName + "</td>");
        let td2 = $("<td>" + user[1].address + "</td>");
        let td3 = $("<td>" + user[1].email + "</td>");
        let td4 = $("<td>" + user[1].phone + "</td>");

        tr.append(head, td1, td2, td3, td4);
        $("#contact-table").append(tr);
        num++;
    }
});

//@ts-ignore
window.logout = logout;

//@ts-ignore
window.changeAbout = changeAbout;

//@ts-ignore
window.removeBook = removeBook;

//@ts-ignore
window.search = search;     