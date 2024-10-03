
export async function getDataChats() {
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
    } catch (error) {
      console.error('An error occurred:', error);
    }
  
  }
  
  export async function blockUserChat(id){
    try {
      const ____data = {
        current_id : this.payload.user_id,
        other_id : id, 
      }
      const response = await fetch(`chat/block`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(____data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to block user');
      }
      this.isBlock = await response.json();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


  export async function getMessages(id){
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
  

  export async function  sendMessageTo(other_id,message){
    try {
  
      const ____data = {
        sender_id : this.payload.user_id,
        receiver_id : parseInt(other_id),
        message :message,
      }
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
    } catch (error) {
      console.error('An error occurred:', error);
    }
  
  }
  

 export function getProfilesHtmlClone(user_id,profiles,classselect,tmp){
  
    let ulHolder = document.querySelector(classselect);
    let templi = document.querySelector(tmp);
      profiles.forEach(user => {
      if (user.user.id != user_id) {
        let clone = templi.content.cloneNode(true);
        clone.querySelector("img").src = user.avatar;
        clone.querySelector("div").innerHTML = user.user.username;
        clone.querySelector("li").classList.toggle("hide");
        clone.querySelector("li").idTargetUser = user.user.id;
        ulHolder.append(clone);
      }
    })
  }


  // Setup the chat toggle button to open/close chat list
export function setupChatToggleButton() { 
  const toggleButton = document.querySelector(".btn-open-chat-list");
  toggleButton.addEventListener("click", (e) => {
    const chatBox = document.querySelector(".contact-chat-box");
    const isOpen = chatBox.classList.toggle("openC");
    e.currentTarget.innerHTML = isOpen
      ? `<i class="fa-solid fa-rectangle-xmark"></i>`
      : `<i class="fa-solid fa-rectangle-list"></i>`;
  });
}

// Setup filter input listeners for filtering chat contacts
export function  setupFilterListeners() {
  const filterInput = document.querySelector("#filter");
  filterInput.addEventListener('input', (e) => filterData(e.target.value));
  
  filterInput.addEventListener("blur", () => {
    const searchResults = document.querySelectorAll(".chat-search ul li");
    searchResults.forEach(item => item.classList.add("hide"));
  });
}


export function filterData(value){
  let allListSrch = document.querySelectorAll(".chat-search ul li");
   allListSrch.forEach(item =>{
     item.addEventListener("mousedown", (e) => {
       e.preventDefault();
     });
   let username = item.querySelector("div").innerText;
   if (username.toLowerCase().includes(value.toLowerCase())) 
     item.classList.remove("hide");
   else
     item.classList.add("hide");
   })
 
 }
 