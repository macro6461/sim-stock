import {atom} from 'jotai';
import { SimStockError, authApi, User } from '../../api';

interface AuthState {
    user: User;
    isLoggedIn: boolean;
    error?: SimStockError | null;
  }
  
export const authAtom = atom<AuthState>({
    user: {username: '', email: ''} as User,
    isLoggedIn: false,
})

export const verifyToken = atom(
    null, // No read function, this is a write-only atom
    async (_get, set, req: {token: string, callback: (arg:boolean)=>void}) => {
      try {
        // Call the authApi to verify token
        let {token, callback} = req;

        let {user} = await authApi.verifyToken(token, callback);
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
          user,
          isLoggedIn: true,
          error: null,
        }));
      } catch (error: any) {
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code: error.code, message: error.message} as SimStockError  || 'Failed to verify token.',
        }));
      }
    }
  );
  
  export const loginOrRegister = atom(
    null, // No read function, this is a write-only atom
    async (_get, set, req: {formData: any, route: string}) => {
      try {
        // Call the authApi to verify token

        let {formData, route} = req;

        let {user, token} = await authApi.loginOrRegister(formData, route);
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
          user,
          isLoggedIn: true,
          error: null,
        }));
        return token;
      } catch (error: any) {
        let {code, message, details} = error
        debugger
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code, message, details} as SimStockError  || 'Failed to Login/Register.',
        }));
        throw error;
      }
    }
  );

  
  export const googleAuthLogin = atom(
    null, // No read function, this is a write-only atom
    async (_get, set, req: any) => {
      try {
        // Call the authApi to verify token

        let {user, token} = await authApi.googleAuthLoginOrRegister(req);
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
          user,
          isLoggedIn: true,
          error: null,
        }));
        return token;
      } catch (error: any) {
        let {code, message, details} = error;
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code, message, details} as SimStockError  || 'Failed to Google Authenticate.',
        }));
        throw error;
      }
    }
  );

  