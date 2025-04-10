import {atom} from 'jotai';
import { SimStockError, authApi, User, SavedSim } from '../../api';

interface AuthState {
    user: User;
    isLoggedIn: boolean;
    error?: SimStockError | null;
    token?: string;
    savedSims?: SavedSim[];
  }
  
export const authAtom = atom<AuthState>({
    user: {username: '', email: ''} as User,
    isLoggedIn: false,
    savedSims: []
})

export const isProUser = atom((get)=> get(authAtom).user.isPro) 

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
          token,
          isLoggedIn: true,
          error: null,
        }));
      } catch (error: any) {
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code: error.code, message: error.message} as SimStockError,
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
          token
        }));
        return token;
      } catch (error: any) {
        let {code, message, details} = error
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code, message, details} as SimStockError,
        }));
        throw error;
      }
    }
  );

  export const deleteSavedSim = atom(null, // No read function, this is a write-only atom
    async (_get, set, req: {simulationId: string}) => {
      let {user, token} = await _get(authAtom)
      let deleteSim = await authApi.deleteSim(req.simulationId, user.id, token)
    })

  export const getSavedSims = atom(
    null, // No read function, this is a write-only atom
    async (_get, set) => {
      try {
        // Call the authApi to verify token

        let {user, token} = await _get(authAtom)

        let savedSims = await authApi.getSavedSims(user.id, token)
  
        // Update the state with the fetched data
        set(authAtom, (prev) => ({
          ...prev,
          savedSims: savedSims.simulations
        }));
        return token;
      } catch (error: any) {
        let {code, message, details} = error
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code, message, details} as SimStockError,
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
          token
        }));
        return token;
      } catch (error: any) {
        let {code, message, details} = error;
        // Handle errors and update the state accordingly
        set(authAtom, (prev) => ({
          ...prev,
          isLoggedIn: false,
          error: {code, message, details} as SimStockError,
        }));
        throw error;
      }
    }
  );

  