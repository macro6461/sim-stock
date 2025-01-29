import {SimStockError} from './types'

export const authApi = {
    async verifyToken(token: string, callback: (arg:boolean)=>void){
        try {
            console.log("YESSSS")
        const response = await fetch("http://localhost:1993/", {
            method: "GET",
            headers: { Authorization: token },
        });

        debugger
    
        if (response.ok) {
            callback(true);
        } else {
            callback(false);
        }
        } catch (error) {
            callback(false);
            let err = extractError(error)
            return err;
        }
    }
}

const extractError = (error: any) => {
    let code = error.code || error.response.data.code
    let message = error.message || error.response.data.message
    return {code, message: "Token verification failed", details: message} as SimStockError; 
}