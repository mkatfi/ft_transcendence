

export function createSocketConnection() {

    let socket = null;
    const accessToken = localStorage.getItem('access_token');

    var loc = window.location;
    var wsStart = 'ws://';
    if (loc.protocol == 'https:') {
        wsStart = 'wss://'
    }
    var endpoint = wsStart + loc.host ;
    if (accessToken) {
        socket = new WebSocket(`${endpoint}/ws/status/?token=${accessToken}`); // Adjust the URL as neede

        socket.onmessage = function(event) {
            console.log('WebSocket message received:', event);
        };

        socket.onclose = function(event) {



            console.log('**************************\n\n\n\n\n\n\n socket for status is closed \n\n\n\n\n\n**************************');
        };

        socket.onerror = function(event) {
            console.error('WebSocket error observed:', event);
        };

        return socket ;
    } else {
        console.error('No access token found, cannot create WebSocket connection.');
    }
}

export function closeSocketConnection() {
    if (socket) {
        console.log("logout and colose socket x') ")
        socket.close();
        socket = null;
    }
}





export function closeNotificationSocket() {
    if (notf_socket) {
        console.log("logout and colose socket x') ")
        notf_socket.close();
        notf_socket = null;
    }
}



export function creatNotificationSocket(urlpath) {

    let notf_socket = null;

    const accessToken = localStorage.getItem('access_token');

    var loc = window.location;
    var wsStart = 'ws://';
    if (loc.protocol == 'https:') {
        wsStart = 'wss://'
    }
    var endpoint = wsStart + loc.host ;
    if (accessToken) {
        notf_socket = new WebSocket(`${endpoint}/ws/notf/?token=${accessToken}`); // Adjust the URL as needed

        notf_socket.onclose = function(event) {
            console.log('WebSocket is closed now.');
        };

        notf_socket.onerror = function(event) {
            console.error('WebSocket error observed:', event);
        };

        return notf_socket;
    } else {
        console.error('No access token found, cannot create WebSocket connection.');
    }
}


export function  getMyUser(){
    try {
      let access_token = localStorage.getItem('access_token');
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

    const accessToken = localStorage.getItem('access_token');

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
    
    constructor (){
      
    }

    showDialog(msg,callback) {

        const dlg = document.querySelector(".dlg-container");
        let dlgmsg = dlg.querySelector(".dlg-message");

        this.msg = msg;
        this.call = callback;
        dlgmsg.textContent = this.msg;
        dlg.style.display = "block";
        document.querySelector(".freez-all").style.display = "";

    }

    ok()
    {
        this.call();
        this.close()
        
    }
    close(){
        const dlg = document.querySelector(".dlg-container");

        dlg.style.display = "none";
        document.querySelector(".freez-all").style.display = "none";

    }

}



export function messageHandling(type,description) {
    

    let template_msg = document.querySelector(`#message-${type}-template`);
          
    let clonemsg = template_msg.content.cloneNode(true);
    clonemsg.querySelector(".hold-msg-content ").innerHTML =  `      <p> ${type} </p>
                                                        <p> ${description}</p>
                                                `;
    let messageHolder =   document.querySelector(`.message-holder`);
    messageHolder.appendChild(clonemsg)
    setTimeout(() => {
        messageHolder.firstElementChild.remove();
    }, 10000);
}