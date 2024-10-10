import AbstractView from "../js/AbstractView.js";
import { Local_trn } from "./local_trn.js";
import GamesView from '../views/Games.js';

var butn1 = null;
var butn2 = null;
var joined = false;
var socket = null;
var trnInfoSocket = null;
var displaytype = 3;
var type = 'none';
let trns_id = [];

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Tournament");
    this.pageTitle = "TOURNAMENT";  
  }

  async afterRender()
  {
    console.log('TYPE: ', type);
    if (joined == false){
      if (type == 'remotTrn'){
        console.log('%%%%%%% AFTER RANDER remotTrn %%%%%%%%%%');
        butn1 = document.getElementById("trn4");
        console.log(butn1);
        butn1.addEventListener("click" , this.trn_subscribe.bind(this, 4, 'update'));
        
        butn2 = document.getElementById("trn8");
        console.log(butn2);
        butn2.addEventListener("click" , this.trn_subscribe.bind(this, 8, 'update'));
        await this.trn_mumbers('trn4_info', 4);
        await this.trn_mumbers('trn8_info', 8);
        for (let id of trns_id){
          var trn_btn = document.getElementById(id);
          trn_btn.addEventListener('click', this.trn_history_choose.bind(this, id));
        }
      }
      if (type == 'none'){
        console.log('%%%%%%% AFTER RANDER None %%%%%%%%%%');
        var localTrn = document.getElementById('localTrn');
        localTrn.addEventListener("click", this.local_tournament.bind(this));
        var remotTrn = document.getElementById('remotTrn');
        remotTrn.addEventListener("click", this.remot_tournament.bind(this));
      }
    }
    else if (type == 'remotTrn'){
      var elem = document.getElementById('leav_trn');
      elem.addEventListener('click', this.leave_trn.bind(this));
    }
    else if (type == 'game')
    {
      let gv = new GamesView()
      gv.data = this.data;
      gv.payload = this.payload;
      gv.afterRenderGame();
    }
    else if (type == 'matche'){
      console.log('###### matche_afterRendere ########')
      this.matche_afterRendere();
    }
  }

  async in_trn(){
    const req_data = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.data),
    }
    const url = '/tournament/is_inTourn/';
    const response = await fetch(url, req_data);
    if (response.ok){
      const resp_data = await response.text();
      var data = JSON.parse(resp_data);
      return data;
    }
  }

  // For Unsubscribe players
  async trn_mumbers(element_id, plyrs_num){

    var url = `/tournament/tourn_info/?trn_size=${plyrs_num}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok){
      const data = await response.text();
      var trn_data = JSON.parse(data);
      if (trn_data.created == 'true')
        this.display_trn_mumbers(element_id, trn_data);
    } 
  }
  
  display_trn_mumbers(element_id, trn_data){
    var content = '';
    var players = trn_data.players;
    var unknown = trn_data.unknown;
    for (const player of players){
      content += `
      <div class="player_tour">
        <img src="${player.image_url}">
      </div>
      `;
    }
    for (let i = 0 ; i < unknown; i++){
      content += `
      <div class="player_tour">
        <img src="media/unkonu_p.png">
      </div>
      `;
    }

    document.getElementById(element_id).innerHTML = content;
  }

  
  async trn_subscribe(trn_size, task){
    
    var content = "";
    var url = `/tournament/trn_subscribe/?trn_size=${trn_size}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.data),
    });

    if (response.ok)
      {
        const resp_data = await response.text();
        var data = JSON.parse(resp_data);
        type = data.type;
        localStorage.setItem('inTourn', true);
        joined = true;
        if (task == 'update' && trnInfoSocket != null)
          trnInfoSocket.close();
        // Tourn
        // var className = `option_${data.trn_size}`;
        if (data.type == 'remotTrn'){
          content = `
          <div class='trn-p-grid' id="trn">
            ${this.trn_Players(data, task)}
          </div>`;
        }
        // Matche
        if (data.type == 'matche'){
          content = this.display_matche(data, task);
          content = await this.display_matche(data, task);
          return content;
        }
      
      }
      else
        content = "error";
    
      // WEB SOCKET //
      if (joined == false | socket == null){
        socket = new WebSocket('ws://'+ window.location.host +`/ws/tourn/`)
        
        socket.onopen = function(){
          socket.send(JSON.stringify({
            'trn_size': trn_size,
          }));
        }
        
        socket.onmessage = async e =>{
          const trn_data = JSON.parse(e.data);
          console.log("SSSSSSocket type: =====>", trn_data.type);
          if (trn_data.type == 'tourn')
            this.trn_Players(trn_data, 'update');
          if (trn_data.type == "matche")
            await this.display_matche(trn_data, 'update');
        };
      }
      return content;
    }
    
  // for subscribed users 
  trn_Players(data, task) {
    var content = "";
    console.log('++++++++++ task: '+task+' ++++++++++');
    var players = data.players;
    var unknown = data.unknown;
    for (const playr of players)
      content += this.generatePlayerHTML(playr);
    for (let i = 0 ; i < unknown; i++)
      content += this.generatePlaceholderHTML();
    
    content = ` 
    ${content} 
    <div class='choose-button btn leave_trn' id="leav_trn">
      leave tournament
    </div>`;
    if (task == 'update'){
      var trn =document.getElementById('trn');
      trn.innerHTML = content;
      trn.className = 'trn-p-grid';
      var elem = document.getElementById('leav_trn');
      elem.addEventListener('click', this.leave_trn.bind(this));
    }
    else{
      return content;
    }
  }
    
  async leave_trn(){
    var url = `/tournament/leave_trn/`;
    console.log(this.data);
    
    if(socket)
      socket.close();
    var response = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.data),
    });
    if (response.ok){
      console.log('player leave_trn');
      var content = await this.generateTournChoiceHtml('false');
      var trn = document.getElementById('trn');
      trn.innerHTML = content;
      trn.className = 'container_tour';
      await this.trn_mumbers('trn4_info', 4);
      await this.trn_mumbers('trn8_info', 8);
      joined = false;
      localStorage.setItem('inTourn', false);
      
      // Socket
      trnInfoSocket = new WebSocket('ws://'+ window.location.host +`/ws/tourn_info/`);
      trnInfoSocket.onmessage = e =>{
        console.log('======TOUR_INFO======');
        const trn_data = JSON.parse(e.data);
        if (trn_data.trn_size == 4)
          this.display_trn_mumbers('trn4_info', trn_data);
        if (trn_data.trn_size == 8)
          this.display_trn_mumbers('trn8_info', trn_data);
      };
      this.afterRender();
    }
    
  }
  
  async trn_history_choose(id){

    var url = `tournament/trn_history/?trn_id=${id}`;
    var response = await fetch(url);
    if (response.ok){
      var data = await response.text();
      var trn_hstry = JSON.parse(data);
      var class_name = `.parent-container-${trn_hstry.size}`;
      console.log("TRN_HISTORY: ", trn_hstry);
      this.show_trn_history(trn_hstry);
      document.querySelector(".btn-exit").addEventListener("click" ,()=>{
      document.querySelector(class_name).style.display = "none";
      document.querySelector(".freez-all").style.display = "none";
      })
    }
  }

  generateTrnMatche(matche){
    return `
        <div class="plyr-box">
          <img src='${matche.p1.img}'>
          <span class='text'>${matche.p1.name}</span>
          <div class="score1">${matche.p1.score}</div>
        </div>
        <div class="plyr-box">
          <img src='${matche.p2.img}'>
          <span class='text'>${matche.p2.name}</span>
          <div class="score1">${matche.p2.score}</div>
        </div>`;
  }

  generateTrnMatche_vid(){
    return `        
      <div class="plyr-box">
        <img src='media/unkonu_p.png'>
        <span class='text'>unkown</span>
        <div class="score1">0</div>
      </div>
      <div class="plyr-box">
        <img src='media/unkonu_p.png'>
        <span class='text'>unkown</span>
        <div class="score1">0</div>
      </div>
    `;
  }

  show_trn_history(data){
    let size = data.size;
    var content = `
    <div class="position-absolute top-0 end-0 btn-exit "><button type="button" class="btn btn-danger bg-danger"><i class="fa-solid fa-x"></i></button></div>
    <div class="child-col m-r">`;
    for (let i; i < size-4; i++){
      content += this.generateTrnMatche(data.matches[i]);
      if (i + 1 < 4){
        content += `
          <div class='vid'></div>`;
      }
      else
        content += `</div><div class="child-col m-l>`;
    }

    for (let i = size-4; i < size-2; i++){
      if (i < data.matches.length)
        content += this.generateTrnMatche(data.matches[i]);
      else
        content += this.generateTrnMatche_vid();
      if (i + 1 < 2)
        content += `<div class='vid'></div>`;
      else
        content += `</div>`;
    }
    let index = size - 2;
    if (index < data.matches.length){
      content += `
      <div class="child-col m-l">
        ${this.generateTrnMatche(data.matches[index])}
      </div>
      `;
    }
    else{
      content += `
      <div class="child-col m-l">
        ${this.generateTrnMatche_vid()}
      </div>
      `;
    }

    var trn = document.getElementById('trn_hstry')
    trn.className = `parent-container-${size}`
    trn.style.display = "grid";
    document.querySelector(".freez-all").style.display = "";
    trn.innerHTML = content;
  }

  get_game_view()
  {
    let gv = new GamesView();
    return gv.GameHtml();
  }

  

  async display_matche(data, task){
    var matches = data.matches;
    var content = "";
    var id = this.data.user.id;
    var matche = null;
    let gv = new GamesView()
    gv.data = this.data;
    gv.payload = this.payload;
    let gcontent = await gv.GameHtml();
    for (var m of matches){
      if (m.p1_pr_id == id || m.p2_pr_id == id){
        matche = m;
        break;
      }
    }
    if (matche){
      let create_time = new Date(matche.create_time);
      let now = new Date();
      let wDuration = 5000;
      content = this.generateMatcheHtml(matche);
      if (create_time.getTime() + wDuration >= now.getTime()){
        let timeleft = create_time.getTime() + wDuration - now.getTime();
        console.log('waiting: ', timeleft, ' ms');
        
        // displaye matche
        setTimeout(()=>{
          console.log('in_start');
          // displaye board game
          var trn = document.getElementById('trn');
          trn.className = 'container_tour';
          
          trn.innerHTML = gcontent;
          gv.afterRenderGame();

        }, timeleft);
      }
      else{
        console.log('out_start');
        // displaye board game
        content = "AAAA";
        content = gcontent;
        type = "game";
        
      }
    }
    else {
      this.trn_history_choose(data.trn_id);
    }

    
    if (task == 'return'){
      content = `
      <div class='battle-arena' id="trn">
        ${content}
      </div>`;
      return content;
    }
    var trn = document.getElementById('trn');
    trn.className = 'matche';
    trn.innerHTML = content;
    this.matche_afterRendere();

  }


  

  async generateTournChoiceHtml(render)
  {
    var content = `
    <div class="option_4" id="trn4">
      4
      <div class='players' id=trn4_info>
      </div>
    </div>
    <div class="option_8" id="trn8">
      8
      <div class='players' id=trn8_info>
      </div>
    </div>
    
    <div id='tourns' class='option_history scrool-friend'>
    <div class="choose-to-tournament">
    `;
    
    var url = `/tournament/trn_history/`;
    var response = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.data),
    });
    if (response.ok){
        const data = await response.text();
        var trn_data = JSON.parse(data);
        var trns = trn_data.trns;
        console.log('TOURNAMENTS: ', trns);
        
        
        for (var trn of trns){
          var icon = '';
          if (trn.won)
            icon = '<i class="fas fa-trophy trophy-icon"></i>';
          content += `
          <div class='choose'>
          <img src="/media/torn_${trn.size}.avif">
          <div class="choose-info">
            <div class="choose-name">${trn.name} ${icon}</div>
            <div class="choose-tournament-type">Tournament: ${trn.size} players</div>
            <div class="choose-level">Level Reached: ${trn.won}</div>
          </div>
          <div id="bracket"></div>
          <div id="${trn.id}">
          <button class="choose-button">show</button>
          </div>
          </div>
          </div>
          `;
          trns_id.push(trn.id);
        }
        console.log('ID = ', trns_id)
      }
      content += `
      </div>`;
      // if (render == 'true') {
      //   content = `
      //   <div class='container_tour' id="trn">
      //   </div>`;
      // }
      type = 'remotTrn';
      return content;
  }

  generatePlayerHTML(player)
  {
    return `
      <div class="player_tour">
          <img src="${player.image_url}" alt="No image" width="140" class="player_img">
          <h3>${player.username}</h3>
      </div>
    `;
  }

  generatePlaceholderHTML()
  {
    return `
      <div class="player_tour">
          <img src="media/unkonu_p.png" alt="No image" width="140" class="player_img">
          <h3>waiting player...</h3>
      </div>
    `;
  }

  // generateMatcheHtml(matche) {
  //   return `
  //       <div class='player_tour'>
  //        <img src='${matche.p1_img}' alt="No image" width="140">
  //        <h3>${matche.p1_name}</h3>
  //       </div>
  //       <div class='player_tour'>
  //         <img src='${matche.p2_img}' alt="No image" width="140">
  //         <h3>${matche.p2_name}</h3>
  //       </div>
  //       `
  // }

  generateMatcheHtml(matche, id){
    return `
    <div class="l-matche">
        <div class='l-plyr m-r l-p'>
            ${matche.p1_name}
        </div>
        <div class='vs'>
            VS
            <div class='strt-mtche' id='${id}'>
                Start
            </div>
        </div>
        <div class='l-plyr m-l m-r r-p'>
            ${matche.p2_name}
        </div>
       
    </div>
    ;`
}
  
  matche_afterRendere(){
    // document.addEventListener('DOMContentLoaded', () => {
      const bilash = document.getElementById('bilash');
      const proPlayers = document.getElementById('pro-players');
      const nameUsers = document.querySelector('.name-user');
      const vsCircle = document.querySelector('.vs-circle');
      // debugger
      console.log('Matche after render======|||||')
      setTimeout(() => {
          bilash.style.left = '60%';
          proPlayers.style.right = '60%';
          nameUsers.style.right = '60%';
      }, 1000);

      setTimeout(() => {
          vsCircle.style.transform = 'translate(-50%, -50%) scale(1)';
          vsCircle.style.opacity = '1';
          // energyField.style.opacity = '1';
      }, 1800);

      setInterval(() => {
          // lightning.style.opacity = '1';
          // setTimeout(() => {
          //     lightning.style.opacity = '0';
          // }, 300);

          vsCircle.style.animation = 'pulse 3.5s ease-in-out';
          setTimeout(() => {
              vsCircle.style.animation = 'none';
          }, 100);
      }, 5000);
  }

  async remot_tournament(){
    var content = "";
    
    content = await this.generateTournChoiceHtml("true");
    trnInfoSocket = new WebSocket('ws://'+ window.location.host +`/ws/tourn_info/`);
    trnInfoSocket.onmessage = e =>{
      console.log("==========TRN_INFO on message============");
      const trn_data = JSON.parse(e.data);
      if (trn_data.trn_size == 4)
        this.display_trn_mumbers('trn4_info', trn_data);
      if (trn_data.trn_size == 8)
        this.display_trn_mumbers('trn8_info', trn_data);
    };
    var trn = document.getElementById('trn');
    trn.className = 'container_tour';
    trn.innerHTML = content;
    type = "remotTrn";
    this.afterRender();
    
  }
  
  async getHtml() {
    await this.setPayload();
    await this.setData();
    var content = '';
    type = 'none';
    var data = await this.in_trn();
    if (data.intourn == 'yes')
      content = await this.trn_subscribe(data.trn_size, 'return');
    if (data.intourn == 'no'){
      content = `
      <div class='trnModeParent' id="trn">
        <div class="trnMode" id="localTrn">
          Local Tournament
          <div class='strt-mtche-1'>
                START
          </div>
        </div>
        <div class="trnMode" id="remotTrn">
          Remot Tournament
          <div class='strt-mtche-1'>
                START
          </div>
        </div>
      </div>
      `;
    }
    
    
    const headernav = await this.getHeader();
    return headernav + `
    <div class='content_tour'>
    <div class="Tournament-brack"> Tournament Break </div>
    ${content}
    <div class="parent-container-4" id='trn_hstry'></div>
    </div>
    `;  
    
  }
  
  local_tournament(){
    var trn = document.getElementById('trn');
    var local_trn = new Local_trn;
    trn.innerHTML = local_trn.rejester();
    var strt_trn = document.querySelector('.rejister_trn');
    strt_trn.addEventListener('submit', e=> {
      local_trn.trn_start(event);
    });
  }

}