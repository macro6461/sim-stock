import { createContext, useState, useContext, ReactNode, useEffect} from 'react';
import {useAtomValue, useSetAtom} from 'jotai';
import { useNavigate, useLocation} from "react-router-dom";
import { authAtom, verifyToken } from '../../../store/atoms/';
import { AuthContextType } from '../../../api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const verifyTok = useSetAtom(verifyToken)
    const authErr = useAtomValue(authAtom).error

    useEffect(() => {
        // Check localStorage for token
        const token = localStorage.getItem("token");
        if (token) {
            verifyTok({token, callback: handleSetAuth});
        }
    }, []);

    const handleSetAuth = (arg: boolean) => {
        setIsAuthenticated(arg)
        if (arg){
            let url = location.pathname.indexOf("login") > -1 || location.pathname.indexOf("register") > -1 ? "simulate" : location.pathname
            navigate(url)
        } else {
            localStorage.removeItem("token");
        }
    }

    const login = (token: string) => {
        localStorage.setItem("token", token);
        handleSetAuth(true)
    };

    const logout = () => {
        handleSetAuth(false)
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authErr }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};