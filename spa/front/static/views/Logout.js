// // Login.js
// import AbstractView from "../js/AbstractView.js";
// import WebSocketManager from "../js/Websocket.js";
// import { SetCookie } from "../js/tools.js";
// export default class extends AbstractView {
//     constructor() {
//         super();
//         console.log("log out constructor called");
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         SetCookie('access_token',null);
//         SetCookie('refresh_token',null);
//         console.log("logout and colose socket x') ")
//         WebSocketManager.closeAllSockets();
//         this.setTitle("Logout");
//     }
    
//     async searchHandle()
//     {

//     }      

//     async getSidebar(){
//         return ``;
//     }
//     async getHtml() {
//         return `
//             <div class="container-lander">
//                 <header class="h-colx">
//                     <div class="hser">
//                         <div class="logo-colx">
//                             <img src="/imag_1/pino.jpg" alt="Logo">
//                         </div>
//                         <nav>
//                             <ul>
//                                 <li><a href="#welcome">Home</a></li>
//                                 <li><a href="#features">Features</a></li>
//                                 <li><a href="#how-to-play">How to Play</a></li>
//                                 <li><a href="#get-started">Get Started</a></li>
//                             </ul>
//                         </nav>
//                         <div class="auth-buttons">
//                      <button><a href="/login" data-link ="">Login again</a></button>
//                         </div>
//                     </div>
//                 </header>
//                 <div class="content-lander">
//                     <div class="lander">
//                         <section class="hero-leader scroll-animate">
//                             <div class="floating-paddle left"></div>
//                             <div class="floating-paddle right"></div>
//                             <div class="hero-content-leader">
//                                 <h1 class="fade-in-up">Welcome to the Ultimate Ping Pong Game!</h1>
//                                 <p class="fade-in-up delay-1">Experience the thrill of table tennis like never before.</p>
//                             </div>
//                         </section>
//                         <img src="/image/DALL·E 2024-08-22 03.44.00 - A striking image of a single male ping pong player in action, set against a clean and bold background. The player is in mid-swing, focused and determi.webp" alt="Ping Pong Player">
//                     </div>

//                     <section id="welcome" class="section scroll-reveal">
//                         <div class="content-box">
//                             <p>Are you ready to test your reflexes and skills in the fast-paced world of ping pong? Whether you're a beginner or a seasoned player, our game offers endless fun and challenge. Play solo against AI or compete with your friends in exciting multiplayer matches. With intuitive controls, customizable difficulty levels, and dynamic gameplay, every match will keep you on the edge of your seat!</p>
//                             <img src="/image/Leonardo_Phoenix_Create_a_visually_stunning_image_of_a_muscula_2.jpg" alt="Ping Pong Gameplay" class="floating-image">
//                         </div>
//                     </section>
//                     <div class="image-marquee">
//                         <marquee behavior="scroll" direction="left" scrollamount="6">
//                             <div class="marquee-item">
//                                 <img src="/image1.jpg" alt="Image 1" width="150" height="150">
//                                 <p>Name 1</p>
//                             </div>
//                             <div class="marquee-item">
//                                 <img src="/image2.jpg" alt="Image 2" width="150" height="150">
//                                 <p>Name 2</p>
//                             </div>
//                             <div class="marquee-item">
//                                 <img src="/image3.jpg" alt="Image 3" width="150" height="150">
//                                 <p>Name 3</p>
//                             </div>
//                             <div class="marquee-item">
//                                 <img src="/image4.jpg" alt="Image 4" width="150" height="150">
//                                 <p>Name 4</p>
//                             </div>
//                         </marquee>
//                     </div>
//                     <section id="features" class="section scroll-reveal">
//                         <div class="content-box">
//                             <h2 class="slide-in-left">Game Features</h2>
//                             <ul class="feature-list">
//                                 <li class="pop-in delay-1">Single-Player & Multiplayer Modes</li>
//                                 <li class="pop-in delay-2">Adjustable Difficulty Settings</li>
//                                 <li class="pop-in delay-3">Engaging Animations & Fun Power-Ups</li>
//                                 <li class="pop-in delay-4">Realistic Table Tennis Physics</li>
//                             </ul>
//                         </div>
//                         <div class="image-sr">
//                             <img src="/image/Leonardo_Phoenix_Create_a_visually_stunning_image_of_a_muscula_2.jpg" alt="Ping Pong Gameplay" class="floating-image">
//                         </div>
//                     </section>

