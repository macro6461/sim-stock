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
  const [formData, setFormData] = useState({ email: "", password: ""});
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

  return (
    <>
    <h1>{header}</h1>
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <FormLabel htmlFor="email" required>Email</FormLabel>
        <Input name="email" id="email" type="email" value={formData.email} onChange={handleChange}/>
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
      ? <div className="errorContainer" >
          <p><span>Code:</span> {authError.code}</p>
          <p><span>Message:</span> {authError.message}</p>
          {authError.details ? <p><span>Details:</span> {authError.details}</p> : null}
        </div>
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