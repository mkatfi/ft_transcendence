import { getCookie } from "./tools.js";


export function  getMyUser(){
    try {
      let access_token = getCookie('access_token');
      // console.log("access token :",access_token);
      const parts = access_token.split('.');
      if (parts.length !== 3) {
          alert('Invalid JWT');
          return;
      }
      // console.log("--------*--------*-------")
      // console.log(parts[1]);
      let user_data = JSON.parse(base64UrlDecode(parts[1]));
      return user_data;
      // console.log("payload",this.payload);
      } catch (error) {
          console.error('An err or occurred:', error);
          // messageHandling("error",error)
          // navigateTo("/login")
      }
      return null;
  }

export function base64UrlDecode(str) {
    // Replace non-url compatible chars with base64 standard chars
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Pad out with standard base64 required padding characters
    switch (str.length % 4) {
        case 0: break; // No pad chars in this case
        case 2: str += '=='; break; // Two pad chars
        case 3: str += '='; break; // One pad char
        default: throw new Error('Invalid base64 string');
    }
    // Decode base64 string
    return atob(str);
  }

export function creatChatSocket() {

    let chat_socket = null;

    const accessToken = getCookie('access_token');

    var loc = window.location;
    var wsStart = 'ws://';
    if (loc.protocol == 'https:') {
        wsStart = 'wss://'
    }
    var endpoint = wsStart + loc.host ;
    if (accessToken) {
        chat_socket = new WebSocket(`${endpoint}/ws/chat/`); // Adjust the URL as needed

        chat_socket.onclose = function(event) {
            console.log('WebSocket chat  is closed now.');
        };

        chat_socket.onerror = function(event) {
            console.error('WebSocket error observed:', event);
        };

        return chat_socket;
    } else {
        console.error('No access token found, cannot create WebSocket connection.');
    }
}



export class CostumConfigDialog {
    
    constructor() {
        this.dlg = document.querySelector(".dlg-container");
        this.dlgmsg = this.dlg.querySelector(".dlg-message");
        this.okButton = this.dlg.querySelector(".dlg-ok");
        this.cancelButton = this.dlg.querySelector(".dlg-cancel");
        this.initEvents();  
    }

    initEvents() {
        this.okButton.addEventListener("click", () => this.ok());
        this.cancelButton.addEventListener("click", () => this.close());
    }

    showDialog(msg, callback) {
        this.msg = msg;
        this.call = callback;
        this.dlgmsg.textContent = this.msg;
        this.dlg.style.display = "block";
        document.querySelector(".freez-all").style.display = "";
    }

    ok() {
        if (typeof this.call === "function") {
            this.call();
        }
        this.close();
    }

    close() {
        this.dlg.style.display = "none";
        document.querySelector(".freez-all").style.display = "none";
    }
}



function iconNotif(type){

    if (type == "success") 
        return `<i class="me-2 text-success fs-3 fa-solid fa-circle-check"></i>`;
    else if(type == "info")
        return `<i class="me-2  text-info  fa-solid fs-3 fa-circle-info"></i>`;
    else
        return `<i class=" me-2  fs-3 text-danger  fa-solid fa-circle-xmark"></i>`;
}

export function messageHandling(type,description) {

    let template_msg = document.querySelector(`#message-${type}-template`);
    let clonemsg = template_msg.content.cloneNode(true);
    clonemsg.querySelector(".hold-msg-content ").innerHTML =  `      <p> ${iconNotif(type)} </p>
                                                        <p> ${description}</p>
                                                `;
    let messageHolder =   document.querySelector(`.message-holder`);
    messageHolder.appendChild(clonemsg);
    setTimeout(() => {
        messageHolder.firstElementChild.remove();
    }, 10000);
}


export function notificationHtml({avatar,message}) {
    let template_msg;
    let clonemsg ;
    let messageHolder;

    template_msg = document.querySelector(`#message-request-template`);
    clonemsg = template_msg.content.cloneNode(true);
    clonemsg.querySelector(".hold-msg-content ").innerHTML =  
    `     
    <img src="${avatar}" alt=""> 
    <p><i class="fa-solid fa-triangle-exclamation"></i> ${message}</p>   
    <a href="/friends" data-link>
        <i class="fas fa-arrow-right"></i>
    </a>
    `;
    messageHolder =   document.querySelector(`.message-holder`);
    messageHolder.appendChild(clonemsg)
    setTimeout(() => {
        messageHolder.firstElementChild.remove();
    }, 10000);

}