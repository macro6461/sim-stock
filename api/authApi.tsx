import axios from "axios";
import {SimStockError} from './types'

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
            let err = extractError(error, "Unable to Log In.")
            throw err;
        }
    }
}

const extractError = (error: any, details: string) => {
    let code = error.code || error.response.data.code
    let message = error.message || error.response.data.message
    return {code, message, details} as SimStockError; 
}