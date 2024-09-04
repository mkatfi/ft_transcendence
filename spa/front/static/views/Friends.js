import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";

import { messageHandling , CostumConfigDialog} from "../js/utils.js";
export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Friends");
    this.pageTitle= "FRIENDS";
  }

  async getHtml() {
  await this.setPayload();
  await this.setData();
  await this.setDataProfiles();
  await this.setDataFriendRequest();
  this.myprofile = await this.getProfileById(this.payload.user_id);
  console.log("freindes request ",this.friendsreq );

  const headernav = await this.getHeader();
  let  texthtml = headernav +`<div class="content_frined">`;
  texthtml += this.allUserFriendsList();
  texthtml += this.allFriendRequestHtml();
  texthtml += this.allUserHtml();
  return ` ${texthtml}</div>  `
}


async checkUesr(profile,username)
{
  
}
allUserHtml(){

  ``


  let texthtml = `
  <h1>Friends Suggestions</h1>
  <div class="send-request-friend  send-request  friends-page scrool-friend d-grid m-0 gap-2 ">`;

  let added= ``;
  
  // if (reqsend !== undefined) {
  //   added = `
  //   <div class="play-now addf" data-id="${profile.user.id}">
  //     <a class="text-center btn">
  //       <i class="fa-solid fa-user-check"></i>
  //       <span> ADDED</span>
  //     </a>
  //   </div>
  //   <div class="play-now  deletef" data-id="${reqsend.id}" >
  //     <a class="text-center btn decline"><i class="fa-solid fa-user-xmark"></i>
  //       <span> Cancel add </span></a>
  //   </div>     

  //   `         ;
  // }
  // else if (reqrecive !== undefined){
  //     added = `          <div class="play-now acceptf  " data-id="${reqrecive.id}">
  //     <a class="text-center btn" ><i class="fas fa-check"></i>
  //         <span> ACCPET</span></a>
  //     </div>`;
  // }
  // else {
  //   added = `<div class="play-now addf" data-id="${profile.user.id}">
  //         <a class="text-center btn">
  //           <i class="fa-solid fa-user-plus"></i>
  //         <span> ADD</span>
  //       </a>
  //     </div>
      
  //     `
  // }


  // <h1>Friends Suggestions</h1>
  // <div class="friends-page scrool-friend d-grid m-0 gap-2">

  // </div>

  // ${added}
  for (let profile of this.profiles) {

    if (profile.user.id != this.payload.user_id) {
      
      console.log(`ID: ${profile.user.id}`);
      console.log(`Username: ${profile.user.username}`);
      console.log('----------------------------------');
      console.log('----------------------------------',this.myprofile.friends);
      if (this.myprofile.friends.find(e => e.username === profile.user.username) === undefined) {

          let reqsend = this.mysendreq.find(e =>e.receiver.username === profile.user.username) ;
          let reqrecive = this.friendsreq.find(e => e.sender.username === profile.user.username);

        texthtml += `
        <div class="friend  rad-6 p-4 position-relative   send-request-friend ">
        <div class="contact_frind d-flex align-items-center">
          <div class="ADD  addf " data-id="${profile.user.id}" >
            <a class="text-center btn "><i class="fa-solid fa-user-plus"></i></a>
          </div>
          <div>
            <a class="text-light" data-link href="/profilefriend?id=${profile.user.id}" ><button type="submit" class="btn btn-primary">Profile</button></a>
          </div>
        </div>
        <div class="txt-c text-center">
          <img decoding="async" class="rad-half mt-2 mb-2 " src="${profile.avatar}" alt="" />
          <h4 class="m-1">${profile.user.username}</h4>
        </div>
      </div>
`;
              }
              
            }
        }
    texthtml += `</div>`;
    return texthtml;

}
getProfileById(id) {
  return this.profiles.find(profile => profile.user.id === id);
}
allUserFriendsList(){
  let texthtml = ``;
  const profile = this.getProfileById(this.payload.user_id);

if (profile) {
  console.log("PROFILE      :", profile); 
} else {
  console.log('Profile not found');
}

console.log("PROFILE     fffffffff :", profile.friends); 
let status = "";
  for (let friend of profile.friends) {
      console.log(`ID: ${friend.id}`);
      console.log(`Username: ${friend.username}`);
      console.log(`isonline: ${this.getProfileById(friend.id).is_online}`);
      console.log('----------------------------------');
      if (this.getProfileById(friend.id).is_online) 
          status = `active_frind`;
      else 
          status = `not-active_frind`;
        
          texthtml += `
          <div class="dletefriendevent  friend rad-6 p-4 position-relative">
            <div class="contact_frind d-flex align-items-center">
              <div class="status-frind ${status}" aria-label="Not Active">
                <div class="${status}_1"></div>
              </div>
            </div>
            <div class="txt-c text-center">
              <img decoding="async" class="rad-half mt-2 mb-2 " src="${this.getProfileById(friend.id).avatar}" alt="" />
              <h4 class="m-1">${friend.username}</h4>
            </div>
            <div class="icons fs-15 p-relative">
              <div class="friend-count_1 mb-10">
                <i class="fa-regular fa-face-smile fa-fw"></i>
                <span>99 Friend</span>
              </div>
              <div class="mb-10">
                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                <span>60 XP</span>
              </div>
              <div class="rating mt-10 mb-10">
                <i class="fa-solid fa-star text-warning fs-13"></i>
                <i class="fa-solid fa-star text-warning  fs-13"></i>
                <i class="fa-solid fa-star text-warning  fs-13"></i>
                <i class="fa-solid fa-star text-secondary fs-13"></i>
                <i class="fa-solid fa-star text-secondary fs-13"></i>
              </div>
            </div>
            <div class="info d-flex align-items-center justify-content-center fs-13">
              <div>
                <a class="text-center btn " data-link href="/profilefriend?id=${friend.id}" > PROFILE</a>
                <a class="text-center btn btn-danger deletefriend " data-id="${friend.id}"  >  Remove</a>
              </div>
            </div>
         </div>
`;
        }
    return `
    <h1 class="position-relative">Friends</h1>
      <div class="scrool-friend   friends-page d-grid m-0 gap-2 dletefriendevent ">
   ${texthtml} </div>       <hr>`;

}

