import AbstractView from "../js/AbstractView.js";
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
    return headernav  +   ` 
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
            <div class=" d-flex align-items-end justify-content-end box1 rounded-5"> 
            <img src="static/images/mhyb.png" alt="">
            </div>
            <div class=" d-flex align-items-end justify-content-end box3 rounded-5"> 
            <img src="static/images/yppi.png" alt="">
              </div>
          </div>
        </div>
    `
  }
  async afterRender(){
    this.textWriter(".text-wlc","elcome to the pingpong world come join us for a game!");
  }
  async textWriter(element,txt){

    let textwr = document.querySelector(element);

    for (let index = 0; index < txt.length; index++) {
      setTimeout(() => {
        textwr.innerHTML += txt[index];
      }, 50 * index);  
    }

  }
}