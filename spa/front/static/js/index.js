import  {router}   from "./router.js";
import { createSocketConnection,creatNotificationSocket ,CostumConfigDialog,creatChatSocket,getMyUser} from "./utils.js";
import { clone_messageCurrent,clone_messageOther ,getProfileById} from "../js/tools.js";
import globalData from "../js/tools.js";
window.dialog = new CostumConfigDialog();
window.socketStatus = null;
window.socketnotification = null;
window.prevpagename = null;
window.chat_socket = null;


function listenForMessage(){
    window.chat_socket.onmessage = (event)=> {
      console.log('Message received from server: ', event.data);
      
      // Parse the received JSON data
      const receivedData = JSON.parse(event.data);
      console.log('Parsed data:', receivedData);
      let conver_chat_ = document.querySelector(".conversation-chat");
      const convheader =  document.querySelector(".chat-box-header");
      console.log(document.querySelector(".all-number-msg"));
      if (globalData.inChatPage)  {
        if (convheader) {
            const current_otherid =  convheader.dataset.id;
            if (receivedData.sender_id == current_otherid) {
                receivedData.all_unread_msgs--;
                window.chat_socket.send(JSON.stringify(
                    {
                        user_id:getMyUser().user_id,
                        type:"msg_isRead",
                        msg_id:receivedData.msg_id
                    }
                ));
                console.log("cuurent view ", globalData.currentView );
                conver_chat_.appendChild(clone_messageOther(receivedData.msg_text,getProfileById(receivedData.sender_id).avatar));
                conver_chat_.scrollTop = conver_chat_.scrollHeight;
                globalData.currentView.removeChatSelect(receivedData.sender_id);
                globalData.currentView.createSelectChats(getProfileById(receivedData.sender_id),0,true); 
                const element_ = document.querySelector(`[data-select_id="${receivedData.sender_id}"]`);   
                // console.log(element_,"{{}}");
                // element_.classList.add("active"); 
            }
        }
        globalData.currentView.removeChatSelect(receivedData.sender_id);
        globalData.currentView.createSelectChats(getProfileById(receivedData.sender_id),0,true); 


        const element = document.querySelector(`[data-select_id="${receivedData.sender_id}"]`);

        console.log(element,receivedData.unread_msgs);
        element.querySelector(".number-messages").innerHTML = receivedData.unread_msgs ;
        element.querySelector(".number-messages").style.display = "block" ;
    }
    document.querySelector(".all-number-msg").innerHTML = receivedData.all_unread_msgs;
  };
  }


function establishSocket(){

    if(!window.socketStatus)
        {
            window.socketStatus = createSocketConnection();
            window.socketStatus.onopen = function(event) {
                console.log('WebSocket status  is open now.');

            };
        }
        if(!window.socketnotification){
            window.socketnotification = creatNotificationSocket();
            window.socketnotification.onopen = function(event) {
                console.log('WebSocket of notification  is open now.');
            };
        }
        if(!window.chat_socket){
            window.chat_socket = creatChatSocket();
            window.chat_socket.onopen = function(event) {
                console.log('\n\n\n\n\nchatsocket WebSocket of notification  is open now.',getMyUser());
                console.log('\n\n\n\n\nchatsocket WebSocket of notification  is open now.',globalData.currentView.payload.user_id);
                window.chat_socket.send( JSON.stringify({ type: 'start', user_id : globalData.currentView.payload.user_id}));
        };
        listenForMessage();
        }
}

export const navigateTo = url => {
    
    
    window.prevpagename = location.pathname;
    history.pushState(null ,null,url);
    router();
}

window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded",()=>{

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]") || e.target.closest("[data-link]")) {
            e.preventDefault();
            const linkElement = e.target.closest("a");
            if (linkElement) {
                tokenIsValid(linkElement.href)
            }
        }
    });
    router();

})

 const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    // console.log("entere here ")
    const response = await fetch('/api/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();
    if (response.ok) {

        localStorage.setItem('access_token', data.access);
    } else {
        if(!window.socketStatus){
            window.socketStatus.close();
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigateTo('/login');
    }
};

const tokenIsValid = async (pathname) => {
    const accessToken = localStorage.getItem('access_token');

    if(!accessToken)
    {
        navigateTo("/login"); 
        return ;  
    }
    const response = await fetch(`/api/protected/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        console.log("Token is valid.");

       establishSocket();

        navigateTo(pathname);
    } else {
        console.warn("Token is invalid. Attempting to refresh.");
        await refreshAccessToken();
        const retryResponse = await fetch(`/api/protected/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        
        if (retryResponse.ok) {
           establishSocket();
            console.log("Token refreshed and retry successful.");
            navigateTo(pathname);
        } else {
            if(!window.socketStatus){
                window.socketStatus.close();
            }
            if(!window.socketnotification){
                window.socketnotification.close();
            }
            if(!window.chat_socket){
                window.chat_socket.close();
            }
            console.error("Failed to refresh token and retry.", retryResponse);
            navigateTo("/login");
        }
    }
};

if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
    document.addEventListener('DOMContentLoaded', tokenIsValid(location.pathname));
}



window.addEventListener('beforeunload', () => {
    window.socketStatus.send('User is leaving the page, closing the window.socketStatus.');
    window.socketStatus.close();
});

// FETCH PROTECETD DATA TO TEST TOKEN-----------------------------------------------