//                     <section id="how-to-play" class="section scroll-reveal">
//                         <div class="content-box">
//                             <h2>How to Play</h2>
//                             <p>Use simple controls to move your paddle, serve the ball, and return shots. The goal is to outsmart your opponent and score points by landing the ball on their side of the table. Watch out for special power-ups that can turn the tide of the game!</p>
//                         </div>
//                     </section>

//                     <section id="get-started" class="section scroll-reveal">
//                         <div class="content-box">
//                             <h2>Get Started</h2>
//                             <p>Click below to dive into the action and experience the thrill of ping pong right at your fingertips. Get ready to serve, rally, and dominate the table!</p>
//                             <a href="#" class="cta-button">Start Playing Now</a>
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         `;
//     }

//     async inAuthpages(){
//         return true;
      
//     }
// }


// import AbstractView from "../js/AbstractView.js";
// import WebSocketManager from "../js/Websocket.js";
// import { SetCookie } from "../js/tools.js";

// export default class extends AbstractView {
//     constructor() {
//         super();
//         console.log("Logout constructor called");
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         SetCookie('access_token', null);
//         SetCookie('refresh_token', null);
//         console.log("Logged out and closed all WebSockets");
//         WebSocketManager.closeAllSockets();
//         this.setTitle("Logout");
//     }

//     async searchHandle() {
//         // Logic for handling search functionality if needed
//     }

//     async getSidebar() {
//         return ``; // Optional: return a sidebar if needed
//     }

//     async getHtml() {
//         return `
//             <div class="container-lander">
//                 <header class="h-colx">
//                     <div class="hser">
//                         <div class="logo-colx">
//                             <img src="/imag_1/pino.jpg" alt="Logo">
//                         </div>
//                         <nav>
//                             <ul>
//                                 <li><a href="#welcome">Home</a></li>
//                                 <li><a href="#features">Features</a></li>
//                                 <li><a href="#how-to-play">How to Play</a></li>
//                                 <li><a href="#get-started">Get Started</a></li>
//                             </ul>
//                         </nav>
//                         <div class="auth-buttons">
//                             <button><a href="/login" data-link="">Login again</a></button>
//                         </div>
//                     </div>
//                 </header>

//                 <div class="content-lander">
//                     <div class="lander">
//                         <section class="hero-leader scroll-animate">
//                             <div class="floating-paddle left"></div>
//                             <div class="floating-paddle right"></div>
//                             <div class="hero-content-leader">
//                                 <h1 class="fade-in-up">Welcome to the Ultimate Ping Pong Game!</h1>
//                                 <p class="fade-in-up delay-1">Experience the thrill of table tennis like never before.</p>
//                             </div>
//                         </section>
//                         <img src="/image/DALL·E 2024-08-22 03.44.00 - A striking image of a single male ping pong player in action, set against a clean and bold background. The player is in mid-swing, focused and determined." alt="Ping Pong Player">
//                     </div>

//                     <section id="welcome" class="section scroll-reveal">
//                         <div class="content-box">
//                             <p>Are you ready to test your reflexes and skills in the fast-paced world of ping pong? Whether you're a beginner or a seasoned player, our game offers endless fun and challenge. Play solo against AI or compete with your friends in exciting multiplayer matches. With intuitive controls, customizable difficulty levels, and dynamic gameplay, every match will keep you on the edge of your seat!</p>
//                             <img src="/image/Leonardo_Phoenix_Create_a_visually_stunning_image_of_a_muscula_2.jpg" alt="Ping Pong Gameplay" class="floating-image">
//                         </div>
//                     </section>

