import { signout } from "./api-auth.js";
import { getCurrentUser } from "../user/api-user.js";

const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") return false;
    if (sessionStorage.getItem("jwt"))
      return JSON.parse(sessionStorage.getItem("jwt"));
    else return false;
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  async refreshUserInfo() {
    try {
      const jwt = this.isAuthenticated();
      if (!jwt) return false;
      
      const user = await getCurrentUser(jwt.token);
      if (user && !user.error) {
        const updatedJwt = {
          ...jwt,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        };
        sessionStorage.setItem("jwt", JSON.stringify(updatedJwt));
        return updatedJwt;
      }
      return false;
    } catch (err) {
      console.error('Failed to refresh user info:', err);
      return false;
    }
  },
  clearJWT(cb) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    cb(); //optional
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
};
export default auth;
