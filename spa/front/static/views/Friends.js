import AbstractView from "../js/AbstractView.js";
import { createUserClone, fetchWithAuth, handleResponse } from "../js/friendsTool.js";
import { navigateTo, tokenIsValid } from "../js/index.js";
import { getCookie } from "../js/tools.js";

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
  const headernav = await this.getHeader();
  let  texthtml = headernav +`<div class="content_frined">
  
  <h1>Friends Suggestions</h1>
  <div class="send-request-friend  send-request  friends-page scrool-friend d-grid m-0 gap-2 ">
  </div>
  <hr>
  <h1 class="position-relative">Friends</h1>
  <div class="scrool-friend   friends-page d-grid m-0 gap-2 dletefriendevent ">
  </div>       
  <hr>
  <h1>Invitations</h1>
  <div class="scrool-invitations  accept-delete-request"  id="1" >
  <div class="invitations">
  </div>
  </div>  
  <hr>
  </div>  `;
return texthtml;
}


shouldAddUser(pr) {
  return pr.user.id !== this.payload.user_id && 
    !this.myprofile.friends.some(e => e.username === pr.user.username);
}
getUserStatusClass(pr) {
  let reqsend = this.mysendreq.find(e => e.receiver.username === pr.user.username);
  let reqrecive = this.friendsreq.find(e => e.sender.username === pr.user.username);
  let reqId = null;
  let classStat = '';

  if (reqsend) {
    reqId = reqsend.id;
    classStat = `<a class="deletef text-center btn"><i class="fa-solid fa-user-xmark"></i></a>`;
  } else if (reqrecive) {
    reqId = reqrecive.id;
    classStat = `<a class="acceptf text-center btn"><i class="fas fa-check"></i></a>`;
  } else {
    classStat = `<a class="addf text-center btn"><i class="fa-solid fa-user-plus"></i></a>`;
  }

  return { classStat, reqId };
}





appendUserClone(prClone) {
  let send_request = document.querySelector(".send-request");
  send_request.append(prClone);
}

addCloneUser(pr){
  if(this.shouldAddUser(pr)){
    const { classStat, reqId } = this.getUserStatusClass(pr);
    const prClone = createUserClone(pr, classStat, reqId);
    this.appendUserClone(prClone);
  }

}
allUserHtml(){
this.profiles.forEach(pr =>{
 this.addCloneUser(pr);
})
}
getProfileById(id) {
  return this.profiles.find(profile => profile.user.id === id);
}

cloneFriendInUser(friend){
  let status = "";
  let temp;
  let friendClone;
  let addfriendList = document.querySelector(".dletefriendevent");
  temp = document.querySelector(".friends-list-template");
    if (this.getProfileById(friend.id).is_online) 
      status = `active_frind`;
  else 
      status = `not-active_frind`;
  friendClone = temp.content.cloneNode(true);
  friendClone.querySelector(".txt-c h4").innerHTML =friend.username;
  friendClone.querySelector(".txt-c img").src = this.getProfileById(friend.id).avatar;
  friendClone.querySelector(".deletefriend").idTargetUser = friend.id;
  friendClone.querySelector(".go-profile").idTargetUser = friend.id;
  friendClone.querySelector(".status-frind").classList.toggle(status);
  friendClone.querySelector(".status-frind div").classList.toggle(`${status}_1`);
  addfriendList.append(friendClone);
}

allUserFriendsList(){
let profile; 
profile = this.getProfileById(this.payload.user_id);
profile.friends.forEach(friend => {
 this.cloneFriendInUser(friend);

});

}
allFriendRequestHtml(){
  let freqClone ;
  let invite = document.querySelector(".invitations");
  let temp = document.querySelector(".invitations-template");
  this.friendsreq.forEach(freq =>{
    freqClone = temp.content.cloneNode(true);
    freqClone.querySelector("img").src = freq.sender.profile.avatar;
    freqClone.querySelector(".deletef").idTargetReq=freq.id;
    freqClone.querySelector(".acceptf").idTargetReq=freq.id;
    invite.append(freqClone);
  })
}
async sendRequestFriend(e){
    const id = e.currentTarget.idTargetUser;
    if (!id){
      messageHandling("error", "Failed to remove friend: Invalid ID.");
      return;
    }
    try {
      const response = await fetchWithAuth(`/api/addfriend/${id}/`);
      await handleResponse(response);
      navigateTo("/friends");
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  }

async acceptRequestFriend(e){
  const id =    e.currentTarget.idTargetReq;
  if (!id){
    messageHandling("error", "Failed to remove friend: Invalid ID.");
    return;
  }
  try {
    const response = await fetchWithAuth(`api/acceptfriend/${id}/`);
    await handleResponse(response);
    navigateTo("/friends");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    messageHandling("error","Failed to accept friend request:");
  }

}

async deleteRequestFriend(e){
  const id = e.currentTarget.idTargetReq;
  if (!id){
    messageHandling("error", "Failed to remove friend: Invalid ID.");
    return;
  }
  try {
    const response = await fetchWithAuth(`api/acceptfriend/${id}/`, 'DELETE');
    await handleResponse(response);
    navigateTo("/friends");
  } catch (error) {
    console.error("Failed to delete friend request:", error);
  }
}


  async afterRender() {
    this.allUserFriendsList();
    this.allUserHtml();
    this.allFriendRequestHtml();
    document.querySelectorAll(".addf").forEach(element=>{
      element.addEventListener("click",e=>{ this.sendRequestFriend(e) });
    })
    document.querySelectorAll(".acceptf").forEach(element=>{
      element.addEventListener("click", e =>{this.acceptRequestFriend(e)});
    })
    document.querySelectorAll(".deletef").forEach(element=>{
      element.addEventListener("click",e=>(this.deleteRequestFriend(e)));
    });
      document.querySelector(".dletefriendevent").addEventListener("click", (e) => {
      if (e.target.classList.contains("deletefriend")) {
        this.deleteFriendSure(e);
      }
    });
  }
  removeFriendFromMyprofile(id){
    this.myprofile.friends = this.myprofile.friends.filter(friend => friend.id !== id);
  }
  async deleteFriend(deletefriend){
    const id = deletefriend.idTargetUser;
    try {
      const response = await fetchWithAuth(`/api/deletefriend/${id}/`, 'DELETE');
      const responseData = await handleResponse(response);
      const parentElement = deletefriend.closest('.dletefriendevent');
     this.removeFriendFromMyprofile(id)
      if (parentElement) parentElement.remove();
      this.addCloneUser(this.getProfileById(id));

    } catch (error) {
      console.error("Failed to delete friend:", error);
    }
  }
  async deleteFriendSure(e){
    const deletefriend = e.target;
    if (!deletefriend) {
      return ; 
    } 
    dialog.showDialog("Sure you want to remove this friend ?", ()=> {this.deleteFriend(deletefriend)}  );
  }
}