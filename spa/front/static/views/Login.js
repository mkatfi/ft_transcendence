import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";
import { creatNotificationSocket } from "../js/utils.js";

import { messageHandling } from "../js/utils.js";
export default class extends AbstractView {
    constructor() {
        super();
        console.log("Login constructor called");

        this.setTitle("Login");
    }

    async getHtml() {
        return `
        
        <div class="kolx d-flex justify-content-center align-items-center">
        <div class="container_login" id="container_login">
            <div class="form-container sign-up">
                <form class="register-input" action=""  method="post" >
                    <h1>Create Account</h1>

                    <div class="social-icons   "  >
                        <a  class="login-with-intra  " >
                            <img    src="https://profile.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg" alt="">
                        </a>
                    </div>
                    <span>or use your email for registeration</span>
                        <div class="input-box">
                            <input type="text"
                            name="username"
                            placeholder="Enter Username"/>
                            <i class='bx bxs-user'></i>
                        </div>
                        <div class="input-box">
                            <input type="text" name="first_name" required placeholder="Enter First Name"/>
                            <i class='bx bxs-user'></i>
                        </div>
                        <div class="input-box">
                            <input type="text"

                            name="last_name"
                            placeholder="Enter Last Name"/>
                            <i class='bx bxs-user'></i>
                        </div>
                        <div class="input-box">
                            <input type="email"
                            name="email"
                            placeholder="Enter Email"/> 
                            <i class='bx bxs-envelope'></i>
                        </div>
                        <div class="input-box">
                            <input type="password"
                            name="password1"
                            placeholder="Enter Password"/>
                            <i class='bx bxs-lock-alt'></i>
                        </div>
                        <div class="input-box">
                            <input type="password"
                            name="password2"
                            placeholder="Confirm Password"/>
                            <i class='bx bxs-lock'></i>
                        </div>
                        <button   type="submit" class="sigin" value="SIGIN UP">Sign Up</button>
                        <div class="pragraph_UP">
                            <button class="hidden" id="login">Sign In</button>
                        </div> 
                    </form>
                </div>


                <div class="form-container sign-in" >
                    <form class="login-input" action=""  method="post"  >
                        <h1>Sign In</h1>
                        <div class="social-icons">     
                            <a class="login-with-intra ">
                                <img class="login-with-intra pe-auto"   src="https://profile.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg" alt="">
                            </a>
                        </div>
                        <span>or use your email password</span>
                            <div class="input-box">
                                <input  type="text" name="username"  placeholder="Enter Username" required>
                                <i class='bx bxs-user'></i>
                            </div>
                            <div class="input-box">
                                <input type="password" name="password"  placeholder="Enter Password" required>
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                    <div class="remember-forgot">
                        <label>
                            <input type="checkbox"> Remember me
                        </label>
                        <a href="#">Forgot Password ?</a>
                    </div>
                    <button  type="submit" class="signin" value="SIGN IN">Sign In</button>
                    <div class="pragraph_up">
                        <button type="button" class="hidden" id="register">Sign Up</button>
                    </div> 
                        
                </form>
            </div>

            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-left">      
                        <div class="pragraph">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                        </div>
                        <div class="dawn">
                            <div class="pingpong">
                                <div class="table-ping">
                                    <div class="line"></div>
                                    <div class="net-top"></div>
                                    <div class="net-middle"></div>
                                    <div class="net-bottom"></div>
                                    <div class="net-shadow"></div>
                                </div>
                                <div class="c1">
                                    <div class="b1"></div>
                                </div>
                                <div class="c2">
                                    <div class="b2"></div>
                                </div>
                                <div class="c3">
                                    <div class="b3"></div>
                                </div>
                                <div class="c4">
                                    <div class="b4"></div>
                                </div>
                                <span class="ping">PING</span>
                                <span class="pong">PONG</span>
                            </div>
                        </div>
                    </div>
                    <div class="toggle-panel toggle-right">
                    
                    <div class="pragraph">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                    </div> 
                        <div class="dawn">
                            <div class="pingpong">
                                <div class="table-ping">
                                    <div class="line"></div>
                                    <div class="net-top"></div>
                                    <div class="net-middle"></div>
                                    <div class="net-bottom"></div>
                                    <div class="net-shadow"></div>
                                </div>
                                <div class="c1">
                                    <div class="b1"></div>
                                </div>
                                <div class="c2">
                                    <div class="b2"></div>
                                </div>
                                <div class="c3">
                                    <div class="b3"></div>
                                </div>
                                <div class="c4">
                                    <div class="b4"></div>
                                </div>
                                <span class="ping">PING</span>
                                <span class="pong">PONG</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> `;
    }

    async loginUser(event) {
        event.preventDefault();
    
        const formdata = new FormData(event.target);
        const data = Object.fromEntries(formdata.entries());
    
        try {
            const response = await fetch(`/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
    
            if (response.ok) {
                localStorage.setItem('access_token', responseData.access);
                localStorage.setItem('refresh_token', responseData.refresh);
                console.log('User login successfully', responseData);

                navigateTo("/home");
            } else {
                console.log(responseData);
                messageHandling("error",responseData.detail);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async  registerUser(event) {
        
        event.preventDefault();
        
        const formdata = new FormData(event.target);
        const data = Object.fromEntries(formdata.entries());
        
        console.log(data);
        for (const [key, value] of formdata) {
            console.log([key, value]);
        }
    
        try {
            const response = await fetch(`/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                console.log('User registered successfully', responseData);
                navigateTo("/login");
            } else {
                console.error('Registration failed', responseData);
                messageHandling("error",`${Object.keys(responseData)[0]} : ${ Object.values(responseData)[0]}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async searchHandle()
    {
        
    }   
    async getSidebar() {
        
        return ``;
    }

    async authorizeIntra() {
        window.location.href = "/api/rauth/intra_authorize";
    }

    async loginWithIntra() {
        await this.authorizeIntra();
    }

    afterRender() {
        document.querySelector(".login-input").addEventListener("submit", this.loginUser.bind(this));
        document.querySelectorAll(".login-with-intra").forEach((e)=>{   e .addEventListener("click", this.loginWithIntra.bind(this));   });                 
        document.querySelector(".register-input").addEventListener("submit", this.registerUser.bind(this));

        const container = document.getElementById('container_login');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });

        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }
}
