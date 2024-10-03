import AbstractView from "../js/AbstractView.js";
import { navigateTo,establishSocket,refreshAccessToken} from "../js/index.js";
import { messageHandling } from "../js/utils.js";
import { CheckTokenExpire, SetCookie,getCookie } from "../js/tools.js";
import { loginHTML } from "../js/HtmlPages.js";

const ACCESS_TOKEN_LIFETIME = 60* 60 * 1000;
const REST_TIME = 2 * 60 * 1000;
export default class extends AbstractView {
    constructor() {
        super();
        console.log("Login constructor called");
        this.setTitle("Login");
    }

    async getHtml() {return loginHTML;}
    
    async  sendRequest(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return response;
        } catch (error) {
            messageHandling("error", error);
            throw error;
        }
    }
    
    handleResponse(response, responseData) {
        if (response.ok) {
            return responseData;
        } else {
            const errorMessage = `${Object.keys(responseData)[0]} : ${Object.values(responseData)[0]}`;
            messageHandling("error", errorMessage);
            throw new Error(errorMessage);
        }
    }
    
     setTokens(access, refresh) {
        SetCookie('access_token', access);
        SetCookie('refresh_token', refresh);
    }
    
     handleSuccess(message, redirectUrl) {
        messageHandling("success", message);
        navigateTo(redirectUrl);
    }

    getFormData(formElement) {
        const formdata = new FormData(formElement);
        return Object.fromEntries(formdata.entries());
    }
    async loginUser(event) {
        event.preventDefault();
        const data = this.getFormData(event.target);

        try {
            const response = await this.sendRequest('/api/login/', data);
            const responseData = await response.json();
            const result = this.handleResponse(response, responseData);
            this.setTokens(result.access, result.refresh);
            this.handleSuccess("User login successfully", "/home");
        } catch (error) {
            console.error(error);
        }
    }
    async  registerUser(event) {
        event.preventDefault();
        const data = this.getFormData(event.target);    
        try {
            const response = await this.sendRequest('/api/register/', data);
            const responseData = await response.json();
            this.handleResponse(response, responseData);
            this.handleSuccess("User registered successfully", "/login");
        } catch (error) {
            console.error(error);
        }
    }

    async searchHandle(){}  
    async getSidebar(){return ``;}
    async authorizeIntra() {window.location.href = "/api/rauth/intra_authorize";}
    async loginWithIntra() { await this.authorizeIntra();}
    async inAuthpages(){return true;}

    afterRender() {
        document.querySelector(".login-input").addEventListener("submit", this.loginUser.bind(this));
        document.querySelectorAll(".login-with-intra").forEach((e)=>{   e .addEventListener("click", this.loginWithIntra.bind(this));   });                 
        document.querySelector(".register-input").addEventListener("submit", this.registerUser.bind(this));

        const container = document.getElementById('container_login');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        registerBtn.addEventListener('click', () => {container.classList.add("active");});
        loginBtn.addEventListener('click', () => {container.classList.remove("active");});
    }
 
}
