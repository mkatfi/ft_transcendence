export class DiplayManager
{
  constructor(consts){
        this.defX = consts.board_width;
        this.defY = consts.board_heigth;
        this.windowW = document.getElementById('game').clientWidth;
        this.windowH = document.getElementById('game').clientHeight;
        this.ballSize = consts.ball_size
        this.playerW = consts.player_w
        this.pSize = consts.board_heigth * (consts.player_heigth_in_percent/ 100)
        this.p1StartingPositionX = consts.board_width * (consts.player_heigth_in_percent / 100)
    }

    displayBall(ballx, bally, dom){
        var x = parseFloat(ballx) / parseFloat(this.defX);
        x *= this.windowW;
        var y = parseFloat(bally) / parseFloat(this.defY);
        y *= this.windowH

        dom.style.left = x.toString() + 'px';
        dom.style.top  = y.toString() + 'px';
    }

    displayPlayer(py, dom){
    
        var y = parseFloat(py) / parseFloat(this.defY);
        y *= this.windowH;
        dom.style.marginTop = y.toString() + 'px';

    }

    get_vertual_scaleX(x)
    {
      var v =  parseFloat(x) / this.windowW;
      return v * this.defX;
    }

    get_vertual_scaleY(y){
      var v =  parseFloat(y) / this.windowH;
      return v * this.defY;
    }

    resize(size, original, virtual)
    {
        var v =  parseFloat(size) / parseFloat(original);
        return v * virtual
    }
    onResize(cmdmanager)
    { 
        var oldw = this.windowW
        var oldh = this.windowH
        var w = document.getElementById('gameview').clientWidth;
        var h = document.getElementById('gameview').clientHeight * 0.8;
        var coaf = this.defX / this.defY;

        if (w / h > coaf)
            w = h * 1.4;
        else
            h = w / 1.4;
  
        this.windowH = h
        this.windowW = w

        let contenth = document.querySelector(".content");
        let barh = document.querySelector(".headbar");
        document.getElementById("gameview").style.height = (contenth.clientHeight - barh.clientHeight) + 'px'

        document.getElementById('game').style.height = h + 'px';
        document.getElementById('game').style.width = w + 'px';


        cmdmanager.gameHolder.style.height =  h + 'px';
        cmdmanager.gameHolder.style.width =  w + 'px';
        cmdmanager.scoeHolder.style.width =  w + 'px';
        cmdmanager.scoeHolder.style.height =  (h * 0.15) + 'px';

        scoeHolder.style.height = h * 0.15
        
        // ball size h is same as W
        var ball    = document.getElementById('ball');
        ball.style.height = this.resize(this.ballSize, this.defY, this.windowH) + 'px'
        ball.style.width = this.resize(this.ballSize, this.defY, this.windowH) + 'px'

        // player size
        var p1      = document.getElementById('playerLeft');
        p1.style.width = this.resize(this.playerW, this.defX, this.windowW)+ 'px'
        p1.style.height  = this.resize(this.pSize,  this.defY, this.windowH)+ 'px'
        p1.style.marginLeft = this.resize(this.p1StartingPositionX,  this.defX, this.windowW)+ 'px'
        
        var p2      = document.getElementById('playerRigth');
        p2.style.width = this.resize(this.playerW, this.defX, this.windowW)+ 'px'
        p2.style.height  = this.resize(this.pSize,  this.defY, this.windowH)+ 'px'
        p2.style.marginRight = this.resize(this.p1StartingPositionX,  this.defX, this.windowW)+ 'px'
    
        //player posission

        p1.style.marginTop = this.resize(p1.style.marginTop, oldh, this.windowH) + 'px'
        p2.style.marginTop = this.resize(p2.style.marginTop, oldh, this.windowH) + 'px'


        ball.style.top = this.resize(ball.style.top, oldh, this.windowH) + 'px'
        ball.style.left = this.resize(ball.style.left, oldw, this.windowW) + 'px'
    }
}

