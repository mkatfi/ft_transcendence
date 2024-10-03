// AbstractView.js

import { messageHandling, base64UrlDecode } from "../js/utils.js";
import { getCookie, CheckTokenExpire } from "./tools.js";
import { navigateTo, establishSocket,refreshAccessToken, tokenIsValid } from "./index.js";
import globalData from "./tools.js";
import WebSocketManager from "./Websocket.js";
import { fetchDataBase, setActiveLink } from "./BaseUtils.js";
import { generateSidebarItems, headerHTML } from "./HtmlPages.js";
export default class AbstractView {
  constructor() {
    this.data = null;
    this.payload = null;
    this.profiles = null;
    this.friendsreq = null;
    this.mysendreq = null;
    this.pageTitle = null;
    this.myprofile = null;
    this.notifications = null;
    console.log("AbstractView constructor called");
    localStorage.setItem("tourn", 0);
    globalData.inChatPage = false;
    this.number_msgs = 0;
    this.access_token = getCookie("access_token");
    this.refresh_token = getCookie("refresh_token");
  }

  setTitle(title) {
    document.title = title;
  }

  async getHead() {
    return "";
  }
  async getHtml() {
    return "";
  }

  afterRender() {}

  async setPayload() {
    this.access_token = getCookie("access_token");
    if (!this.access_token) {
      this.payload = null;
      navigateTo("/login");
      return;
    }
    try {

      const parts = this.access_token.split(".");
      if (parts.length !== 3) {
        alert("Invalid JWT");
        return;
      }
      this.payload = JSON.parse(base64UrlDecode(parts[1]));
    } catch (error) {
      console.error("An err or occurred:", error);
    }
  }



  async  getSidebar() {
    const activeLink = [
        { name: "HOME", active: "active" },
        { name: "GAMES", active: "" },
        { name: "PROFILE", active: "" },
        { name: "TOURNAMENT", active: "" },
        { name: "FRIENDS", active: "" },
        { name: "LEADERBOARD", active: "" },
        { name: "SETTINGS", active: "" },
    ];
    setActiveLink(activeLink, this.pageTitle);
    const sidebarItems = generateSidebarItems(activeLink);
    return `
        <input type="checkbox" id="hamburger" class="hamburger-input">
        <label for="hamburger" class="hamburger-label">
            <span></span>
            <span></span>
            <span></span>
        </label>
        <div class="sidebar">
            <div class="display-t"><span><marquee>${this.pageTitle}</marquee></span></div>
            <ul>
                ${sidebarItems}
            </ul>
            <div class="position-absolute bottom-0 start-50 translate-middle-x mb-3 dlg-btn" data-msgtxt="sure you want to logout?" data-url="/logout">
                <button type="button" class="btn btn-secondary">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        </div>
    `;
}


async  setData() {
  try {
    this.data = await fetchDataBase(`/api/profile/${this.payload.user_id}/`);
  } catch (error) {
    messageHandling(error);
    navigateTo("/login");
  }
}

async  setDataProfiles() {
  try {
    const responseData = await fetchDataBase(`/api/profile/`);
    this.profiles = responseData;
    globalData.profiles = responseData;
  } catch (error) {
    messageHandling("error",error);
  }
}

async  setDataFriend(id_friend) {
  try {
    this.datafriend = await fetchDataBase(`/api/profile/${id_friend}/`, 'GET', null);
  } catch (error) {

    messageHandling("error",error);
  }
}

async  setDataFriendRequest() {
  try {
    const responseData = await fetchDataBase(`/api/frequest/`);
    this.friendsreq = responseData.ireceive;
    this.mysendreq = responseData.isend;
  } catch (error) {
    messageHandling("error",error);
  }
}
async  myNotifications() {
  try {
    this.notifications = await fetchDataBase(`/api/notifications/`);
  } catch (error) {
    messageHandling("error",error);
  }
}

async  removeNotification(id) {
  try {
    await fetchDataBase(`/api/notif/${id}`, 'DELETE');
    return true;
  } catch (error) {
    return false;
  }
}

async  allMessagesNotRead() {
  try {
    const data = { user_id: this.payload.user_id };
    this.number_msgs = await fetchDataBase(`chat/all_unread_msgs`, 'POST', data);
  } catch (error) {
    messageHandling("error",error);
  }
}


