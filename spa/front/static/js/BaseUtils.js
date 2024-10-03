import { tokenIsValid } from "./index.js";
import { getCookie } from "./tools.js";
import { messageHandling } from "./utils.js";

export function setActiveLink(activeLink, pageTitle) {
    activeLink.forEach((element) => {
        element.active = (element.name === pageTitle) ? "active" : "";
    });
}

async function responseCheckStatus(status){
    if (status == 401) {
        return await tokenIsValid();
    }
    return 1;
}
export async function fetchDataBase(url, method = 'GET', body = null) {
    try {
      const headers = {
        'Authorization': `Bearer ${getCookie("access_token")}`,
        'Content-Type': 'application/json'
      };
  
      const options = { method, headers };
      if (body) options.body = JSON.stringify(body);
  
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('An error occurred:', error);
    //   messageHandling('error', error.message);
      throw error;  // Re-throw the error to handle it in individual methods
    }
  }
  