export class CommandManager
{
  constructor(){
    this.Board   = document.getElementById('board');
    this.ball    = document.getElementById('ball');
    this.p1      = document.getElementById('playerLeft');
    this.p2      = document.getElementById('playerRigth');
    this.counter = document.getElementById('counter');
    this.counter2 = document.getElementById('counter2');
    this.wh1     = document.getElementById('wh1');
    this.wh2     = document.getElementById('wh2');
    this.el      = document.getElementById('queue');

    this.gameHolder = document.getElementById('gameHolder');
    this.scoeHolder = document.getElementById('scoeHolder');
    this.gameview = document.getElementById('gameview');

    this.p1name = document.getElementById("playename1");
    this.p2name = document.getElementById("playename2");
    this.p1holder = document.getElementById("gameheader1");
    this.p2holder = document.getElementById("gameheader2");
    const {
      host, hostname, href, origin, pathname, port, protocol, search
    } = window.location;
    this.host = host;
    this.protocol = protocol;
 }

  hide_queue() { this.el.hidden = true}
  pannel(obj)
  {
    console.log("Aaaaaa - aaaaaaa")
    this.p1name.textContent = obj.login1;
    this.p2name.textContent = obj.login2;
    console.log("Aaaaaa - aaaaaaa1")
    console.log(this.host)
    var url1 = this.protocol + "//" + this.host + obj.iamge1
    
    var url2 = this.protocol + "//" + this.host + obj.iamge2
    console.log("Aaaaaa - aaaaaaa2")
    this.p1holder.style.backgroundImage = `url(${url1})`;
    this.p2holder.style.backgroundImage = `url(${url2})`;
    console.log("Aaaaaa - aaaaaaa3")
    this.count_down_end();
  }


  count_down(time)
  {
    this.Board.style.filter = "blur(5px)";
    this.counter.textContent = time
  }
  count_down_end()
  {
    this.Board.style.filter = "";
    this.counter.textContent = '' 
  }
  set_score(vp1, vp2)
  {
    this.wh1.textContent = vp1
    this.wh2.textContent = vp2
  }
  move_objs(vp1, vp2, ballX, ballY, printer)
  {
    printer.displayPlayer(vp1, this.p1)
    printer.displayPlayer(vp2, this.p2)
    printer.displayBall(ballX, ballY, this.ball)
  }
  allow_move(allowed, sock, printer)
  {
    console.log("allowe call as " + allowed);
    if (allowed == true){
      document.addEventListener('keydown', keyDownListner.bind(null, sock));
      document.addEventListener('keyup', keyUpListner.bind(null, sock));
      document.addEventListener('mousedown', ft_mouse_mouvment.bind(null, sock, printer));
    }
    if (allowed == false){
      document.removeEventListener('keydown', keyDownListner);
      document.removeEventListener('keyup', keyUpListner);
      document.getElementById('board').removeEventListener('mousedown', ft_mouse_mouvment);
    }
  }
  match_end(vmsg, reson)
  {
    this.Board.style.filter = "blur(5px)";
    this.counter.textContent = vmsg
    this.counter2.textContent = reson
    sock.close()
  }
  msg(text) {console.log(text)}
  update_score(p1, p2)
  {
    this.wh1.textContent = p1
    this.wh2.textContent = p2
  }
  redirect(msg, url)
  {
    window.location.pathname = url;
  }
};

export function keyUpListner(sock ,event)
{
  let cmd = {
    'cmd' : 'key_relese',
    'key' : '',
  }
  if (event.key === 'w' || event.key === 'W'){
    cmd.key = 'w';
    sock.send(JSON.stringify(cmd))
  }
  else if (event.key === 's' || event.key === 'S')
  {
    cmd.key = 's';
    sock.send(JSON.stringify(cmd))
  }
}

export function keyDownListner(sock, event)
{

  if (event)
    console.log("evkey : " +event.key);
  else return;
  let cmd = {
    'cmd' : 'key_press',
    'key' : '',
  }
  if (event.key === 'w' || event.key === 'W'){
    cmd.key = 'w';
    sock.send(JSON.stringify(cmd))
  }
  else if (event.key === 's' || event.key === 'S')
  {
    cmd.key = 's';
    console.log(event);
    console.log(sock);
    sock.send(JSON.stringify(cmd))
  }
}

export function ft_mouse_mouvment(sock, printer,event)
{
  if (event.target !== document.getElementById('counterHoler'))
    return
  let cmd = {
    'cmd' : 'mouse_press',
    'x' : printer.get_vertual_scaleX(event.layerX),
    'y' : printer.get_vertual_scaleY(event.layerY),
  }
  sock.send(JSON.stringify(cmd))
}

   