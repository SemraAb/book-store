//@ts-check

import { ref, db, set, push, onValue, remove } from './firebase.js';

/**
 * Checks if the user logged in in the current session
 * if not: redirects the user to the login page
 */

let loggedIn = !(window.sessionStorage.getItem("loggedin") == null);

let isNew = false;

if(!loggedIn)
{
    window.location.replace("/admin/login.html");
}

let logout = () =>
{
    window.sessionStorage.clear();
    window.location.replace("/admin/login.html");
}

$("#isNew").on('click', () => {
    if (isNew)
    {
        isNew = false;
    }
    else
    {
        isNew = true;
    }
});


/**
 * Adds book type to the list
 */

$("#addType").on('click', () => {
    let type = $("#type").val();
    if(type != "")
    {
        let typePush = push(ref(db, "/categories"));
        set(typePush, {
            type
        });
    }
});


/**
 * Adds book to the database
 */
$("#addButton").on('click', () => {
    let bookBranch = ref(db, "/books");
    let bookPush = push(bookBranch);

    let name = $("#bookName").val().toString().trim(); 
    let author = $("#authorName").val().toString().trim(); 
    let imageUrl = $("#imageURL").val().toString().trim(); 
    let description = $("#description").val().toString().trim();
    let publishDate = $("#pubDate").val();

    // console.log($("#bookType").val());
    if(name != "" && author != "" && imageUrl != "" && description != "")
    {
        $("#bookName").val("");
        $("#authorName").val("");
        $("#imageURL").val("");
        $("#description").val("");
        $("#pubDate").val("");
        set(bookPush, {
            name,
            author,
            imageUrl,
            description,
            publishDate,
            isNew
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
        if(book[1].name.toLowerCase() == searchedFor)
        // if(book[1].name.toLowerCase() == searchedFor.toLowerCase())
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
 * Deletes the user that joined
 */

// let removeUser = (user) => {
//     let userId = $(user).data("id");
//     console.log("removing:", userId);
//     remove(ref(db, "/joinedUsers" + userId));
// }

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
        // let removeButton = $("<button data-id='" + user[0] + "' onclick='removeUser(this)'>Remove User</button>");

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

onValue(ref(db, "/categories"), (snapshot) => {
    let data = snapshot.val();
    for(let type of Object.entries(data))
    {
        $("#bookType").append($("<option selected value=" + type[1].type + ">" + type[1].type + "</option>"));
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

//@ts-ignore
// window.removeUser = removeUser;