import AbstractView from "../js/AbstractView.js";
import { navigateTo, tokenIsValid } from "../js/index.js";
import { getCookie } from "../js/tools.js";

import { messageHandling , CostumConfigDialog} from "../js/utils.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Settings");
        this.pageTitle = "SETTINGS";

   }


   
    async getHtml() {
        await this.setPayload();
        await this.setData();
        console.log("payload   in html ", this.payload);
        const headernav = await this.getHeader();
        return headernav  +   `  
        <div class="content_setting ">
            <div class="main-content p-4 m-1">
                <h1 class="position-relative mb-1">Settings</h1>
                <form method="post"  action="" class="profileinfo">
                <div class="profile-picture-container  image-container">
                    <img src="${this.data.avatar}" alt="Profile Picture" class="profile-picture" id="profile-image"  >
                    <div id="test">
                        <label class="edit-button " for="file-input2" id="edit-profile-picture">Edit</label>
                        <input type="file" id="file-input2" name="avatar" class="form-control-file  form-control-file" hidden accept="image/*" id="id_avatar" >
                    </div>
                </div>
        </form>
        <h3>Details</h3>
        <form method="post" class="userinfo"   action="">
                <div class="profile-section two-column">
                    <div class="input-group">
                        <label for="firstname">First Name</label>
                        <input  type="text" name="first_name" value="${this.data.user.first_name}"  maxlength="100" " id="firstname"">
                    </div>
                    <div class="input-group">
                        <label for="last_name">Last Name</label>
                        <input  type="text" name="last_name" value="${this.data.user.last_name}"  maxlength="100"  id="lastname"">
                    </div>
                </div>
                <div class="profile-section two-column">
                    <div class="input-group">
                        <label for="User">User Name</label>
                        <input type="text" name="username" value="${this.data.user.username}" maxlength="100" id="id_username">
                    </div>
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="text" name="email" value="${this.data.user.email}"  maxlength="320"  id="id_email">
                    </div>
                </div>
               
                <button type="submit" >Update</button>
                <button type="reset" >Reset</button>
            </form>

<h3 class="mt-5">Change Password</h3>

<form method="post" class=" changepassword"   action="">
<div class="profile-section two-column">

    <div class="input-group">
        <label for="oldpassword">Current Password</label>
        <input  type="password" name="oldpassword" required id="oldpassword"">
    </div>

    <div class="input-group">
        <label for="newpassword">New Password</label>
        <input  type="password" name="newpassword" required id="newpassword"">
    </div>
</div>
<button type="submit" >Update</button>
<button type="reset" >Reset</button>
</form>




            </div>

        </div>
        
        
        
            `;
    }
    async updateProfile(event){

        event.preventDefault();
        console.log("inside funstin update paylo",this.payload)
        let access_token = getCookie("access_token")
        const formdata = new FormData(event.target);
        try {
            const response = await fetch(`/api/profile/${this.payload.user_id}/`,
                {
                    method: 'PUT',
                    headers: {
                    'Authorization': `Bearer ${access_token}`
                    },
                    body: formdata
                }
            );
            
            const responseData = await response.json();
            if (response.ok) {
                console.log('Avatar updated successfully', responseData);
                navigateTo("/profile")
            }
            else if(response.status == 401){
                tokenIsValid();
                messageHandling("info", "Session refreshed. Please click  again.");
            }
            
            else {
                console.error('Update avatar failed', responseData);
            }

        } catch (error) {
            console.log("error :" ,error);
            
        }
    }



    async changepassword(event){

        event.preventDefault();
        console.log("inside funstin update paylo",this.payload)
        let access_token = getCookie("access_token")
        const formdata = new FormData(event.target);
        try {
            const response = await fetch(`/api/changepassword/${this.payload.user_id}/`,
                {
                    method: 'PUT',
                    headers: {
                    'Authorization': `Bearer ${access_token}`
                    },
                    body: formdata
                }
            );
            
            const responseData = await response.json();
            if (response.ok) {
                console.log('password updated susseful', responseData);
                const keyserr = Object.keys(responseData);    
                const valueerr = Object.values(responseData);  
                messageHandling(keyserr[0],valueerr[0]);
                navigateTo("/profile")
            }
            else if(response.status == 401){
                tokenIsValid();
                messageHandling("info", "Session refreshed. Please click  again.");
            }
            else {
                const keyserr = Object.keys(responseData);    
                const valueerr = Object.values(responseData);  
                messageHandling(keyserr[0],valueerr[0]);
                console.error('Update avatar failed', responseData);
            }

        } catch (error) {
            console.log("error :" ,error);
            
        }
    }


    async updateUser(event){
        event.preventDefault();
        console.log("inside funstin update paylo",this.payload)
        let access_token = getCookie("access_token")
        const formdata = new FormData(event.target);

        try {
            const response = await fetch(`/api/userupdate/`,
                {
                    method: 'PUT',
                    headers: {
                    'Authorization': `Bearer ${access_token}`
                    },
                    body: formdata
                }
            );
            
            const responseData = await response.json();
            if (response.ok) {
                console.log('Avatar updated successfully', responseData);
                navigateTo("/profile")
            } 
            else if(response.status == 401){
                tokenIsValid();
                messageHandling("info", "Session refreshed. Please click  again.");
            }
            else {
                console.error('Update avatar failed', responseData);
                messageHandling("error",`${Object.keys(responseData)[0]} : ${ Object.values(responseData)[0]}`);
            }

            } catch (error) {
                console.log("error :" ,error);
                
            }
        }

    afterRender() {
        document.querySelector(".profileinfo").addEventListener("submit",this.updateProfile.bind(this));
        document.querySelector(".userinfo").addEventListener("submit",this.updateUser.bind(this));
        document.querySelector(".changepassword").addEventListener("submit",this.changepassword.bind(this));
        let changeimg = document.querySelector(".form-control-file");
        changeimg.onchange = () => {
        const file = changeimg.files[0];
        this.updateProfileAvatar(file);
        };
    }



    async updateProfileAvatar(file) {
        let access_token = getCookie('access_token');
        const formData = new FormData();
            formData.append('avatar', file);
            // const data = Object.fromEntries(formData.entries());
            try {
                const response = await fetch(`/api/profile/${this.payload.user_id}/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${getCookie('access_token')}`
                    },
                    // body: JSON.stringify(data)
                    body: formData
                });
    
                const responseData = await response.json();
                if (response.ok) {
                  
                    console.log('Avatar updated successfully', responseData);
                    messageHandling("success",`${ Object.values(responseData)[0]}`);

                    
    
                    // refreshAccessToken();

                    navigateTo("/settings")
                } 
                else if(response.status == 401){
                    tokenIsValid();
                    messageHandling("info","somthing is wrong")
                }
                else {
                    messageHandling("error",`${Object.keys(responseData)[0]} : ${ Object.values(responseData)[0]}`);
                    console.error(`Update avatar failedff `, responseData);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
    }
    
}