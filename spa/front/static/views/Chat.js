
var chatHtml = `
<div class="chat-box-header">
                <div class="chat-profile">
                <h2></h2>
                <div class="">
                    <img src="images/rem.jpg" alt="">
                </div>

                
                
                 <button type="button" class="btn btn-danger  bg-transparent  m-0 dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="visually-hidden">Toggle Dropdown</span>
                    <ul class="dropdown-menu">
                    <li class="profile-from-chat"></li>
                        <li><a class="dropdown-item" data-link href="/profile" >block</a></li>
                    </ul>
                </div>
            </div>
            <div class="conversation-chat">
            </div>
            <form class="form-submit-messge" action="">
              
                <input id="chat-message-input" name="message" type="text" size="100" placeholder="type message ..." >
                <label for="submit-message" class="submit-button-style"><i class="fa-solid fa-paper-plane"></i></label>
                <input type="submit" value="sned" id="submit-message" hidden>
            </form>`


import AbstractView from "../js/AbstractView.js";
// import { } from "../js/router.js";
import { navigateTo } from "../js/index.js";

import globalData, { clone_messageCurrent,clone_messageOther,getProfileById } from "../js/tools.js";
export default class extends AbstractView {
  constructor() {
    super();
    globalData.inChatPage = true;
    this.lastActiveid= -1;
 }

async getDataChats() {

  try {

    const ____data = {
      user_id : this.payload.user_id,
    }
    const response = await fetch(`chat/chats`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(____data)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch friendsrequest');
    }
    const responseData = await response.json();
    this.chats = responseData.chats;
    console.log("chats : \n\n\n\n",  this.chats );


  } catch (error) {
    console.error('An error occurred:', error);
  }

}

