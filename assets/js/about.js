//@ts-check

import { ref, db, set } from './firebase.js';

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

//@ts-ignore
window.changeAbout = changeAbout;