allFriendRequestHtml(){
  let texthtml = 
  `<h1>Invitations</h1>
  <div class="scrool-invitations  accept-delete-request"  id="1" >
  <div class="Invitations">
  `;
  for (let freq of this.friendsreq) {
        texthtml += `
                <div class="request">
                    <img src="${freq.sender.profile.avatar}" alt="Sasuke">
                    <div class="request-info">
                        <div class="request-name">${freq.sender.username}</div>
                        <div class="request-time">20 hrs ago</div>
                    </div>
                    <div class="request-actions">
                    <button  class="no_accepte  deletef" data-id="${freq.id}" >✕</button>
                    <button class="accepte acceptf" data-id="${freq.id}">✓</button>
                    </div>
                </div>
        `;
    }
    texthtml += `
    </div>
    </div>  
  <hr>`;
    return texthtml;
}
async sendRequestFriend(e){
    let access_token = localStorage.getItem("access_token");
    const addf = e.target.closest(".addf"); 

    if (!addf) {
      return ;
    }
    const id =addf.dataset.id;

    try {
      const response = await fetch(`/api/addfriend/${id}/`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();
      if (response.ok)
        {
          const keyserr = Object.keys(responseData);    
          const valueerr = Object.values(responseData);  
          messageHandling(keyserr[0],valueerr[0]);
        } 
      else 
      {
        console.log("Faild to add new friend: ",responseData);
        navigateTo("/friends");
      }
    } catch (error) {
      console.log("error :",error) 
      messageHandling("error",error)
      navigateTo("/login")     
    }

  }

  async acceptRequestFriend(e){
    let access_token = localStorage.getItem("access_token");
    const acceptf = e.target.closest(".acceptf"); 
    if (!acceptf) {
      return ;
    }
    const id =    acceptf.dataset.id;
    try {
      const response = await fetch(`api/acceptfriend/${id}/`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();

      if (response.ok) {
        console.log("new friend accepted successfuly :",responseData); 
        const keyserr = Object.keys(responseData);    
        const valueerr = Object.values(responseData);  
        messageHandling(keyserr[0],valueerr[0]);
        navigateTo("/friends");       
      }
      else 
        console.log("Faild to accept new friend: ",responseData);
    } catch (error) {
      console.log("error :",error)     
      messageHandling("error",error)
      navigateTo("/login") 
    }

  }
  async deleteRequestFriend(e){
    let access_token = localStorage.getItem("access_token");

    const deletef = e.target.closest(".deletef"); 
    console.log(deletef);
    if (!deletef) {
      return ;
    }
    const id =    deletef.dataset.id;
    try {
      const response = await fetch(`api/acceptfriend/${id}/`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();
      if (response.ok) {
    console.log("new friend accepted successfuly :",responseData); 

    const keyserr = Object.keys(responseData);    
    const valueerr = Object.values(responseData);  
    messageHandling(keyserr[0],valueerr[0]);
        navigateTo("/friends");       
      }
      else 
        console.log("Faild to accept new friend: ",responseData);
    } catch (error) {
      console.log("error :",error)      
      
    }
    
  }
  async afterRender() {
    document.querySelector(".send-request").addEventListener("click",this.sendRequestFriend.bind(this));
    document.querySelector(".accept-delete-request").addEventListener("click",this.acceptRequestFriend.bind(this));
    document.querySelector(".accept-delete-request").addEventListener("click",this.deleteRequestFriend.bind(this));
    document.querySelector(".dletefriendevent").addEventListener("click",this.deleteFriendSure.bind(this));
  }

  async deleteFriend(id){
    let access_token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`/api/deletefriend/${id}/`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();
      if (response.ok) {
    console.log("new friend accepted successfuly :",responseData); 
      const keyserr = Object.keys(responseData);    
      const valueerr = Object.values(responseData);  
      messageHandling(keyserr[0],valueerr[0]);
        navigateTo("/friends");       
      }
      else 
        console.log("Faild to accept new friend: ",responseData);
    } catch (error) {
      console.log("error :",error)      
    }


  }


  async deleteFriendSure(e){
    const deletefriend = e.target.closest(".deletefriend");
    if (!deletefriend) {
      return ; 
    }
    const id = deletefriend.dataset.id;
    dialog.showDialog("Sure you want to remove this friend ?", ()=> this.deleteFriend(id));
  }
}