 async setDataFriend() {
  try {
    let access_token = localStorage.getItem('access_token');

    const response = await fetch(`/api/profile/${this.id_friend}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch profile data');
    }

    const responseData = await response.json();
    this.datafriend  = responseData;

    console.log('datafriend data:', responseData);
    console.log('here  datafriend:\n\n\n\n', this.datafriend);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}
  
async getHtml() {
  await this.setPayload();
  await this.setData();
  await this.setDataProfiles();
  await this.getDataChats();
    const headernav = await this.getHeader();
    return headernav  +   `     
    
    <div class="  chat-container  position-relative">
      <div class="btn-open-chat-list  position-absolute top-0 start-0">
        <i class="fa-solid fa-rectangle-list"></i>
      </div>
      <div class="contact-chat-box">
          <div class="contact-chat-box-header">
              <div class="chat-profile">
              </div>
          </div>
            <div class="online-contact">
            </div>
            <div class="chat-select-box">
              <div class="last-chat"></div>
            </div>
      </div>
        <div class="chat-box">
        </div>
    </div>`
    ;
}

// sendMessage(message) {
//   if (window.chat_socket.readyState === WebSocket.OPEN) {
//     window.chat_socket.send(message);
//   } else {
//       console.log('WebSocket is not open. Ready state: ', window.chat_socket.readyState);
//   }
// }



removeChatSelect(id){
  const element = document.querySelector(`[data-select_id="${id}"]`);
  if (element) {
      element.remove();
  }
}

getProfileById(id) {
  console.log(id);
  return this.profiles.find(profile => profile.user.id === id);
}



async displayChatConversations(user_ppppp){
  await this.getMessages(user_ppppp.user.id)
  var msgs = this.responseDataMsgs.msgs;
  document.querySelector(".chat-box").innerHTML =   chatHtml;
  document.querySelector(".chat-box  .chat-box-header img ").src = user_ppppp.avatar;
  document.querySelector(".chat-box  .chat-box-header ").dataset.id = user_ppppp.user.id;
  document.querySelector(".chat-box  .chat-box-header h2 ").innerHTML = user_ppppp.user.username;
  document.querySelector(".chat-box  .chat-box-header .profile-from-chat").innerHTML = `<a class="dropdown-item" data-link href="/profilefriend?id=${user_ppppp.user.id}"  >Profile</a>`;
  let conver_chat_ = document.querySelector(".conversation-chat");
  if (msgs) {
    msgs.forEach(e=>{
      if (e.receiver ==  this.payload.user_id) {
          conver_chat_.appendChild(clone_messageOther(e.message,user_ppppp.avatar));
      }
      else if(e.sender ==  this.payload.user_id)
      {
        conver_chat_.appendChild(clone_messageCurrent(e.message,this.data.avatar));
      }
    })
  }
  const element = document.querySelector(`[data-select_id="${user_ppppp.user.id}"]`);   
  const lastactive = document.querySelector(`[data-select_id="${this.lastActiveid}"]`);
  if (lastactive) {
    lastactive.classList.remove("active");
  }
  if (element) {
    element.classList.add("active");
    this.lastActiveid = user_ppppp.user.id;
  }
  this.submitMessage();
}

async getMessages(id){

  try {

    const ____data = {
      current_uid : this.payload.user_id,
      other_uid : id, 
    }
    const response = await fetch(`chat/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(____data)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch friendsrequest');
    }
    this.responseDataMsgs = await response.json();

  } catch (error) {
    console.error('An error occurred:', error);
  }
  
}

createSelectChats(user_ppppp,unread_msg=0,infirst=false){
  let user_select = document.querySelector(".chat-select-box");
  let temp_select_chat = document.querySelector(".select-chat-template");
  let clone_selects = temp_select_chat.content.cloneNode(true);
  clone_selects.querySelector(".select-chat").dataset.select_id = user_ppppp.user.id;
  clone_selects.querySelector("img").src = user_ppppp.avatar;
  clone_selects.querySelector("h4").innerHTML = user_ppppp.user.username;

  if (parseInt(unread_msg)) 
     clone_selects.querySelector(".number-messages").innerHTML = unread_msg;
  else 
    clone_selects.querySelector(".number-messages").style.display = "none";
  clone_selects.querySelector(".select-chat").addEventListener("click" , e=>{

    e.currentTarget.querySelector(".number-messages").style.display = "none";
    this.displayChatConversations(user_ppppp);
  })

  if (infirst) {
    user_select.insertBefore(clone_selects,user_select.firstElementChild);
  }
  else
    user_select.appendChild(clone_selects);
}

async getOrCreateChat(e){
  const id = e.target.dataset.id;
  await this.getMessages(id);
    if ( this.responseDataMsgs.created  ) 
      {
        console.log("enter here is creaaed");
        const user_ppppp = this.getProfileById(parseInt(id));
        this.removeChatSelect(id);
        this.createSelectChats(user_ppppp,0,true);
        this.displayChatConversations(user_ppppp,this.responseDataMsgs.msgs);
      }
      else {
        const user_ppppp = this.getProfileById(parseInt(id));
        this.displayChatConversations(user_ppppp,this.responseDataMsgs.msgs);
      }
}


listenForEvents(){
  var usersListen =  document.querySelectorAll(".contact-click");
  usersListen.forEach(e=>{
    e.addEventListener("click",async e=>{
        await this.getOrCreateChat(e);
    })
  })


}

onlineUsersList(){
  let online_contact  = document.querySelector(".online-contact");
  let avatar_template  = document.querySelector(".avatar-template");
  this.data.friends.forEach(e=>{
    let user_ppp = this.getProfileById(e.id);
    const ____clone = avatar_template.content.cloneNode(true);
    ____clone.querySelector("img").src = user_ppp.avatar;
    ____clone.querySelector("img").setAttribute('data-id',e.id);
    ____clone.querySelector(".chat-select-avatar").setAttribute('data-id',e.id);
    if (user_ppp.is_online) 
    {
      ____clone.querySelector(".chat-select-avatar").classList.add("online-status-chat");

    }
    online_contact.appendChild(____clone);

  });
}
async sendMessageTo(other_id,message){

  console.log("other id",other_id);
  try {

    const ____data = {
      sender_id : this.payload.user_id,
      receiver_id : parseInt(other_id),
      message :message,
    }

    console.log(____data);

    const response = await fetch(`chat/send_msg`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(____data)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch friendsrequest');
    }
    const responseData = await response.json();
    console.log(responseData);

  } catch (error) {
    console.error('An error occurred:', error);
  }

}

submitMessage(){
  let conver_chat ;
  var other_id;
  var value ;

  conver_chat = document.querySelector(".conversation-chat");
  conver_chat.scrollTop = conver_chat.scrollHeight;
  document.querySelector(".form-submit-messge").addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(event.target)
      value = formData.get("message");
      if (!value.trim()) return; 
      conver_chat.append(clone_messageCurrent(value,this.data.avatar));
      other_id = document.querySelector(".chat-box-header").dataset.id;
      this.sendMessageTo(other_id,value);
      conver_chat.scrollTop = conver_chat.scrollHeight;
      event.target.querySelector("#chat-message-input").value = "";
      this.removeChatSelect(other_id);
      this.createSelectChats(getProfileById(parseInt(other_id)),0,true);
      const element_ = document.querySelector(`[data-select_id="${other_id}"]`);   
      element_.classList.add("active");

  })
}

async textWriter(element,txt){
  let textwr = document.querySelector(element);
  for (let index = 0; index < txt.length; index++) {
    setTimeout(() => {
      textwr.innerHTML += txt[index];
    }, 100 * index);  
  }
}

async afterRender() {

  // this.listenForMessage();

  document.querySelector(".btn-open-chat-list").addEventListener("click",e=>{
    if(document.querySelector(".contact-chat-box").classList.toggle("openC"))
      e.currentTarget.innerHTML =`<i class="fa-solid fa-rectangle-xmark"></i>`;
    else
      e.currentTarget.innerHTML =`<i class="fa-solid fa-rectangle-list"></i>`;


  })


  document.querySelector(".chat-box").innerHTML =   ` <div class=""> <i class="fa-solid fa-comments "></i></div>  <div class="no-chat text-wlc"></div>`
  // document.querySelector(".contact-chat-box-header h2").innerHTML = this.data.user.username;
  this.chats.forEach(e => {
      console.log(e ,"-------------------<<<<")
    var other_userid; 
      if (e.user1_id != this.payload.user_id)
        other_userid = e.user1_id;
      else
        other_userid = e.user2_id;
    
    const userapp = this.getProfileById(other_userid);
    this.removeChatSelect(other_userid);
    this.createSelectChats(userapp,e.unread_msg);

  })    
  this.textWriter(".text-wlc","start new chat !");
  this.onlineUsersList();
  this.listenForEvents();
  }
}