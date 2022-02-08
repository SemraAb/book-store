// @ts-check

import { ref, db, set, push, onValue, remove } from '../admin/assets/js/firebase.js';

$("#sendButton").on('click', () => {
    let name = $("#name").val();
    let address = $("#address").val();
    let email = $("#email").val();
    let number = $("#number").val();
    
    if(name != "" && address != "" && email != "" && number != "")
    {
        let userPush = push(ref(db, "/contact"));
        set(userPush, {
            address,
            email,
            fullName: name,
            phone: number
        });
    }

    else{
        alert("Please fill the form correctly")
    }
});

$("#joinBookBtn").on("click", () => {
    let name = $("#joinBookFullName").val();
    let email = $("#joinBookEmail").val();

    if(name != "" && email != "")
    {
        let joinPush = push(ref(db, "/joinedUsers"));
        set(joinPush, {
            fullName: name,
            email
        });
        $("#joinBookFullName").val("");
        $("#joinBookEmail").val("");
    }
});