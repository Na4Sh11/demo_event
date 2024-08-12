import authConfig from '../auth_config.json';
import { useAuth0 } from '@auth0/auth0-react';


//const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently, isLoading, handleRedirectCallback } = useAuth0();
const requestedScopes = ["openid", "profile", "email"];

class TokenUtil {
    constructor() {
      this.token = null;
    }
  
    setToken(token) {
      console.log("Setting token:", token);
      this.token = token;
      console.log("Stored token:", this.token);
    }
  
    getToken() {
      console.log("Retrieving token:", this.token);
      return this.token;
    }
  
    clearToken() {
      console.log("Clearing token");
      this.token = null;
    }
  }
  
  export default new TokenUtil();
    // async fetchToken() {
    //   if (!this.token) {
    //     this.token = await getAccessTokenSilently({
    //       authorizationParams: {
    //         audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
    //         scope: requestedScopes.join(" "),
    //       },
    //     });
    //   }
    //   return this.token;
    // }
  
//     getToken() {
//       return this.token;
//     }

//     setToken(token){
//         console.log(token);
//         this.token = token;
//         console.log(this.token);
//     }
  
//     clearToken() {
//       this.token = null;
//     }
//   }
  
//   export default new TokenUtil();