  async notficationAfterRender() {
    let notif_item = document.querySelectorAll(".rm-notification");
    notif_item.forEach((e) => {
      e.addEventListener("click", () => {
        if (this.removeNotification(e.dataset.id)) {
          e.parentElement.remove();
        }
      });
    });
  }

  cloneUserElement(template, profile) {
    const clone = template.cloneNode(true);
    clone.querySelector(".username-ser").textContent = profile.user.username;
    clone.querySelector(".avatar-ser img").src = profile.avatar;
    clone.idTargetUser = profile.user.id;
    clone.style.textDecoration = "none";
    clone.style.color = "inherit";
    clone.style.cursor = "pointer";
    return clone;
  }
  
  async searchHandle() {
    // debugger;
    const holdserch = document.querySelector(".cards-ser");
    const userser = document.querySelector(".user-ser");
    let users = [];
    const search = document.querySelector(".search");
    await this.setDataProfiles();
    users = this.profiles.map((profile) => {
      const clone = userser.cloneNode(true);
      clone.querySelector(".username-ser").textContent = profile.user.username;
      clone.querySelector(".avatar-ser img").src = profile.avatar;
      clone.idTargetUser = profile.user.id;
      clone.style.textDecoration = "none";
      clone.style.color = "inherit";
      clone.style.cursor = "pointer";
      holdserch.append(clone);
      return {
        name: profile.user.username,
        avatar: profile.avatar,
        element: clone,
      };
    });

    search.addEventListener("input", (e) => {
      let value = e.target.value;
      if (value.trim() === "") {
        users.forEach((user) => {
          user.element.classList.toggle("hide", 1);
        });
      } else {
        users.forEach((user) => {
          const isvisible = user.name.includes(value);
          user.element.classList.toggle("hide", !isvisible);
        });
      }
    });
  }

  getTime(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  async notificationsHandle() {
    await this.myNotifications();
    this.linkilnotification = this.notifications.notf
      .reverse()
      .map((e) => {
        return `<li data-link><a class="dropdown-item  " href="/friends"   data-link> ${e.message}  | ${this.getTime(e.timestamp)}</a> 
        <button type="button" class="btn btn-danger bg-danger rm-notification"   data-id="${e.id}">
          <i class="fa fa-times"></i> 
        </button>
        </li>\n`;
      })
      .toString();
  }


  async getHeader() {
    await this.notificationsHandle();
    await this.allMessagesNotRead();
    return headerHTML(this.number_msgs.all_unread_mssgs,this.notifications.number,this.linkilnotification,this.data.avatar);
  }



   isTokenExpired(tokenExpiresTime) {


    const currentTime = Math.floor(Date.now() / 1000); 
    const bufferTime = 2 * 60; 

    const ref = tokenExpiresTime - currentTime;
    const redf =(tokenExpiresTime - bufferTime);
    const l = currentTime >= (tokenExpiresTime - bufferTime);
    return l;
  }

  async inAuthpages() {
    // debugger;
    const checkv = await tokenIsValid();
    if(!checkv){
      return false ;
    }
    await this.setPayload();
    establishSocket();
    return true;
  }


  
  async afterRenderAll() {
    document.querySelectorAll(".dlg-btn").forEach((element) => {
      const msg = element.dataset.msgtxt;
      const tourl = element.dataset.url;
      element;
      element.addEventListener("click", () =>
        dialog.showDialog(msg, () => navigateTo(tourl))
      );
    });
  }

  async showFriendProfile(e) {
    const checkv = await tokenIsValid();
    if(!checkv){       return  ;   }
 
    await this.setDataFriend(e);
    await this.setPayload();
    await this.setData();
    const fprcontainer = document.querySelector(".freined-profile-user");
    fprcontainer.querySelector(".avatar img").src = this.datafriend.avatar;
    fprcontainer.querySelector(".user-h1").innerHTML = this.datafriend.user.username;
    fprcontainer.style.display = "block";
    document.querySelector(".freez-all").style.display = "";
    }
   

  

  async freindProfileHandle()
  {
      let allButon = document.querySelectorAll(".go-profile");
      allButon.forEach(e=>{
        e.addEventListener("click",eve=>{this.showFriendProfile(eve.currentTarget.idTargetUser)});
      });

      let buttonEx =  document.querySelector(".btn-exit");
      if (buttonEx) {
        buttonEx.addEventListener("click" ,()=>{
          document.querySelector(".freined-profile-user").style.display = "none";
          document.querySelector(".freez-all").style.display = "none";
          })
      }

  }

}
