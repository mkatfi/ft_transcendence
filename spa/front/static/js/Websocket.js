
import globalData from "./tools.js";
import { notificationHtml } from "./utils.js";
import { clone_messageOther ,getProfileById} from "../js/tools.js";


const WebSocketManager = {
    socketMap : new Map(),
    addSocket(id,url,onmessageHandel){
        if (this.socketMap.has(id)) {
            console.log("this id is already exisit \n ");
            return ; 
        }
        const socket = new WebSocket(url);
        socket.onopen = () =>{
            console.log(`%c  Socket ${id} is open.`,'color: blue; font-size: 16px;');
            if (id === "chat-socket") 
                socket.send( JSON.stringify({ type: 'start', user_id : globalData.currentView.payload.user_id})); 
        } 
        socket.onmessage = onmessageHandel;
        socket.onclose = () => console.log(`Socket ${id} is closed.`);
        socket.onerror = (error) => console.error(`Socket ${id} error:`, error);
        this.socketMap.set(id, socket);
    },
    sendMessage(id,message){
        const socket = this.socketMap.get(id);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.error(`Cannot send message, WebSocket ${id} is not open.`);
        }
    },
    closeSocket(id){
        const socket = this.socketMap.get(id);
        if (socket) {
            socket.close();
            this.socketMap.delete(id);
        }
        else {
            console.log(`socket ${id} not exist `)
        }
    },
    closeAllSockets(){
        this.socketMap.forEach((socket,id)=>{
            socket.close();
            console.log(`socket ${id} is closed`);
        });
        this.socketMap.clear();
    }
}

export default WebSocketManager;


const markMessageAsRead = (receivedData) => {
    receivedData.all_unread_msgs--;
    debugger;
    WebSocketManager.socketMap.get("chat-socket").send(JSON.stringify({
        user_id: globalData.currentView.payload.user_id,
        type: "msg_isRead",
        msg_id: receivedData.msg_id
    
    }));
};

const appendMessageToChat = (receivedData, conver_chat_) => {
    const avatar = getProfileById(receivedData.sender_id).avatar;
    conver_chat_.appendChild(clone_messageOther(receivedData.msg_text, avatar));
    conver_chat_.scrollTop = conver_chat_.scrollHeight;
};

const updateChatSelection = (senderId) => {
    globalData.currentView.removeChatSelect(senderId);
    globalData.currentView.createSelectChats(getProfileById(senderId), 0, true);
};

// Handle message reception in chat
const handleChatMessage = (receivedData) => {
    const convheader = document.querySelector(".chat-box-header");
    const conver_chat_ = document.querySelector(".conversation-chat");
    if (convheader) {
        const currentOtherId = convheader.dataset.id;
        if (receivedData.sender_id === currentOtherId) {
            markMessageAsRead(receivedData);
            appendMessageToChat(receivedData, conver_chat_);
            updateChatSelection(receivedData.sender_id);
        }
    }
};

//Notification Of new messages 
function removeMessageNotification(prentelement){
    if(prentelement)
        prentelement.remove();
}
function alertNewMessage({sender_id,msg_text}){
    let profile = getProfileById(sender_id);
    let msgtmp = document.querySelector(".recieve-chat-message-tmp");
    let _clone = msgtmp.content.cloneNode(true);
    let messageHolder =   document.querySelector(`.message-holder`);
    let img = _clone.querySelector("img");
    let username_ = _clone.querySelector(".wasla-name");
    let message_ = _clone.querySelector(".wasla-status p");
    let cancelbtn = _clone.querySelector(".wasla-meta");
    let prentelement = _clone.querySelector(".wh-container");

    img.src = profile.avatar;
    username_.innerHTML = profile.user.username;
    message_.innerText = msg_text;

    cancelbtn.addEventListener("click", () => removeMessageNotification(prentelement));
    
    messageHolder.append(_clone);
}

// Update unread messages count for the sender in the UI
const updateUnreadMessages = (receivedData) => {
    const element = document.querySelector(`[data-select_id="${receivedData.sender_id}"]`);
    if (element) {
        const unreadMessagesElement = element.querySelector(".number-messages");
        unreadMessagesElement.innerHTML = receivedData.unread_msgs;
        unreadMessagesElement.style.display = "block";
    }
};

// Update total unread messages count in the UI
const updateTotalUnreadMessages = (totalUnread) => {
    document.querySelector(".all-number-msg").innerHTML = totalUnread;
};

export const listenForMessage = (event)=>{
    let receivedData;
    receivedData = JSON.parse(event.data);
    console.log('Parsed data:', receivedData);
    if (globalData.inChatPage)  {
        handleChatMessage(receivedData);
        updateChatSelection(receivedData.sender_id);
        updateUnreadMessages(receivedData);
    }
    alertNewMessage(receivedData);
    updateTotalUnreadMessages(receivedData.all_unread_msgs);
}


export const  lisenForNotifications  = (e)=> {
    let data ;
    let notfBell;
    notfBell = document.querySelector(".notif-nums");
    console.log("socket on message \n\n")
    data = JSON.parse(e.data);
    if (notfBell)
        notfBell.innerHTML = data.size_notf;
    notificationHtml(data);
}