//                     <div class="image-marquee">
//                         <marquee behavior="scroll" direction="left" scrollamount="6">
//                             <div class="marquee-item">
//                                 <img src="/image1.jpg" alt="Image 1" width="150" height="150">
//                                 <p>Name 1</p>
//                             </div>
//                             <div class="marquee-item">
//                                 <img src="/image2.jpg" alt="Image 2" width="150" height="150">
//                                 <p>Name 2</p>
//                             </div>
//                             <div class="marquee-item">
//                                 <img src="/image3.jpg" alt="Image 3" width="150" height="150">
//                                 <p>Name 3</p>
//                             </div>
//                             <div class="marquee-item">
//                                 <img src="/image4.jpg" alt="Image 4" width="150" height="150">
//                                 <p>Name 4</p>
//                             </div>
//                         </marquee>
//                     </div>

//                     <section id="features" class="section scroll-reveal">
//                         <div class="content-box">
//                             <h2 class="slide-in-left">Game Features</h2>
//                             <ul class="feature-list">
//                                 <li class="pop-in delay-1">Single-Player & Multiplayer Modes</li>
//                                 <li class="pop-in delay-2">Adjustable Difficulty Settings</li>
//                                 <li class="pop-in delay-3">Engaging Animations & Fun Power-Ups</li>
//                                 <li class="pop-in delay-4">Realistic Table Tennis Physics</li>
//                             </ul>
//                         </div>
//                         <div class="image-sr">
//                             <img src="/image/Leonardo_Phoenix_Create_a_visually_stunning_image_of_a_muscula_2.jpg" alt="Ping Pong Gameplay" class="floating-image">
//                         </div>
//                     </section>

//                     <section id="how-to-play" class="section scroll-reveal">
//                         <div class="content-box">
//                             <h2>How to Play</h2>
//                             <p>Use simple controls to move your paddle, serve the ball, and return shots. The goal is to outsmart your opponent and score points by landing the ball on their side of the table. Watch out for special power-ups that can turn the tide of the game!</p>
//                         </div>
//                     </section>

