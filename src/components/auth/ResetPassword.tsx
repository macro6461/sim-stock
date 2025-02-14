import React, { useState } from "react";
import {useAtomValue} from 'jotai';
import {Link} from 'react-router-dom'
import { FormControl, Input, FormLabel, Button } from "@mui/material";
import { authAtom } from "../../../store/atoms";

interface LoginRegisterFormProps {
    path: string;
    linkText: string;
    route: string;
    header: string;
}

const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({ }) => {
  const [formData, setFormData] = useState({ email: "", emailConfirm: ""});
  const authError = useAtomValue(authAtom).error
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // TO DO: Add API request for updating the password.
  };

  return (
    <>
    <h1>Forgot Password</h1>
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <FormLabel htmlFor="email" required>Email</FormLabel>
        <Input name="email" id="email" type="email" value={formData.email} onChange={handleChange}/>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel htmlFor="email-confirm" required >Confirm Email</FormLabel>
        <Input name="email-confirm" id="email-confirm" type="email" value={formData.emailConfirm} onChange={handleChange}/>
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
    <Link className="formRedirect" to={'/login'}>Login</Link>
    </>
  );
};

export default LoginRegisterForm;