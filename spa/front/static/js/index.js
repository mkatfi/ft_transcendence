import  {router}   from "./router.js";
import {CostumConfigDialog,creatChatSocket,getMyUser, notificationHtml} from "./utils.js";
import { clone_messageOther ,getProfileById,getCookie,CheckTokenExpire,SetCookie, setLoader} from "../js/tools.js";
import WebSocketManager from "./Websocket.js";
import { listenForMessage ,lisenForNotifications} from "./Websocket.js";
import globalData from "../js/tools.js";
window.dialog = new CostumConfigDialog();


export function establishSocket(){
    const accessToken = getCookie('access_token');
    let loc = window.location;
    let wsStart = 'ws://';
    if (loc.protocol == 'https:') {
        wsStart = 'wss://'
    }
    let endpoint = wsStart + loc.host ;
    WebSocketManager.addSocket("chat-socket",`${endpoint}/ws/chat/`,listenForMessage);
    WebSocketManager.addSocket("notf-socket",`${endpoint}/ws/notf/?token=${accessToken}`,lisenForNotifications);
    WebSocketManager.addSocket("status-socket",`${endpoint}/ws/status/?token=${accessToken}`,);
}

export const navigateTo = url => {
    history.pushState(null ,null,url);
    router();
}

window.addEventListener("DOMContentLoaded",e=>{
    setLoader(0);
})

window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded",()=>{
document.body.addEventListener("click", e => {
    const linkElement = e.target.closest("[data-link]");
    if (linkElement) {
        e.preventDefault();
        const href = linkElement.getAttribute('href');
        if (href) {
            navigateTo(href);
        }
    }
});
    router();
})

 export const refreshAccessToken = async () => {
    const refreshToken = getCookie("refresh_token");
    const response = await fetch('/api/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await response.json();
    if (response.ok) {
        SetCookie("access_token",data.access)
    } else {
        WebSocketManager.closeAllSockets();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        SetCookie("access_token",null);
        SetCookie("refresh_token",null);
        navigateTo('/login');
    }
};


async function checkAfterRefreshToken(){
    const retryResponse = await fetch(`/api/protected/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('access_token')}`,
        },
    });
    if (retryResponse.ok) {
        console.log("Token refreshed and retry successful.");
        return true;
    } else {
  
        WebSocketManager.closeAllSockets();
        SetCookie("access_token",null);
        SetCookie("refresh_token",null);
        console.error("Failed to refresh token and retry.", retryResponse);
        navigateTo("/login");
        return false;
    }
}
export async   function tokenIsValid() {
    const accessToken = getCookie('access_token');
    if(!accessToken)
    {
        navigateTo("/login"); 
        return false;
    }
    const response = await fetch(`/api/protected/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('access_token')}`,
        },
    });
    if (response.ok) {
        console.log("Token is valid.");
        return true;
    } else {
        console.warn("Token is invalid. Attempting to refresh.");
        await refreshAccessToken();
        return await checkAfterRefreshToken();
    }
};



window.addEventListener('beforeunload', () => {
    WebSocketManager.closeAllSockets();
});

// FETCH PROTECETD DATA TO TEST TOKEN-----------------------------------------------