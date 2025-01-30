import {atom} from 'jotai';
import { SimStockError, authApi } from '../../api';

interface AuthState {
    username: string | null,
    isLoggedIn: boolean;
    error?: SimStockError | null;
  }
  
export const authAtom = atom<AuthState>({
    username: null,
    isLoggedIn: false,
})

export const verifyToken = atom(
    null, // No read function, this is a write-only atom
    async (_get, set, req: {token: string, callback: (arg:boolean)=>void}) => {
      try {
        // Call the authApi to verify token
        let {token, callback} = req;

        let {user} = await authApi.verifyToken(token, callback);
        let {username} = user
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
          username,
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

        let {username, token} = await authApi.loginOrRegister(formData, route);
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
          username,
          isLoggedIn: true,
          error: null,
        }));
        return token;
      } catch (error: any) {
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code: error.code, message: error.message} as SimStockError  || 'Failed to verify token.',
        }));
        throw error;
      }
    }
  );


  