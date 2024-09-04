import AbstractView from "../js/AbstractView.js";
// import { } from "../js/router.js";
import { navigateTo } from "../js/index.js";
export default class extends AbstractView {
  constructor() {
    super();
    console.log(" #\n#\n#\n#\n#\n friend profile constructer called \n\n");
    this.setTitle("Profile");
    console.log(location.pathname);
    this.id_friend = null;
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    if (urlParams.has('id')) {
        this.id_friend =   urlParams.get("id");
    }
    else {
      history.back();

    }

    this.datafriend = null;
    
    this.pageTitle = "";

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
  await this.setDataFriend();
  console.log("*\n*\n*\n",this.datafriend)
  await this.setPayload();
  await this.setData();
  console.log("payload", this.payload);
  console.log("data", this.datafriend);
  console.log("in html data \n\n\n\n",this.datafriend);
  const fprcontainer = document.querySelector(".freined-profile-user");
  fprcontainer.querySelector(".avatar img").src = this.datafriend.avatar;
  fprcontainer.querySelector(".user-h1").innerHTML = this.datafriend.user.username;
  fprcontainer.style.display = "block";
  document.querySelector(".freez-all").style.display = "";


  return null;
  }
  afterRender() {
      document.querySelector(".btn-exit").addEventListener("click" ,()=>{
      document.querySelector(".freined-profile-user").style.display = "none";
      document.querySelector(".freez-all").style.display = "none";
      })
}
}