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

        let res = await authApi.verifyToken(token, callback);
        
        debugger
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
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



  