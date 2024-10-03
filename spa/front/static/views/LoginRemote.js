import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";
import { getCookie, SetCookie } from "../js/tools.js";
import { messageHandling } from "../js/utils.js";
export default class extends AbstractView {
    constructor() {
        super();
        console.log("Login constructor called");
        this.setTitle("Login");
        
    }
    async getHtml() {   return ` `;}
    async getSidebar() { return ``;}

    async getCodeState(){

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        return {code,state};
    }

    async fetchRemoteTokens() {
        try {
           const { code,state} = this.getCodeState();
            const response = await fetch(`/api/rauth/auth_intra?code=${code}&state=${state}`, {
                method: 'GET',
            });
            const responseData = await response.json();
            if (response.ok) {
                SetCookie('access_token', responseData.access);
                SetCookie('refresh_token', responseData.refresh);
                navigateTo("/home")
            } else {
                messageHandling("error",responseData.details);
                navigateTo("/login");
            }
        } catch (error) {
            console.error('An error occurred:', error);
            navigateTo("/login");
        }
    }

    async searchHandle(){}  
    async inAuthpages(){return true;}

    afterRender() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        if (urlParams.has('code') && urlParams.has('state')) {
            this.fetchRemoteTokens();
        }
        else
            navigateTo("/notfound");
    }
}
