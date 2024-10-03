
let globalData ={

    profiles : null,
    data:null,
    inChatPage: false,
    currentView : null,

}
export default globalData;


export function setLoader(b){
  if (b) {
    document.querySelector(".load-page").style.display = "block";
    document.querySelector(".freez-all").style.display = "block";
  }
  else{
    document.querySelector(".load-page").style.display = "none";
    document.querySelector(".freez-all").style.display = "none";
  }

}

export function clone_messageOther(messg,img) {
    let you_tempmsg = document.querySelector(".you-tempmsg")
    let _clone = you_tempmsg.content.cloneNode(true);
            _clone.querySelector(".you-message").innerText= messg;
            _clone.querySelector("img").src = img;
        return _clone;
  }
  
  export function  clone_messageCurrent(messg,img) {
    let me_tempmsg = document.querySelector(".me-tempmsg")
    let clone = me_tempmsg.content.cloneNode(true);
    clone.querySelector(".me-message").innerText = messg;
    clone.querySelector("img").src = img;
        return clone;
  }


  export function getProfileById(id) {
    console.log(id);
    return globalData.profiles.find(profile => profile.user.id === id);
  }

  export function SetCookie(name,value,expire){

    document.cookie = `${name} = ${value} `
  }

  export function getCookie(name){

    const cookieDecoded = decodeURIComponent(document.cookie);
    const arrayCookie = cookieDecoded.split("; ")
    let result ;
    arrayCookie.forEach(e=> {

      if (e.indexOf(name) == 0) {
        result =  e.substring(name.length +1);
      }
    })
    return result ;
    console.log(result);
  }


  export function CheckTokenExpire(time){

    const currnetTime =Math.floor( Date.now() / 1000);
    const refreshTime = time - currnetTime;
    // console.log(time);
    // console.log(currnetTime);
    return refreshTime;
  }