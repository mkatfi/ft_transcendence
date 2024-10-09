import AbstractView from "../js/AbstractView.js";
import { CheckTokenExpire } from "../js/tools.js";
export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
    this.pageTitle = "HOME";
  }

  async getHtml() {
    await this.setPayload();
    await this.setData();
    const headernav = await this.getHeader();
    return (
      headernav +
      `  
    <div class="content_index flex-grow-1 p-3">
    <div class="wrapper d-grid  gap-2">
      <div class=" d-flex align-items-end justify-content-between box2 rounded-5 ">
      <img src="static/images/droitvs.png" alt="">
        <div class="ktab text-center  m-2">
          <h3>Pingpong</h3>
          <p class="text-wlc  m-3">W</p>
          <div class="play-now">
          <a class="text-center btn " href="/games"><i class="fa-solid fa-play"></i>
              <span> PlayNow</span></a>
            </div>
        </div>
        <img src="static/images/qauchevs.png" alt="">
      </div>
      <div class=" d-flex align-items-end justify-content-between box1 rounded-5"> 
      <img src="static/images/ann-1.png" alt="">
      <div class="ktab-box   ">
      <p class="text-box-1">Ping Pong Tournement</p>
      <div class="play-now">
      <a class="text-center btn btn-box " href="/games"><i class="fa-solid fa-play"></i>
      <span> PlayNow</span></a></div>
      </div>
      <img src="static/images/aadd.png" alt="">
      </div>
      <div class=" d-flex align-items-end justify-content-between box3 rounded-5"> 
       <div class="ktab-box-3 ">
          <p class="text-box-3 ">WELCOME TO GIME PING PONG</p>
          <div class="play-now">
          <a class="text-center btn btn-box-3" href="/games"><i class="fa-solid fa-play"></i>
              <span> PlayNow</span></a>
            </div>
        </div>
      <img src="static/images/aad.png" alt="">
      </div>
    </div>
    </div>
    `
    );
  }
  async afterRender() {
    CheckTokenExpire(this.payload.exp);
    this.textWriter(
      ".text-wlc",
      "elcome to the pingpong world come join us for a game!"
    );
    addEventListener("keydown", (e) => {
      console.log("key here=>:   ", e.key);
    });
  }
  async textWriter(element, txt) {
    let textwr = document.querySelector(element);

    for (let index = 0; index < txt.length; index++) {
      setTimeout(() => {
        textwr.innerHTML += txt[index];
      }, 50 * index);
    }
  }
}