//                     <section id="get-started" class="section scroll-reveal">
//                         <div class="content-box">
//                             <h2>Get Started</h2>
//                             <p>Click below to dive into the action and experience the thrill of ping pong right at your fingertips. Get ready to serve, rally, and dominate the table!</p>
//                             <a href="#" class="cta-button">Start Playing Now</a>
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         `;
//     }

//     // Function to initialize animations after rendering
//     async postRender() {
//         const sections = document.querySelectorAll('.scroll-trigger');

//         const observerOptions = {
//             root: null,
//             rootMargin: '0px',
//             threshold: 0.1
//         };

//         const observer = new IntersectionObserver((entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('scroll-active');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, observerOptions);

//         sections.forEach(section => {
//             observer.observe(section);
//         });

//         // Add index to feature list items for staggered animation
//         const featureItems = document.querySelectorAll('#features .feature-list li');
//         featureItems.forEach((item, index) => {
//             item.style.setProperty('--item-index', index);
//         });
//     }

//     async inAuthpages() {
//         return true;
//     }
// }

import AbstractView from "../js/AbstractView.js";
import WebSocketManager from "../js/Websocket.js";
import { SetCookie } from "../js/tools.js";

export default class extends AbstractView {
    constructor() {
        super();
        console.log("Logout constructor called");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        SetCookie('access_token', null);
        SetCookie('refresh_token', null);
        console.log("Logged out and closed all WebSockets");
        WebSocketManager.closeAllSockets();
        this.setTitle("Logout");
    }

    async searchHandle() {
        // Logic for handling search functionality if needed
    }

    async getSidebar() {
        return ``; // Optional: return a sidebar if needed
    }

    async getHtml() {
        return `
            <div class="container-lander">
                <header class="h-colx">
                    <div class="hser">
                        <div class="logo-colx">
                            <img src="static/images/Untitled design.png" alt="Logo">
                        </div>
                        <nav>
                            <ul>
                                <li><a href="#welcome">Home</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#get-started">Get Started</a></li>
                            </ul>
                        </nav>
                        <div class="auth-buttons">
                            <button><a href="/login" data-link="">Login again</a></button>
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
                        <img src="static/images/aad.png" alt="Ping Pong Player">
                    </div>

                    <section id="welcome" class="section scroll-reveal">
                        <div class="content-box">
                            <p>Are you ready to test your reflexes and skills in the fast-paced world of ping pong ? Whether you're a beginner or a seasoned player, our game offers endless fun and challenge. Play solo against AI or compete with your friends in exciting multiplayer matches. With intuitive controls, customizable difficulty levels, and dynamic gameplay, every match will keep you on the edge of your seat!</p>
                            <img src="static/images/addd.png" alt="Ping Pong Gameplay" class="floating-image">
                        </div>
                    </section>

                    <div class="image-marquee">
                        <div class="anime-name">
                            <h1> 🏓 </h1>
                            <h1>Ping Pong Game! </h1>
                            <h1> 🏓 </h1>
                            <h1>Ping Pong Game! </h1>
                            <h1> 🏓 </h1>
                            <h1>Ping Pong Game! </h1>
                            <h1> 🏓 </h1>
                            <h1>Ping Pong Game! </h1>
                             <h1> 🏓 </h1>
                            <h1>Ping Pong Game! </h1>
                            <h1> 🏓 </h1>
                        </div>
                    </div>

                    <section id="features" class="section scroll-reveal">
                        <div class="content-box">
                            <h2 class="slide-in-left">Game Features</h2>
                            <ul class="feature-list">
                                <li class="pop-in delay-1">Single-Player & Multiplayer Modes</li>
                                <li class="pop-in delay-2">Adjustable Difficulty Settings</li>
                                <li class="pop-in delay-3">Engaging Animations & Fun Power-Ups</li>
                                <li class="pop-in delay-4">Realistic Table Tennis Physics</li>
                            </ul>
                        </div>
                        <div class="image-sr">
                            <img src="static/images/_afebd3b8-c13b-4dbb-bd56-632bcc0be2f1.jpeg">
                        </div>
                    </section>

                    <section id="get-started" class="section scroll-reveal">
                        <div class="content-box">
                            <h2>Get Started</h2>
                            <p>Click below to dive into the action and experience the thrill of ping pong right at your fingertips. Get ready to serve, rally, and dominate the table!</p>
                            <a href="/login" class=" btn cta-button">Start Playing Now</a>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    

    // async postRender() {
    //     const sections = document.querySelectorAll('.scroll-trigger');
  
    //     const observerOptions = {
    //         root: null,
    //         rootMargin: '0px',
    //         threshold: 0.1
    //     };
  
    //     const observer = new IntersectionObserver((entries, observer) => {
    //         entries.forEach(entry => {
    //             if (entry.isIntersecting) {
    //                 entry.target.classList.add('scroll-active');
    //                 observer.unobserve(entry.target);
    //             }
    //         });
    //     }, observerOptions);
  
    //     sections.forEach(section => {
    //         observer.observe(section);
    //     });
  
    //     // Add index to feature list items for staggered animation
    //     const featureItems = document.querySelectorAll('#features .feature-list li');
    //     featureItems.forEach((item, index) => {
    //         item.style.setProperty('--item-index', index);
    //     });
  
    //     // Add hover effect to CTA button
    //     const ctaButton = document.querySelector('#get-started .cta-button');
    //     if (ctaButton) {
    //         ctaButton.addEventListener('mouseover', () => {
    //             ctaButton.style.setProperty('--hover', '1');
    //         });
    //         ctaButton.addEventListener('mouseout', () => {
    //             ctaButton.style.setProperty('--hover', '0');
    //         });
    //     }
    // }

    async inAuthpages() {
        return true;
    }
}
