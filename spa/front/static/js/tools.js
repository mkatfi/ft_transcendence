
let globalData ={

    profiles : null,
    data:null,
    inChatPage: false,
    currentView : null,

}
export default globalData;

export function clone_messageOther(messg,img) {
    let you_tempmsg = document.querySelector(".you-tempmsg")
    let _clone = you_tempmsg.content.cloneNode(true);
            _clone.querySelector(".you-message").innerHTML = messg;
            _clone.querySelector("img").src = img;
        return _clone;
  }
  
  export function  clone_messageCurrent(messg,img) {
    let me_tempmsg = document.querySelector(".me-tempmsg")
    let clone = me_tempmsg.content.cloneNode(true);
    clone.querySelector(".me-message").innerHTML = messg;
    clone.querySelector("img").src = img;
        return clone;
  }
  export function getProfileById(id) {
    console.log(id);
    return globalData.profiles.find(profile => profile.user.id === id);
  }