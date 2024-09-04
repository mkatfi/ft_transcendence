// Login.js
import AbstractView from "../js/AbstractView.js";
import { closeSocketConnection } from "../js/utils.js";
export default class extends AbstractView {
    constructor() {
        super();
        console.log("log out constructor called");
        // document.querySelector(".sidebar").style.display = "none";
        // document.querySelector("header").style.display = "none";

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // closeSocketConnection();
        
            console.log("logout and colose socket x') ")
            if(!window.socketStatus){
                window.socketStatus.close();
            }
            if(!window.chat_socket){
                window.chat_socket.close();
            }

  
        this.setTitle("Logout");
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
    
    async searchHandle()
    {

    }      

    async getSidebar(){
        return ``;
    }
    async getHtml() {
        return `
            <div class="container-lander">
                <header class="h-colx">
                    <div class="hser">
                        <div class="logo-colx">
                            <img src="/imag_1/pino.jpg" alt="Logo">
                        </div>
                        <nav>
                            <ul>
                                <li><a href="#welcome">Home</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#how-to-play">How to Play</a></li>
                                <li><a href="#get-started">Get Started</a></li>
                            </ul>
                        </nav>
                        <div class="auth-buttons">
                            <a href="index_login.html">
                                <button class="login-btn">Open To Game</button>
                            </a>
                        </div>
                    </div>
                </header>
                <div class="content-lander">
                    <div class="lander">
                        <section class="hero-leader scroll-animate">
                            <div class="floating-paddle left"></div>
                            <div class="floating-paddle right"></div>
                            <div class="hero-content-leader">
                                <h1 class="fade-in-up">Welcome to the Ultimate Ping Pong Game!</h1>
                                <p class="fade-in-up delay-1">Experience the thrill of table tennis like never before.</p>
                            </div>
                        </section>
                        <img src="/image/DALL·E 2024-08-22 03.44.00 - A striking image of a single male ping pong player in action, set against a clean and bold background. The player is in mid-swing, focused and determi.webp" alt="Ping Pong Player">
                    </div>

                    <section id="welcome" class="section scroll-reveal">
                        <div class="content-box">
                            <p>Are you ready to test your reflexes and skills in the fast-paced world of ping pong? Whether you're a beginner or a seasoned player, our game offers endless fun and challenge. Play solo against AI or compete with your friends in exciting multiplayer matches. With intuitive controls, customizable difficulty levels, and dynamic gameplay, every match will keep you on the edge of your seat!</p>
                            <img src="/image/Leonardo_Phoenix_Create_a_visually_stunning_image_of_a_muscula_2.jpg" alt="Ping Pong Gameplay" class="floating-image">
                        </div>
                    </section>

                    <section id="features" class="section scroll-reveal">
                        <div class="content-box">
                            <fieldset>
                                <legend>
                                    <h2 class="slide-in-left">Game Features</h2>
                                </legend>
                                <ul class="feature-list">
                                    <li class="pop-in delay-1">Single-Player & Multiplayer Modes</li>
                                    <li class="pop-in delay-2">Adjustable Difficulty Settings</li>
                                    <li class="pop-in delay-3">Engaging Animations & Fun Power-Ups</li>
                                    <li class="pop-in delay-4">Realistic Table Tennis Physics</li>
                                </ul>
                            </fieldset>
                        </div>
                        <div class="image-sr">
                            <img src="/image/Leonardo_Phoenix_Create_a_visually_stunning_image_of_a_muscula_2.jpg" alt="Ping Pong Gameplay" class="floating-image">
                        </div>
                    </section>

                    <section id="how-to-play" class="section scroll-reveal">
                        <div class="content-box">
                            <h2>How to Play</h2>
                            <p>Use simple controls to move your paddle, serve the ball, and return shots. The goal is to outsmart your opponent and score points by landing the ball on their side of the table. Watch out for special power-ups that can turn the tide of the game!</p>
                        </div>
                    </section>

                    <section id="get-started" class="section scroll-reveal">
                        <div class="content-box">
                            <h2>Get Started</h2>
                            <p>Click below to dive into the action and experience the thrill of ping pong right at your fingertips. Get ready to serve, rally, and dominate the table!</p>
                            <a href="#" class="cta-button">Start Playing Now</a>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }
}
