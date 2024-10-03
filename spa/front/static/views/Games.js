import AbstractView from "../js/AbstractView.js";
import { getCookie } from "../js/tools.js";
import {
        DiplayManager,
        CommandManager,
        keyUpListner, 
        keyDownListner,
        ft_mouse_mouvment,
      } from "../js/online.js"
import {NormalQueue, get_string_of_time_unit, inc_time, clock} from "../js/queue.js";

const {
  host, hostname, href, origin, pathname, port, protocol, search
} = window.location

var vars = {
  "pressed1" : false,
  "sock"     : null,
  "version1_of_buteen1" : "<h1>Normal</h1><h4> players : 2</h4><h4> mode : online</h4>",
  "version2_of_buteen1" : "<h1>registered</h1><h3 id =\"crono1\">00 : 00</h3><h4 game_mode : 1 vs 1</h4>",
  "dom_btn_normal" : null,

  "sock_url" : "ws://" + host + "/ws/queue/",
  "crono1" : {
      'sec' :0,
      'min' :0,
      'task' : null,
      'dom' : null,
    },

  "headers" : {
    'login'     : null,
    'access_token' : null,
    'image'     : null,
  },
};

function clearVars(varlist)
{
  varlist.pressed1 = false;
  varlist.sock = null;
  varlist.dom_btn_normal = null;
  varlist.crono1 = {
            'sec' :0,
            'min' :0,
            'task' : null,
            'dom' : null,
          };
  varlist.headers = {
              'login'     : null,
              'access_token' : null,
              'image'     : null,
            };
}

var consts = {
  board_width: 700,
  board_heigth: 500,
  distense_between_player_and_wall_in_percent: 10,
  ballspeed: 1,
  player_spreed: 10,
  ball_size: 500 * 0.03,  // Calculate based on board_height
  player_heigth_in_percent: 10,
  player_width_in_percent: 1,
  player_h : 500 * (10/ 100),//board_heigth * (player_heigth_in_percent/ 100)
  player_w : 700 * (1 / 100),//board_width * (player_width_in_percent / 100)
};

var printer = null;
var manager = null;
var gameWS = null;


