import React, { useState } from "react";
import {useAtomValue, useSetAtom} from 'jotai';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {Link} from 'react-router-dom'
import { useAuth } from "./AuthContext";
import { FormControl, Input, FormLabel, Button } from "@mui/material";
import { authAtom, loginOrRegister } from "../../../store/atoms";
import GoogleLoginComponent from './GoogleLoginComponent'

interface LoginRegisterFormProps {
    path: string;
    linkText: string;
    route: string;
    header: string;
}

const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({ path, linkText, route, header }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login } = useAuth(); 
  const authError = useAtomValue(authAtom).error
  const logOrReg = useSetAtom(loginOrRegister)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const data = await logOrReg({formData, route})
      login(data);
    } catch (err: any){
      console.error(err)
    }
  };

  debugger

  return (
    <>
    <h1>{header}</h1>
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <FormLabel htmlFor="username" required>Username</FormLabel>
        <Input name="username" id="username" type="text" value={formData.username} onChange={handleChange}/>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel htmlFor="password" required >Password</FormLabel>
        <Input name="password" id="password" type="password" value={formData.password} onChange={handleChange}/>
      </FormControl>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
    {authError 
      ? <p style={{color: 'red'}}>{authError.code}:{authError.message}</p>
      : null
    }
    <br/>
    <Link className="formRedirect" to={path}>{linkText}</Link>
    <div className="googleAuthContainer">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLoginComponent/>
      </GoogleOAuthProvider> 
    </div>
    </>
  );
};

export default LoginRegisterForm;