import {SimStockError} from '../api'
export * from './stockApi';
export * from './types';
export * from './authApi';
export const extractError = (error: any, title: string) => {
    let code = error.code
    code = `${title}: ${code}`
    let message = error.message
    let details = error.details || (error.response ? error.response.data.message : "N/A")
    return {code, message, details} as SimStockError; 
}