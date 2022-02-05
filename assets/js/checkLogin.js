//@ts-check
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

//@ts-ignore
window.logout = logout;