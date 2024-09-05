// AbstractView.js

import { creatNotificationSocket,CostumConfigDialog, messageHandling ,base64UrlDecode} from "../js/utils.js";

import { navigateTo } from "./index.js";
import globalData from "./tools.js";
export default class AbstractView {
    constructor() {

        this.data = null;
        this.payload = null;
        this.profiles = null;
        this.friendsreq = null;
        this.mysendreq = null;
        this.pageTitle = null;
        this.myprofile = null;
        this.notifications =null;
        console.log("AbstractView constructor called");
        localStorage.setItem("tourn",0);
        globalData.inChatPage = false;
        this.number_msgs = 0;
    }
  
    setTitle(title) {
        document.title = title;
    }


    async getHead(){
        return "";
    }
    async getHtml() {
        return "";
    }

    afterRender() {
        // console.log("nothing after render \n\n\n");
    }

    async setPayload(){
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
          this.payload = JSON.parse(base64UrlDecode(parts[1]));
          // console.log("payload",this.payload);
          } catch (error) {
              console.error('An err or occurred:', error);
              // messageHandling("error",error)
              // navigateTo("/login")
          }
      }


      async getSidebar(){
        const activeLink = [
          {name:"HOME" ,active:"active"},
          {name:"GAMES",active:""},
          {name:"PROFILE",active:""},
          {name:"TOURNAMENT",active:""},
          {name:"FRIENDS",active:""}, 
          {name:"LEADERBOARD",active:""},
          {name:"SETTINGS",active:""},
        ]
        activeLink.forEach(element => {
          
          if (element.name === this.pageTitle)
            element.active = "active";
          else
            element.active = "";
        })
        activeLink.map(element => console.log(`${element.name}  : ${element.active}`));

        
        return `   
    <input type="checkbox" id="hamburger" class="hamburger-input">
    <label for="hamburger" class="hamburger-label">
        <span></span>
        <span></span>
        <span></span>
    </label>
   <div class="sidebar">
        <div class="display-t"> <span>  ${this.pageTitle}</span></div>
        <ul>
            <li data-link >
            <a class=" ${activeLink[0].active} d-flex  p-3 align-items-center fs-5   rounded-2  ms-3 "  href="/home" data-link>
              <i data-link class="fa-solid fa-house  fa-fw"></i>
            </a>
        </li>
          <li    data-link >
            <a id="game_buttun" class=" ${activeLink[1].active}  d-flex  p-3 align-items-center fs-5  rounded-2  ms-3 " data-link href="/games" >
              <i data-link class="fa-solid fa-gamepad fa-fw"></i>
            </a>
          </li>
          <li data-link >
            <a class=" ${activeLink[2].active}   d-flex  p-3 align-items-center fs-5  rounded-2  ms-3  " data-link href="/profile" >
              <i data-link class="fa-solid fa-user  fa-fw"></i>
            </a>
          </li>
          <li data-link >
              <a class="  ${activeLink[3].active}   d-flex  p-3 align-items-center fs-5  rounded-2  ms-3  " data-link  href="/tournament" >
                  <i data-link class="fa-solid fa-trophy fa-fw"></i>
            </a>
        </li>
          <li data-link >
            <a class=" ${activeLink[4].active}   d-flex  p-3 align-items-center fs-5 rounded-2  ms-3  "  href="/friends" >
              <i data-link class="fa-solid fa-user-group fa-fw"></i>
            </a>
          </li>
      
          <li data-link >
            <a class=" ${activeLink[5].active}   d-flex  p-3 align-items-center fs-5 rounded-2  ms-3  "  href="/leaderboard" >
              <i data-link class="fa-solid fa-ranking-star"></i>
            </a>
          </li>
      
          <li data-link >
            <a class=" ${activeLink[6].active}   d-flex  p-3 align-items-center fs-5 rounded-2  ms-3  " href="/settings" >
              <i data-link class="fa-solid fa-gear"></i>
            </a>
          </li>
        </ul>

          <div    class="position-absolute bottom-0 start-50 translate-middle-x mb-3  dlg-btn" data-msgtxt="sure you want to logout ?" data-url="/logout" >
          <button type="button" class="btn btn-secondary   ">
           <a   > <i class="fa-solid fa-right-from-bracket"></i></a></button>
           </div>
      </div>
           
          `

      }
      
      async setData() {
        try {
          let access_token = localStorage.getItem('access_token');
      
          const response = await fetch(`/api/profile/${this.payload.user_id}/`, {
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
          this.data  = responseData;
      
          // console.log('Profile data:', responseData);
          // console.log('here  data:\n\n\n\n', this.data);
      
        } catch (error) {
          console.error('An error occurred:', error);
          messageHandling("error",error)
          navigateTo("/login")
        }
      }
      

      async setDataProfiles() {
        try {
          let access_token = localStorage.getItem('access_token');
      
          const response = await fetch(`/api/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch profiles');
          }
          
          const responseData = await response.json();
          this.profiles  = responseData;
          globalData.profiles = responseData;
          // console.log('Profile data:', responseData);
          // console.log('here  profiles:\n\n\n\n', this.profiles);
          
        } catch (error) {
          messageHandling("error",error)
          console.error('An error occurred:', error);
          // messageHandling("error",error)
          // navigateTo("/login")
        }
      }

      async setDataFriendRequest() {
        try {
          let access_token = localStorage.getItem('access_token');
      
          const response = await fetch(`/api/frequest/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch friendsrequest');
          }
      
          const responseData = await response.json();
          this.friendsreq  = responseData.ireceive;
          this.mysendreq = responseData.isend    //.map(reqsended => reqsended.username);
          
          // console.log('friendsrequest data:', responseData);
          // console.log('here  friendsrequest:\n\n\n\n', Array.from(this.friendsreq));
          // console.log('here  sednfriendsrequest:\n\n\n\n', Array.from(this.mysendreq));
      
        } catch (error) {
          console.error('An error occurred:', error);
          // messageHandling("error",error)
          // navigateTo("/login")
        }
      }


      async notficationAfterRender(){
        console.log("socket value      \n\n:  ",window.socketnotification);
        // if (window.socketnotification && window.socketnotification.readyState === WebSocket.OPEN) {
        //   console.log('WebSocket is already open');
        //   return;
        // }
        if (window.socketnotification) 
          {
            window.socketnotification.onmessage =  (e) =>{

            console.log("socket on message \n\n")
            const data = JSON.parse(e.data);
            console.log("data form socket notifcation \n\n",data)
            let template_msg = document.querySelector(`#message-request-template`);
          
            let clonemsg = template_msg.content.cloneNode(true);
            clonemsg.querySelector(".hold-msg-content ").innerHTML =  `     <img src="${data.avatar}" alt=""> 

            <p><i class="fa-solid fa-triangle-exclamation"></i> ${data.message}</p>   
             <a href="/friends" data-link>
             <i class="fas fa-arrow-right" data-link></i>
            </a>
                                                        `;
            let messageHolder =   document.querySelector(`.message-holder`);
            messageHolder.appendChild(clonemsg)
            setTimeout(() => {
                messageHolder.firstElementChild.remove();
            }, 10000);

        };
    
          window.socketnotification.onclose = function (e) {
            console.error('notfication socket closed unexpectedly');
          };
    
          }
          
          let notif_item =  document.querySelectorAll(".rm-notification");

          notif_item.forEach(e => {
            
            e.addEventListener("click",()=>{  if(this.removeNotification(e.dataset.id))
                                                {
                                                  e.parentElement.remove();
                                                }
            });
          })

      }
      
    async myNotifications(){

      try {
        let access_token = localStorage.getItem('access_token');
        const response = await fetch(`/api/notifications/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch notifications data');
        }
    
        const responseData = await response.json();
        this.notifications  = responseData;
    
        // console.log('notifications data:', responseData);
        // console.log('here  data:\n\n\n\n', this.notifications);
    
      } catch (error) {
        console.error('An error occurred:', error);
        // messageHandling("error",error)
        // navigateTo("/login")
      }

    }

    async searchHandle(){
      const holdserch  = document.querySelector(".cards-ser");
      const userser  = document.querySelector(".user-ser");
      let users= [];
      const search = document.querySelector(".search");
      await   this.setDataProfiles();
      users = this.profiles.map(profile =>{
      const clone = userser.cloneNode(true);
      clone.querySelector('.username-ser').textContent = profile.user.username;
      clone.querySelector('.avatar-ser img').src = profile.avatar;
      clone.href = `/profilefriend?id=${profile.user.id}`;
      clone.style.textDecoration = 'none';
      clone .style.color  = 'inherit';
      holdserch.append(clone);
      return {
        name: profile.user.username,
        avatar: profile.avatar,
        element : clone
      }
      } );
      search.addEventListener("input",e =>{
        let value = e.target.value;
          if (value.trim() === "") {
            users.forEach(user =>{
              user.element.classList.toggle("hide",1);
            })
          }
          else {
            users.forEach(user =>{
              const isvisible =  user.name.includes(value);
              user.element.classList.toggle("hide",!isvisible);
            })
          }
      })
    }
    async removeNotification(id){


   

      console.log(id);
      try {
        let access_token = localStorage.getItem('access_token');
        const response = await fetch(`/api/notif/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch notifications data');
        }
    
        const responseData = await response.json();
        console.log('notifications data:', responseData);
        console.log('here  data:\n\n\n\n', this.notifications);
        return true;
    
      } catch (error) {
        console.error('An error occurred:', error);
      }
      return false
    }

    getTime(isoTimestamp){
      const date = new Date(isoTimestamp);

// Get individual components of the date
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return(`${year}-${month}-${day} ${hours}:${minutes}`)
    }
    async notificationsHandle(){


      await this.myNotifications();
      this.linkilnotification =this.notifications.notf.reverse().map(e=>{
        // console.log(e.timestamp,"time")
        return `<li data-link><a class="dropdown-item  " href="/friends"   data-link> ${e.message}  | ${this.getTime(e.timestamp)}</a>  
        
        <button type="button" class="btn btn-danger bg-danger rm-notification"   data-id="${e.id}">
        <i class="fa fa-times"></i>
      </button>
        </li>\n`
        
      }).toString();
      // console.log("enter to notification handl \n\n\n\n");
    }


    async allMessagesNotRead(){

      try {

        const ____data = {
          user_id : this.payload.user_id,
        }
        const response = await fetch(`chat/all_unread_msgs`, {
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
        this.number_msgs = await response.json();
  
      } catch (error) {
        console.error('An error occurred:', error);
      }
      

    }

    // async getHeader()
    // {
    //     await this.notificationsHandle();
    //     await this.allMessagesNotRead();
    //     return `
    //   <header class="headbar d-flex w-100   justify-content-between  p-4   ">

    //     <div class="search position-relative">
    //        <input type="search" class="p-2  ps-5 rounded-3" placeholder="Type A Keyword">
    //        <div class="cards-ser">
    //           <a class="user-ser  hide"    data-link  >
    //              <div class="username-ser"></div>
    //              <div class="avatar-ser">
    //                 <img src="avatar1.png">
    //              </div>
    //           </a>
    //        </div>
    //     </div>

    //     <button type="button" class="btn btn-primary position-relative   bg-transparent data-link  chat-icon">
    //        <a data-link href="/chat">  <i class="fa-solid fa-message"></i></a>
    //       <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger   all-number-msg">
    //        ${this.number_msgs.all_unread_mssgs}
    //         <span class="visually-hidden">unread messages</span>
    //       </span>
    //     </button>
    //     <div class="dropdown">
    //        <button class="btn btn-primary dropdown-toggle  bg-transparent position-relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    //        <i class="fa-solid fa-bell fa-lg"></i>
    //        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    //        ${this.notifications.number}
    //        <span class="visually-hidden">unread messages</span>
    //        </span>
    //        </button>
    //        <ul class="dropdown-menu scrollable-menu  " aria-labelledby="dropdownMenuButton1">
    //           ${this.linkilnotification}
    //        </ul>
    //     </div>
        
    //     <div class="icons d-flex align-items-center  ">
    //        <img src="${this.data.avatar}" class="avatar-header   ms-3" alt="">
    //        <button type="button" class="btn btn-danger  bg-transparent  m-0 dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    //        <span class="visually-hidden">Toggle Dropdown</span>
    //        <ul class="dropdown-menu">
    //           <li><a class="dropdown-item" data-link href="/profile" >Profile</a></li>
    //           <li><a class="dropdown-item" data-link href="/settings" >Settings</a></li>
    //           <li><a class="dropdown-item" href="#">Something else here</a></li>
    //           <li>
    //              <hr class="dropdown-divider">
    //           </li>
    //           <li class="dlg-btn" data-url="/logout" data-msgtxt="sure you want to logout ?"><a class="dropdown-item "    >Logout</a></li>
    //        </ul>
    //     </div>
    //  </header>

    //   `
    //   };

    async getHeader() {
      await this.notificationsHandle();
      await this.allMessagesNotRead();
      return `
      <header class="headbar d-flex w-100 justify-content-between align-items-center p-2">
          <img class="img-fluid mt-0" src="imag_1/po.jpg" alt="Logo">
          
          <div class="search position-relative">
              <input type="search" class="p-2 ps-5 rounded-3" placeholder="Type A Keyword">
              <div class="cards-ser">
                  <a class="user-ser hide" data-link>
                      <div class="username-ser"></div>
                      <div class="avatar-ser">
                          <img src="avatar1.png" alt="User Avatar">
                      </div>
                  </a>
              </div>
          </div>
          
          <div class="icons d-flex align-items-center">
              <button type="button" class="btn btn-primary position-relative bg-transparent chat-icon me-2">
                  <a data-link href="/chat"><i class="fa-solid fa-message"></i></a>
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger all-number-msg">
                      ${this.number_msgs.all_unread_mssgs}
                      <span class="visually-hidden">unread messages</span>
                  </span>
              </button>
              
              <div class="dropdown me-3">
                  <button class="btn btn-primary dropdown-toggle bg-transparent position-relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa-solid fa-bell fa-lg"></i>
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          ${this.notifications.number}
                          <span class="visually-hidden">unread notifications</span>
                      </span>
                  </button>
                  <ul class="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenuButton1">
                      ${this.linkilnotification}
                  </ul>
              </div>
              
              <div class="user-menu dropdown">
                  <img src="${this.data.avatar}" class="avatar-header   ms-3" alt="">
                  <button type="button" class="btn btn-danger  bg-transparent  m-0 dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="visually-hidden">Toggle Dropdown</span>
                  <ul class="dropdown-menu">
                      <li><a class="dropdown-item" data-link href="/profile">Profile</a></li>
                      <li><a class="dropdown-item" data-link href="/settings">Settings</a></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li class="dlg-btn" data-url="/logout" data-msgtxt="Are you sure you want to logout?">
                          <a class="dropdown-item">Logout</a>
                      </li>
                  </ul>
              </div>
          </div>
      </header>
      `;
  }

      async afterRenderAll() {
        
        document.querySelectorAll(".dlg-btn").forEach((element)=>{
        const msg = element.dataset.msgtxt;
        const tourl = element.dataset.url;
        (element);
        element.addEventListener("click",() =>  dialog.showDialog(msg,()=>navigateTo(tourl)));
        })     
        document.querySelector(".dlg-ok").addEventListener("click",() =>  dialog.ok());
        document.querySelector(".dlg-cancel").addEventListener("click",() =>  dialog.close());
      }

}
