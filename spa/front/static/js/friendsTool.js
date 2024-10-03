import { tokenIsValid } from "./index.js";
import { getCookie } from "./tools.js";
import { messageHandling } from "./utils.js";

// Utility to handle fetch errors and messages
 export async function handleResponse(response) {
    const responseData = await response.json();
    if (response.ok) {
      const keyserr = Object.keys(responseData)[0];
      const valueerr = Object.values(responseData)[0];
       messageHandling(keyserr, valueerr);
      return responseData;
    } else if (response.status === 401) {
      await tokenIsValid();
      messageHandling("info", "Something went wrong, please try again!");
    } else {
      const keyserr = Object.keys(responseData)[0];
      const valueerr = Object.values(responseData)[0];
      messageHandling(keyserr, valueerr);
      throw new Error(responseData);
    }
  }
  
  // Utility to perform fetch requests
 export async function fetchWithAuth(url, method = 'POST', data = null) {
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${getCookie("access_token")}`
      }
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return await fetch(url, options);
  }
  

  export function createUserClone(pr, classStat, reqId) {
    let temp = document.querySelector(".all-users-template");
    let prClone = temp.content.cloneNode(true);
    
    prClone.querySelector(".add-manage").innerHTML = classStat;
    prClone.querySelector(".add-manage a").idTargetUser = pr.user.id;
    prClone.querySelector(".add-manage a").idTargetReq = reqId;
    prClone.querySelector(".add-manage").idTargetReq = reqId;
    
    prClone.querySelector(".txt-c img").src = pr.avatar;
    prClone.querySelector(".txt-c h4").innerHTML = pr.user.username;
    prClone.querySelector(".go-profile").idTargetUser = pr.user.id;
  
    return prClone;
  }