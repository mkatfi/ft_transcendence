import Home from "/static/views/Home.js";
import Profile from "/static/views/Profile.js";
import Settings from "/static/views/Settings.js";
import Login from "/static/views/Login.js"
import Register from "/static/views/Register.js";
import Logout  from "/static/views/Logout.js";
import Friends from "/static/views/Friends.js";
import Games from "/static/views/Games.js";
import Tournament from "/static/views/Tournament.js";
import Leaderboard from "/static/views/Leaderboard.js";
import LoginRemote from "/static/views/LoginRemote.js";
import ProfileFriend from "/static/views/ProfileFriend.js";
import NotFound from "/static/views/NotFound.js";
import Chat from "/static/views/Chat.js";

import globalData from "./tools.js";


export const router = async () => {
    const routes = [

        {path:"/notfound",view: NotFound},
        {path:"/home",view: Home},
        {path:"/",view: Home},
        {path:"/profile",view: Profile},
        {path:"/settings",view:Settings},
        {path:"/login",view:Login},
        {path:"/register",view:Register},
        {path:"/logout",view:Logout},
        {path:"/friends",view:Friends},
        {path:"/games",view:Games},
        {path:"/tournament",view:Tournament},
        {path:"/leaderboard",view:Leaderboard},
        {path:"/loginremote/",view:LoginRemote},
        {path:"/profilefriend",view:ProfileFriend},
        {path:"/chat",view:Chat}
    ];  
    const potentialMatches = routes.map(route => {
        return {
            route:route,
            isMatch :location.pathname === route.path,
        };
    });

    console.log(location.pathname);
    let match = potentialMatches.find(potentialMatche => potentialMatche.isMatch);
    if(!match){
        match ={
            route : routes[0],
            isMatch: true
        } 
    }
    const view = await new match.route.view();
    globalData.currentView = view;
    
    document.querySelector(".sidebar-main").innerHTML = await view.getSidebar();

    var  html = await view.getHtml();
    if (html) {
        document.querySelector(".content").innerHTML = html
    }
    console.log("type function -------------------->\n\n\n",typeof view.afterRender )
    await view.afterRender(); 
    await view.notficationAfterRender();
    await view.searchHandle();
    await view.afterRenderAll();
    console.log("match :",view);
};