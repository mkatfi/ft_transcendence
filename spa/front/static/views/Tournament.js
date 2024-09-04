import AbstractView from "../js/AbstractView.js";

var butn1 = null;
var butn2 = null;
var joined = false;
var socket = null;
var trnInfoSocket = null;
var displaytype = 3;
var type = '';
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
    if (joined == false && type == 'tourn'){
      console.log('%%%%%%% AFTER RANDER %%%%%%%%%%');
      butn1 = document.getElementById("trn4");
      console.log(butn1);
      butn1.addEventListener("click" , this.trn_subscribe.bind(this, 4, 'update'));
      
      butn2 = document.getElementById("trn8");
      console.log(butn2);
      butn2.addEventListener("click" , this.trn_subscribe.bind(this, 8, 'update'));
      await this.tourn_info('trn4_info', 4);
      await this.tourn_info('trn8_info', 8);
      for (let id of trns_id){
        var trn_btn = document.getElementById(id);
        trn_btn.addEventListener('click', this.trn_history.bind(this, id));
      }
    }
    else if (type == 'tourn'){
      var elem = document.getElementById('leav_trn');
      elem.addEventListener('click', this.leave_trn.bind(this));
    }
  }

  async tourn_info(element_id, plyrs_num){
 
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
        this.trn_data(element_id, trn_data);
      else{
        var content = `<h1>tournament not created yet</h1>`;
        // document.getElementById(element_id).innerHTML = content;
      }
    } 
  }
  
  trn_data(element_id, trn_data){
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

  async trn_history(id){
    var url = `tournament/trn_history/?trn_id=${id}`;
    var response = await fetch(url);
    if (response.ok){
      var data = await response.text();
      var trn_hstry = JSON.parse(data);
      console.log("TRN_HISTORY: ", trn_hstry); 
    }
  }

  async trn_subscribe(plyrs_num, task){
    
    var content = "";
    var url = `/tournament/trn_subscribe/?trn_size=${plyrs_num}`;
    
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
        if (data.type == 'tourn')
          content = this.updatePlayer(data, task);
        if (data.type == 'matche'){
          content = this.display_matche(data, task);
          return content;
        }
      
      }
      else
        content = "error";
      
      // WEB SOCKET //
      if (joined == false | socket == null){
        socket = new WebSocket('ws://'+ window.location.host +`/ws/tourn/?size=${plyrs_num}`)
        socket.onmessage = e =>{
          const trn_data = JSON.parse(e.data);
          console.log("SSSSSSocket type: =====>",trn_data.type);
          if (trn_data.type == 'tourn')
            this.updatePlayer(trn_data, 'update');
          if (trn_data.type == "matche")
            this.display_matche(trn_data, 'update');
        };
      }
      return content;
  }


  async goLeave_trn(){

    var url = `/tournament/leave_trn/`;
    console.log(this.data);
    
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
      var content = await this.generateTournChoiceHtml();
      document.getElementById('trn').innerHTML = content;
      await this.tourn_info('trn4_info', 4);
      await this.tourn_info('trn8_info', 8);
      joined = false;
      localStorage.setItem('inTourn', false);
      
      // Socket
      trnInfoSocket = new WebSocket('ws://'+ window.location.host +`/ws/tourn_info/`);
      trnInfoSocket.onmessage = e =>{
        console.log('======TOUR_INFO======');
        const trn_data = JSON.parse(e.data);
        if (trn_data.trn_size == 4)
          this.trn_data('trn4_info', trn_data);
        if (trn_data.trn_size == 8)
          this.trn_data('trn8_info', trn_data);
      };
      this.afterRender();
    }

  }
  async leave_trn(){
   
    dialog.showDialog("Sure you want to leave tournament?", ()=> this.goLeave_trn());
  
  }

  updatePlayer(data, task) {
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
      <bottun class='choose-button btn' type"button" id="leav_trn">
        <span style="color:rebeccapurple;font-size:25px;">leave tournament</span>
      </button>`;
    if (task == 'update'){
      document.getElementById('trn').innerHTML = content;
      var elem = document.getElementById('leav_trn');
      elem.addEventListener('click', this.leave_trn.bind(this));
    }
    else{
      return content;
    }
  }

  // display_game_page()
  // {
  //   document.getElementById('trn').innerHTML = " game view ";
  // }

  display_matche(data, task){
    var matches = data.matches;
    var content = "";
    var id = this.data.user.id;
    for (const matche of matches){
      if (matche.p1_pr_id == id || matche.p2_pr_id == id)
        content = this.generateMatcheHtml(matche);
    }
    // console.log('matches: [', matches,']')
    content = `
    <h3>Welcome in tournament <span class='cg'> ${data.trn_name} </span></h3>
    <div class='container_tour'>  ${content} </div>`;
    if (task == 'return')
      return content;
    document.getElementById('trn').innerHTML = content;

    // setInterval(display_game_page.bind(this), 3000)

  }

  async generateTournChoiceHtml()
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
          </div>`;
          trns_id.push(trn.id);
        }
        console.log('ID = ', trns_id)
      }
      content += `
        </div>
      </div>`;
      type = 'tourn';
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
 
  generateMatcheHtml(matche){
    return `
      <div class='matche'>
        <div class="battle-arena">
          <div class="vid">
            <video src="/bagraoubd/smok-8.mp4" autoplay muted loop></video>
          </div>
          <div id="bilash" class="player-fin">
            <img src='${matche.p1_img}' alt="No image">
            <div class="name-user">${matche.p1_name}</div>
            <div class="dust"></div>
          </div>
          <div class="vs-circle">VS</div>
          <svg style="display: none;">
            <filter id="wavy">
              <feTurbulence x="0" y="0" baseFrequency="0.009" numOctaves="5" seed="2">
                <animate attributeName="baseFrequency" dur="60s" values="0.02;0.005;0.02" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="30" />
            </filter>
          </svg>
          <div id="pro-players" class="player-fin">
            <img src='${matche.p2_img}' alt="No image">
            <div class="dust"></div>
            <div class="name-user">${matche.p2_name}</div>
          </div>
        </div>
      </div>
    `;
}


  // generateMatcheHtml(matche) {
  //   return `
  //     <div class="container-match">
  //         <div class="hero-match">
  //             <div class="player-match" id="player1-match">
  //                 <img src='${matche.p1_img}' alt="No image">
  //                 <div class="user-match">${matche.p1_name}</div>
  //             </div>
  //             <div class="hero-bg-match">
  //             </div>
  //             <div class="vs-match">
  //                 <h1>vs</h1>
  //             </div>
  //             <div class="player-match" id="player2-match">
  //                 <img src='${matche.p2_img}' alt="No image">
  //                 <div class="user-match">${matche.p2_name}</div>
  //             </div>
  //         </div>
  //         <div class="game-area-match">
  //             <div class="table-match">
  //                 <div class="net-match"></div>
  //                 <div class="ball-match"></div>
  //             </div>
  //         </div>
  //     </div>
  //       `
  // }


  async getHtml() {
    await this.setPayload();
    await this.setData();
    
    var content = "";
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
      if (data.intourn == 'yes'){
        content = await this.trn_subscribe(data.trn_size, 'return');

      }
      if (data.intourn == 'no'){
        joined = false;
        content += await this.generateTournChoiceHtml();
        trnInfoSocket = new WebSocket('ws://'+ window.location.host +`/ws/tourn_info/`);
        trnInfoSocket.onmessage = e =>{
          console.log("==========TRN_INFO on message============");
          const trn_data = JSON.parse(e.data);
          if (trn_data.trn_size == 4)
            this.trn_data('trn4_info', trn_data);
          if (trn_data.trn_size == 8)
            this.trn_data('trn8_info', trn_data);
        };
      }
    }
    else
      console.log("!!!!!!!!! ERROR !!!!!!!!!");

  
      const headernav = await this.getHeader();
    return headernav  +    `        
    <div class='content_tour'>
      <div class="Tournament-brack"> Tournament Break </div>
      <div class='container_tour' id="trn">
        ${content}
      </div>
    </div>
    `;  
  }
  
}





