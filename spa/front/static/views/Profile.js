import AbstractView from "../js/AbstractView.js";
export default class extends AbstractView {
  constructor() {
    super();
    console.log("profile constructer called \n\n");
    this.setTitle("Profile");

    this.pageTitle = "PROFILE";
  }

  async getHtml() {
    await this.setPayload();
    await this.setData();

    const headernav = await this.getHeader();

    return (
      headernav +
      `       <div class="content_profile myprofile-user">
<div class="pr-welcome m-2 d-flex justify-content-between">
  <p>  <i class="fa-solid fa-user  fa-fw"></i> My Profile </p> 
    <div class="btn-settings">
        <a class="d-flex p-3 align-items-center fs-5 rounded-2 mb-2 ms-3"  data-link href="/settings">
            <i class="fa-solid fa-gear"></i>
        </a>
    </div>
</div>

<div class="profile-container">
<div class="avatar">
    <img src="${this.data.avatar}" alt="Profile Picture">
</div>
<h1>${this.data.user.username}</h1>
<div class="xp">5000 XP</div>
<div class="separator"></div>
<div class="stats">
    <div class="stat" id="wins">
        <div class="stat-value win">42</div>
        <div class="stat-label ">Wins</div>
    </div>
    <div class="stat" id="draw">
        <div class="stat-value gf">15</div>
        <div class="stat-label ">GF</div>
    </div>
    <div class="stat" id="draw">
        <div class="stat-value ga">20</div>
        <div class="stat-label ">GA</div>
    </div>
    <div class="stat" id="losses">
        <div class="stat-value los">23</div>
        <div class="stat-label ">Losses</div>
    </div>
</div>
<div class="separator"></div>
<h1>Match History</h1>
<div class="scrool_histori">
    <div class="histor d-flex justify-content-evenly bd-highlight">
        <div class="player_01">
            <img src="${this.data.avatar}" alt="Profile Picture">
            <div class="Usernametohistory">${this.data.user.username}</div>
        </div>
        <div class="player_03 d-flex justify-content-between align-items-center">
            <div class="buut">2</div>
            <div class="tow_poin">:</div>
            <div class="buut">1</div>
        </div>
        <div class="player_02">
            <img src="imag_1/pop.jpg" alt="Profile Picture">
            <div class="Usernametohistory">Split abid monsif</div>
        </div>
    </div>
    <div class="separator"></div>


     <div class="histor d-flex justify-content-evenly bd-highlight">
        <div class="player_01">
            <img src="${this.data.avatar}" alt="Profile Picture">
            <div class="Usernametohistory">${this.data.user.username}</div>
        </div>
        <div class="player_03 d-flex justify-content-between align-items-center">
            <div class="buut">2</div>
            <div class="tow_poin">:</div>
            <div class="buut">1</div>
        </div>
        <div class="player_02">
            <img src="imag_1/pop.jpg" alt="Profile Picture">
            <div class="Usernametohistory">Split abid monsif</div>
        </div>
    </div>
    <div class="separator"></div>
     <div class="histor d-flex justify-content-evenly bd-highlight">
        <div class="player_01">
            <img src="${this.data.avatar}" alt="Profile Picture">
            <div class="Usernametohistory">${this.data.user.username}</div>
        </div>
        <div class="player_03 d-flex justify-content-between align-items-center">
            <div class="buut">2</div>
            <div class="tow_poin">:</div>
            <div class="buut">1</div>
        </div>
        <div class="player_02">
            <img src="imag_1/pop.jpg" alt="Profile Picture">
            <div class="Usernametohistory">Split abid monsif</div>
        </div>
    </div>
    <div class="separator"></div>
     <div class="histor d-flex justify-content-evenly bd-highlight">
        <div class="player_01">
            <img src="${this.data.avatar}" alt="Profile Picture">
            <div class="Usernametohistory">${this.data.user.username}</div>
        </div>
        <div class="player_03 d-flex justify-content-between align-items-center">
            <div class="buut">2</div>
            <div class="tow_poin">:</div>
            <div class="buut">1</div>
        </div>
        <div class="player_02">
            <img src="imag_1/pop.jpg" alt="Profile Picture">
            <div class="Usernametohistory">Split abid monsif</div>
        </div>
    </div>
    <div class="separator"></div>
    </div>
</div>
<div class="separator"></div>

<table class="tournament-table">
    <thead>
        <tr>
            <th>Tournament</th>
            <th class="win">Wins</th>
            <th class="gf">GF</th>
            <th class="ga">GA</th>
            <th class="los">Losses</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Spring Championship</td>
            <td>8</td>
            <td>12</td>
            <td>10</td>
            <td>0</td>
        </tr>
    </tbody>
</table>
</div>
</div>`
    );
  }

  afterRender() {}
}
