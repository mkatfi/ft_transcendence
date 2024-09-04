// let s_login = document.querySelector(".start-login");
// let s_sginup = document.querySelector(".start-sginup");
// let startbutt = document.querySelector(".start-button");
// let login_old = document.querySelector(".old-user");
// let login_new = document.querySelector(".new-user");


// let checkelement;
// document.addEventListener("click",function (ele) {

//     checkelement = ele.target;
//     if (checkelement.classList == "start-login") {
//         startbutt.style.display = "none";
//         login_old.style.display = "flex";
//     }
//     if (checkelement.classList == "start-sginup") {
//         startbutt.style.display = "none";
//         login_new.style.display = "flex";
//     }

//     if (checkelement.classList == "back-button") {
//         login_old.style.display = "none";
//         login_new.style.display = "none";
//         startbutt.style.display = "flex";
//     }
// });


let register_form = document.querySelectorAll("input");

register_form[1].placeholder = "Username...";
register_form[2].placeholder = "Email...";
register_form[3].placeholder = "Enter password...";
register_form[4].placeholder = "Re-enter password...";