export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Games");
    this.pageTitle = "GAMES";
    this.type = "queue"
  }



  observePageChange() 
  {
    const contentElement = document.querySelector('.content');
    
    if (!contentElement) {
        console.error('No element with class .content found');
        return;
    }

    // Create a MutationObserver instance
    var observer = new MutationObserver((mutationsList) => {
        //acces this observer
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach((node) => {
                    if (node.matches && node.matches('.mainqueueBox')) {
                      if (vars.sock && vars.sock.readyState == WebSocket.OPEN)
                        vars.sock.close();
                      clearVars(vars);
                      observer.disconnect();
                      observer = null;
                    }
                    else if (node.matches && node.matches('.gameview'))
                    {
                      if (gameWS && gameWS.readyState == WebSocket.OPEN)
                        gameWS.close();
                      gameWS = null;
                      printer = null;
                      manager = null;
                      observer.disconnect();
                      observer = null;
                    }
                });
            }
        }
    });

    // Start observing the .content element for changes to its child nodes
    observer.observe(contentElement, { childList: true, subtree: true });

    // Optionally, you might want to return the observer if you need to disconnect it later
  }

  async getHtml() {
   
    await this.setPayload();
    await this.setData();

    const postData = {
      'access_token' : getCookie('access_token'),
      'login'        : this.payload.username,
      'image'        : this.data.avatar,
    };
    const defaultHeaders = new Headers({
      'Content-Type': 'application/json',
    });

    const fetchOptions = {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(postData), // Convert JS object to JSON string
    };
    const url = '/api/game/is_ingame/';
    const response = await fetch(url, fetchOptions);
    if (response.ok)
    {
      const data = await response.text();
      if (data == "YES" )
      {
        this.type="game";
        console.log("AAAAAAAAAAAAaaaaa")
        return await this.GameHtml();
      }
    }
    
    return await this.QueueHtml();
  }

  afterRenderQueue()
  {
    vars.headers.access_token = getCookie('access_token');
    vars.headers.login = this.payload.username;
    vars.headers.image = this.data.avatar;

    console.log("AAAAAAAAAAAa---++aa")
    console.log(vars.headers);
    vars.dom_btn_normal = document.getElementById("noraml_btn");
    document.getElementById("noraml_btn").addEventListener("click", function() {
      NormalQueue(vars);
    });  
  }

  afterRenderGame()
  {
    manager = new CommandManager();
    printer = new DiplayManager(consts);
    manager.move_objs(225, 225, 345, 245, printer);
    let contenth = document.querySelector(".content");
    let barh = document.querySelector(".headbar");
    document.getElementById("gameview").style.height = (contenth.clientHeight - barh.clientHeight) + 'px'
    
    printer.onResize(manager)
    manager.count_down("Waiting For game");
    manager.p1name.textContent = "Player1";
    manager.p2name.textContent = "Player2";
    manager.p1holder.style.backgroundImage = null;
    manager.p2holder.style.backgroundImage = null;
    
    window.addEventListener('resize', function() {
      printer.onResize(manager);
    });
    const {
      host, hostname, href, origin, pathname, port, protocol, search
    } = window.location
    const sock_url = "ws://" + host + "/ws/game/online/"
    gameWS = new WebSocket(sock_url);
    var headrsgame = {
      "access_token" : getCookie('access_token'),
      "login"        :  this.payload.username,
      "image"        :  this.data.avatar,
    }
    gameWS.onopen = function()
    {
      this.send(JSON.stringify(headrsgame));
    };

    gameWS.onmessage = function(event)
    {
      try 
      {
        let obj = JSON.parse(event.data);
        
        if (obj.cmd == 'hide_queue')          manager.hide_queue();
        else if (obj.cmd == 'count_down')     manager.count_down(obj.time);
        else if (obj.cmd == 'count_down_end') manager.count_down_end();
        else if (obj.cmd == 'pannel')         manager.pannel(obj);
        else if (obj.cmd == 'move_objs')      manager.move_objs(obj.p1, obj.p2, obj.ballX, obj.ballY, printer);
        else if (obj.cmd == 'allow_move')     manager.allow_move(obj.allowed, gameWS, printer);
        else if (obj.cmd == 'update_score')   manager.update_score(obj.p1, obj.p2);
        else if (obj.cmd == 'match_end')      manager.match_end(obj.msg, obj.reson);
        else if (obj.cmd == 'msg')            manager.msg(obj.text);
        else if (obj.cmd == 'redirect' )      manager.redirect(obj.cmd, obj.url);
      }
      catch (error) {}
    }
  }

  async afterRender() {
    
    if (this.type == "game") 
      this.afterRenderGame();
    else
      this.afterRenderQueue();
    this.observePageChange();
  }

  async QueueHtml()
  {
   const headernav = await this.getHeader();
    return headernav  + `  
          <div class="mainqueueBox" id="mainqueueBox">
            <h1 class="queuetitle"> press to join queue </h1>
            <div class="queueBox"> 
              
              <div class="button-card box1 rounded-5" id="noraml_btn">
                  <h1>Normal</h1>
                  <h4> players : 2</h4>
                  <h4> mode : online</h4>
              </div>
          
              <div class="button-card box1 rounded-5" onclick="turnament()">
                <h1> tournament</h1>
                <h4> players : 8</h4>
                <h4> mode : online</h4>
          
              </div>  
            </div>
          </div>
    `
      ;
  }
  
  async GameHtml()
  {
    const headernav = await this.getHeader();
    return headernav  +   `
      <div class = "gameview" id="gameview">
      <div>
        <div id="scoeHolder">
          <div class="gameheader1 gameheader" id="gameheader1">
            <div class = "playerimg playerimg1"></div>
            <h3 class="playename playename1" id="playename1">monabid</h3>
            <h1 class="score" id="wh1">0</h1>
          </div>
          
          <div class="gameheader2 gameheader" id = gameheader2>
            
            <h1 class="score" id="wh2">0</h1>
            <h3 class="playename playename2" id="playename2">mkatfi</h3>
            <div class = "playerimg playerimg1"></div>
          </div>
          
        </div>
        
        <div id="gameHolder">
          <div id="game">
            <div id="ball"></div>
            <div id="counterHoler">
              <h1 id="counter"></h1>
              <h3 id="counter2"></h3>
            </div>
            
            <div id="board">
    
              <div id="playerLeft" class="player"></div>

              <div id="playerRigth" class="player"></div>
    
            </div>
          </div>
        </div>
        </div>
      </div>
    `
  }
}