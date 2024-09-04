

export function NormalQueue(vars) {
  if (vars.pressed1 == true){
    vars.crono1.dom = null;
    vars.dom_btn_normal.innerHTML = vars.version1_of_buteen1;
    vars.dom_btn_normal.style.background = "linear-gradient(180deg, rgba(218,60,135,0.3477766106442577) 0%, rgba(0,0,0,0) 50%, rgba(130,57,45,0.3617822128851541) 100%)";
    
    vars.crono1.sec = 0;
    vars.crono1.min = 0;
    clearInterval(vars.crono1.task);
    vars.crono1.task = null;

    vars.sock.close();

    vars.pressed1 = false;
    return;
  }
  
  vars.pressed1 = true;
  console.log(vars.version2_of_buteen1)
  vars.dom_btn_normal.innerHTML = vars.version2_of_buteen1;
  vars.dom_btn_normal.style.backgroundColor = 'black';

  vars.sock = new WebSocket(vars.sock_url);
  vars.sock.onopen = function() {
    console.log(vars.headers)
    vars.sock.send(JSON.stringify(vars.headers));
  };

  console.log(vars.sock)
  vars.sock.onmessage = function(event){

    try {
      let obj = JSON.parse(event.data);
      if (obj.action == 'redirect')
      {
        vars.sock.close();
        NormalQueue(vars);
        var btn = document.getElementById("game_buttun");
        btn.click();
        // window.location.pathname = obj.url;

      }
    } catch (error) {
      console.log("error couth:");
      console.log(error);
    }
  }
  vars.crono1.dom = document.getElementById('crono1')
  vars.crono1.task = setInterval(clock, 1000, vars.crono1);
  console.log('done');
}

export function get_string_of_time_unit(t)
{
  var ss_str =  t.toString();
  return (ss_str.length === 1) ? '0' + ss_str : ss_str;
}

export function inc_time(time){

  var extra = (time.sec === 59) ? 1 : 0
  time.sec = (time.sec === 59) ? 0 : time.sec + 1
  time.min +=  extra
  //remove user from queue if queue time raches 60 min
  if (time.min == 60)
    NormalQueue(vars)
}

export function clock(crono1){

  inc_time(crono1)
  let time = get_string_of_time_unit(crono1.min)
  time += " : "
  time += get_string_of_time_unit(crono1.sec)
  crono1.dom.innerText = time
}