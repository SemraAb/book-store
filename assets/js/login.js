import { ref, onValue, db } from './firebase.js'

// let signedIn = !(window.sessionStorage.getItem("admin") == null);

let pass;
let user;

onValue(ref(db, "/admin"), (snapshot) => {
    let data = snapshot.val();

    if (data != undefined)
    {
        pass = data.password;
        user = data.username;
    }

    else{
        console.log("Else:", data);
    }
});

let login = () =>
{
    let userEntered = $("#username").val().trim();
    let passEntered = $("#password").val().trim();

    console.log("user:", user, "password", pass);
    console.log("userentered:", userEntered, "password entered:", passEntered);
    if(user == userEntered)
    {
        if(pass == passEntered)
        {
            console.log("Welcome");
            window.sessionStorage.setItem("loggedin", true);
            window.location.replace("../../admin.html")
        }

        else
        {
            alert("Password is incorrect");
        }
    }
    else
    {
        alert("Username is incorrect");
    }
}

window.login = login;