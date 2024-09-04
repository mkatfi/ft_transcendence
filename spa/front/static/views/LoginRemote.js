import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";

export default class extends AbstractView {
    constructor() {
        super();
        console.log("Login constructor called");

        this.setTitle("Login");
        // this.setHead(`
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <!-- Main Template css file -->
        //     <link rel="stylesheet" href="/static/css/style.css">
        //     <!-- Render all elements normally -->
        //     <link rel="stylesheet" href="/static/css/normalize.css">
        //     <!-- Font Awesome Library -->
        //     <link rel="stylesheet" href="/static/css/all.min.css" />
        //     <!-- Google Fonts -->
        //     <link rel="preconnect" href="https://fonts.gstatic.com" />
        //     <link
        //         href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@200;300;400;500;600;700;800&display=swap"
        //         rel="stylesheet"
        //     />
        // `);
    }

    async getHtml() {
        return ` `;
    }


    async getSidebar() {
        return ``;
    }

    async fetchRemoteTokens() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            console.log("enter in fetch remote \n\n\n\n")
            const response = await fetch(`/api/rauth/auth_intra?code=${code}&state=${state}`, {
                method: 'GET',
            });
            const responseData = await response.json();
    
            console.log('Response data:', responseData); // Debugging output

            if (response.ok) {
                localStorage.setItem('access_token', responseData.access_token);
                localStorage.setItem('refresh_token', responseData.refresh_token);
                console.log('User login successfully', responseData);

                // const accessToken = localStorage.getItem('access_token');
                // const loc = window.location;
                // const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
                // const endpoint = `${wsStart}${loc.host}`;

                // if (accessToken) {
                //     this.notfsocket = new WebSocket(`${endpoint}/ws/notf/?token=${accessToken}`);
                //     this.notfsocket.onopen = () => {
                //         console.log('WebSocket connection established');
                //     };
                // }

                // console.log("socket in constructor", this.notfsocket);

                navigateTo("/home")
            } else {
                console.error('Error:', responseData.details);
                navigateTo("/login");
            }
        } catch (error) {
            console.error('An error occurred:', error);
            navigateTo("/login");
        }
    }

    afterRender() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        if (urlParams.has('code') && urlParams.has('state')) {
            this.fetchRemoteTokens();
        }
    }
}
