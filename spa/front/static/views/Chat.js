import AbstractView from "../js/AbstractView.js";
import globalData, { clone_messageCurrent,clone_messageOther,getProfileById,setLoader } from "../js/tools.js";

import { getDataChats,blockUserChat,getMessages,sendMessageTo, setupChatToggleButton, getProfilesHtmlClone, setupFilterListeners } from "../js/ChatTools.js";
import { chatPageHTML,chatHtml,inputHtml } from "../js/HtmlPages.js";

export default class extends AbstractView {
  constructor() {
    super();
    globalData.inChatPage = true;
    this.lastActiveid= -1;
    this.getDataChats = getDataChats.bind(this);
    this.blockUserChat = blockUserChat.bind(this);
    this.getMessages = getMessages.bind(this);
    this.sendMessageTo = sendMessageTo.bind(this);
 }
async getHtml() {
  await this.setPayload();
  await this.setData();
  await this.setDataProfiles();
  await this.getDataChats();
    const headernav = await this.getHeader();
    return headernav  + chatPageHTML;
}

removeChatSelect(id){
  const element = document.querySelector(`[data-select_id="${id}"]`);
  if (element) {
      element.remove();
  }
}

getProfileById(id) {
  return this.profiles.find(profile => profile.user.id === id);
}


renderChatBoxHeader(user,avatar) {
  const divChatBox = document.querySelector(".chat-box");
  divChatBox.innerHTML =   chatHtml;

  const chatBoxHeader = divChatBox.querySelector(".chat-box-header ");
  const userAvatar = chatBoxHeader.querySelector("img");
  const userProfileLink = chatBoxHeader.querySelector(".profile-from-chat");
  
  userAvatar.src = avatar;
  chatBoxHeader.dataset.id = user.id;
  chatBoxHeader.querySelector("h2").textContent = user.username;
  
  userProfileLink.innerHTML = `<a class="dropdown-item go-profile">Profile</a>`;
  userProfileLink.querySelector("a").addEventListener("click", (event) => {
    this.showFriendProfile(user.id);
  });
}



setupBlockUser(user, isBlocked) {
  const blockUser = document.querySelector(".chat-box-header .block-user-chat");
  
  if (!isBlocked) {
    blockUser.innerHTML = `<a class="dropdown-item">Block</a>`;
    blockUser.idforBlock = user.id;
    document.querySelector(".form-submit-messge").innerHTML = inputHtml;
  } else {
    blockUser.innerHTML = `<a class="dropdown-item">UnBlock</a>`;
    blockUser.idforBlock = user.id;
    document.querySelector(".form-submit-messge").innerHTML = "Is blocked";
  }
  blockUser.addEventListener("click", (e) => this.handleBlockUserClick(e, user));
}



handleBlockUserClick(e, user) {
  const blockid = e.currentTarget.idforBlock;
  dialog.showDialog(`Sure you want to block ${user.username}?`, async () => {
    await this.blockUserChat(blockid);
    
    if (this.isBlock.blocked) {
      document.querySelector(".chat-box-header .block-user-chat a").innerHTML = "UnBlock";
      document.querySelector(".form-submit-messge").innerHTML = `${user.username} Is blocked`;
    } else {
      document.querySelector(".chat-box-header .block-user-chat a").innerHTML = "Block";
      document.querySelector(".form-submit-messge").innerHTML = inputHtml;
    }
  });
}


renderMessages(messages, avatar) {
  const conver_chat_ = document.querySelector(".conversation-chat");

  if (messages) {
    messages.forEach(msg => {
      if (msg.receiver === this.payload.user_id) {
        conver_chat_.appendChild(clone_messageOther(msg.message,avatar));
      } else if (msg.sender === this.payload.user_id) {
        conver_chat_.appendChild(clone_messageCurrent(msg.message, this.data.avatar));
      }
    });
  }
}
updateActiveChatUser(user) {
  const element = document.querySelector(`[data-select_id="${user.id}"]`);
  const lastActive = document.querySelector(`[data-select_id="${this.lastActiveid}"]`);

  if (lastActive) {
    lastActive.classList.remove("active");
  }
  if (element) {
    element.classList.add("active");
    this.lastActiveid = user.id;
  }
}

async displayChatConversations(user_ppppp){
  setLoader(1);
  await this.getMessages(user_ppppp.user.id);
  let msgs;
  msgs = this.responseDataMsgs.msgs;

  this.renderChatBoxHeader(user_ppppp.user,user_ppppp.avatar);
  this.setupBlockUser(user_ppppp.user,this.responseDataMsgs.block);
  this.renderMessages(msgs,user_ppppp.avatar);
  this.updateActiveChatUser(user_ppppp.user);
  
  await this.allMessagesNotRead();
  document.querySelector(".all-number-msg").innerHTML = this.number_msgs.all_unread_mssgs;
  if (!this.responseDataMsgs.block)
      this.submitMessage();
  setLoader(0);
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
  const id = e.currentTarget.idTargetUser;
  await this.getMessages(id);
    if ( this.responseDataMsgs.created  ) 
      {
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
  let usersListen =  document.querySelectorAll(".contact-click");
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
    ____clone.querySelector(".chat-select-avatar").idTargetUser = e.id;
    if (user_ppp.is_online) 
      ____clone.querySelector(".chat-select-avatar").classList.add("online-status-chat");
    online_contact.appendChild(____clone);

  });
}

submitMessage(){
  let conver_chat ;
  let other_id;
  let value ;

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
// Populate chat list with the user's chat history
ChatList() {
  this.chats.forEach(chat => {
    const otherUserId = chat.user1_id !== this.payload.user_id ? chat.user1_id : chat.user2_id;
    const userProfile = this.getProfileById(otherUserId);
    this.removeChatSelect(otherUserId); // Remove if already exists
    this.createSelectChats(userProfile, chat.unread_msg); // Create new chat entry
  });
}

async afterRender() {
  setupChatToggleButton();
  document.querySelector(".chat-box").innerHTML =   ` <div class=""> <i class="fa-solid fa-comments "></i></div>  <div class="no-chat text-wlc"></div>`
  getProfilesHtmlClone(this.payload.user_id,this.profiles,".chat-search ul",".li-temp");
  setupFilterListeners();
  this.ChatList();
  this.textWriter(".text-wlc","start new chat !");
  this.onlineUsersList();
  this.listenForEvents();
  }
}