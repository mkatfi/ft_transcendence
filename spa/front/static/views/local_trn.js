

class Matche {
    p1_name = '';
    p1_score = 0;
    
    p2_name = '';
    p2_score = 0;

    winner = '';
    status = 'unplayed';
}


export class Local_trn  {
    m1 = new Matche();
    m2 = new Matche();
    mf = new Matche();
    rejester(){
        return `
        <form class='rejister_trn'>
            <input class='plyr_name' name='p1_name' value="player_001" maxlength="10">
            <input class='plyr_name' name='p2_name' value="player_002" maxlength="10">
            <input class='plyr_name' name='p3_name' value="player_003" maxlength="10">
            <input class='plyr_name' name='p4_name' value="player_004" maxlength="10">
            <input type='submit' class='trn_strt' id='start_trn' value="Start">
        </form>`;
    };
    trn_start(event){
        event.preventDefault();
        
        const formdata = new FormData(event.target);
        const data = Object.fromEntries(formdata.entries());
        this.m1.p1_name = data.p1_name;
        this.m1.p2_name = data.p2_name;
        this.m2.p1_name = data.p3_name;
        this.m2.p2_name = data.p4_name;
        const map = new Map(Object.entries(data));

        console.log('map_size: ',map.size);
        var l_trn = document.getElementById('trn');
        l_trn.innerHTML = this.generateMatcheHtml(this.m1, 'm1');
        l_trn.innerHTML += this.generateMatcheHtml(this.m2, 'm2');
        this.add_ev_lintner(this.m1, 'm1');
        this.add_ev_lintner(this.m2, 'm2');

    };

    add_ev_lintner(matche, id){
        var elem = document.getElementById(id);
        if (id == 'm3')
            elem.addEventListener('click', this.show_trn_history.bind(this));
        else
            elem.addEventListener('click', this.start_matche.bind(this, matche));
    }
    
    start_matche(matche){
        matche.status = 'plyaed';
        matche.p1_score = 5;
        matche.p2_score = 2;
        matche.winner = matche.p1_name;
        this.next_matche();
    }

    next_matche(){
        var l_trn = document.getElementById('trn');
        if (this.m1.status == 'unplayed'){
            l_trn.innerHTML = this.generateMatcheHtml(this.m1, 'm1');
            this.add_ev_lintner(this.m1, 'm1');
            return;
        }
        if (this.m2.status == 'unplayed'){
            l_trn.innerHTML = this.generateMatcheHtml(this.m2, 'm2');
            this.add_ev_lintner(this.m2, 'm2');
            return;
        }
        else {
            this.mf.p1_name = this.m1.winner;
            this.mf.p2_name = this.m2.winner;
            l_trn.innerHTML = this.generateMatcheHtml(this.mf, 'm3');
            this.add_ev_lintner(this.mf, 'm3');
        }
    }

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
        `;
    }

    show_trn_history(){
        var content = `
        <div class="child-col m-r">
            <div class="plyr-box">
              <span class='text'> ${this.m1.p1_name}</span>
              <div class="score1">${this.m1.p1_score}</div>
            </div>
            <div class="plyr-box">
              <span class='text'> ${this.m1.p2_name}</span>
              <div class="score1">${this.m1.p2_score}</div>
            </div>
        <div class='vid'></div>
            <div class="plyr-box">
                <span class='text'> ${this.m2.p1_name}</span>
                <div class="score1">${this.m2.p1_score}</div>
            </div>
            <div class="plyr-box">
                <span class='text'> ${this.m2.p2_name}</span>
                <div class="score1">${this.m2.p2_score}</div>
            </div>
        </div>
        <div class="child-col m-l">
          <div class="plyr-box">
            <span class='text'> ${this.mf.p1_name}</span>
            <div class="score1">${this.mf.p1_score}</div>
          </div>
          <div class="plyr-box">
            <span class='text'> ${this.mf.p2_name}</span>
            <div class="score1">${this.mf.p2_score}</div>
          </div>
        </div>
        `;
    
        var trn = document.getElementById('trn')
        trn.className = `local-trn-result`
        trn.style.display = "grid";
        trn.innerHTML = content;
      }
};
