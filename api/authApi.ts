import axios from "axios";
import {extractError} from './'

export const authApi = {
    async verifyToken(token: string, callback: (arg:boolean)=>void){
        try {
        
            const response = await fetch("http://localhost:1993/", {
                method: "GET",
                headers: { Authorization: token },
            });

            if (response.ok) {
                callback(true);
            } else {
                callback(false);
            }
            return await response.json(); 
        } catch (error) {
            callback(false);
            return extractError(error, "Token verification failed.")
        }
    },
    async loginOrRegister(formData: any, route: string){
        try {
            const response = await axios.post(`http://localhost:1993/${route}`, formData);
            return response.data
        } catch (error) {
            let err = extractError(error, "Unable to Log In")
            throw err;
        }
    },
    async googleAuthLoginOrRegister(response: any){
        console.log("Google login success!");
        try {
            const res = await fetch("http://localhost:1993/google-login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: response.credential }),
              });
          
              const data = await res.json();
              return data;
        } catch (error:any){
            let err = extractError(error, "Unable to Sign In With Google.")
            throw err;
        }
        
    },
    async getSavedSims(userId: string, token?: string){
        try {
            const res = await fetch(`http://localhost:1993/${userId}/simulations`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token || "",
                },
              });
          
              const data = await res.json();
              return data;
        } catch (error:any){
            let err = extractError(error, "Unable to Get Sims.")
            throw err;
        }
        
    },
    async deleteSim(simulationId: string, userId: string, token?: string){
        debugger
        try {
            const res = await fetch(`http://localhost:1993/simulations/${simulationId}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token || "",
                },
              });
          
              const data = await res.json();
              return data;
        } catch (error:any){
            let err = extractError(error, "Unable to Delete Sim.")
            throw err;
        }
    }
}