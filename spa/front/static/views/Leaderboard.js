import AbstractView from "../js/AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Leaderboard");
    this.pageTitle = "LEADERBOARD";

  }

  async getHtml() {

    await this.setPayload();
    await this.setData();
    const headernav = await this.getHeader();
    return headernav  +   `   
    <div class="content_leader flex-grow-1 p-3">
    <div class="wrapper_leader d-grid  gap-2">
        <div class="box1_leader d-flex align-items-center justify-content-center  rounded-5 ">
            <div class="top-three  align-items-center justify-content-between w-100 h-100 m-5">
                <div class="player-bord position-relative second text-center">
                    <div class="crown position-absolute top-0 start-50 translate-middle"><img class="w-75" src="static/images/namra2.svg" alt=""></div>
                    <img class="logo-go" src="imag_1/54240320_5kn3diyz.gif" alt="Jackson">
                    <div class="player-info">
                        <span class="name">Jackson</span>
                        <span class="score">1847 XP</span>
                        <span class="username">@username</span>
                    </div>
                </div>
                <div class="player-bord first  position-relative text-center">
                    <div class="crown position-absolute top-0 start-50 translate-middle"><img class="w-75" src="static/images/namra1.svg" alt=""></div>
                    <img class="logo-go"  src="imag_1/pop.jpg" alt="Elden">
                    <div class="player-info">
                        <span class="name">Elden</span>
                        <span class="score">2430 XP</span>
                        <span class="username">@username</span>
                    </div>
                </div>
                <div class="player-bord third position-relative  text-center">
                    <div class="crown position-absolute top-0 start-50 translate-middle"><img class="w-75" src="static/images/namra3.svg" alt=""></div>
                    <img  class="logo-go" src="imag_1/Default.jpg" alt="Emma Aria">
                    <div class="player-info">
                        <span class="name">Emma Aria</span>
                        <span class="score">1674 XP</span>
                        <span class="username">@username</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="box2_leader d-flex m-0 gap-2 align-items-center justify-content-center rounded-5"> 
            <div class="leader-page d-grid m-0 gap-2 w-100 h-100">
                <div class="leader  rad-6 p-4 position-relative">
                  <div class="contact_leader d-flex align-items-center">
                    <div class="status-leader not-active_leader" aria-label="Not Active">
                      <div class="not-active_leader_1"></div>
                    </div>
                  </div>
                  <div class="txt-c text-center">
                    <img decoding="async" class="photo_leader mt-2 mb-2" src="${this.data.avatar}" alt="" />
                    <h4 class="m-1">${this.data.user.username}</h4>
                  </div>
                  <div class="icons_leader fs-15 p-relative">
                    <div class="leader-count mb-10">
                      <i class="fa-regular fa-face-smile fa-fw"></i>
                      <span>19 Friend</span>
                    </div>
                    <div class="mb-10">
                        <i class="fa fa-bar-chart" aria-hidden="true"></i>
                        <span >60 XP</span>
                    </div>              
                    <div class="rating mt-10 mb-10">
                        <i class="fa-solid fa-star text-warning fs-13"></i>
                        <i class="fa-solid fa-star text-warning  fs-13"></i>
                        <i class="fa-solid fa-star text-warning  fs-13"></i>
                        <i class="fa-solid fa-star text-secondary fs-13"></i>
                        <i class="fa-solid fa-star text-secondary fs-13"></i>
                    </div>
                  </div>
                  <div class="info-leader d-flex align-items-center justify-content-center fs-13">
                    <div>
                      <a class="text-light" href="profile.html"><button type="submit" class="btn btn-primary">Profile</button></a>
                    </div>
                  </div>
                </div>
              </div>
            
        </div>
        <div class="box3_leader d-flex align-items-center justify-content-center  rounded-5"> 
            <div class="liss d-flex align-items-center justify-content-center">
                <ul class="player-list m-5 p-2 ">
                    <li>
                        <img src="image/avatar.png" alt="Sebastian">
                        <span class="name">Sebastian</span>
                        <span class="username">@username</span>
                        <span class="score">1124 XP</span>
                    </li>
                    <li>
                        <img src="image/avatar.png" alt="Jason">
                        <span class="name">Jason</span>
                        <span class="username">@username</span>
                        <span class="score">875 XP</span>
                    </li>
                    <li>
                        <img src="image/avatar.png" alt="Natalie">
                        <span class="name">Natalie</span>
                        <span class="username">@username</span>
                        <span class="score">774 XP</span>
                        <span class="trend up">▲</span>
                    </li>
                    <li>
                        <img src="image/avatar.png" alt="Serenity">
                        <span class="name">Serenity</span>
                        <span class="username">@username</span>
                        <span class="score">723 XP</span>
                        <span class="trend up">▲</span>
                    </li>
                    <li>
                        <img src="image/avatar.png" alt="Hannah">
                        <span class="name">Hannah</span>
                        <span class="username">@username</span>
                        <span class="score">559 XP</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
    `
      ;
  }
}