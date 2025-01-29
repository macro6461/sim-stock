import React, { useState } from "react";
import {useAtomValue, useSetAtom} from 'jotai';
import {Link} from 'react-router-dom'
import axios from "axios";
import { useAuth } from "./auth/AuthContext";
import { FormControl, Input, FormLabel, Button } from "@mui/material";
import { authAtom } from "../../store/atoms";

interface MyFormProps {
    path: string;
    linkText: string;
    route: string;
}

const MyForm: React.FC<MyFormProps> = ({ path, linkText, route }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login } = useAuth(); 
  const authError = useAtomValue(authAtom).error
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    debugger
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:1993/${route}`, formData);
      localStorage.setItem("token", response.data.token)
      login(response.data.token);
    } catch (error: any) {
        let code = error.code || error.response.data.code
        let message = error.message || error.response.data.message
        console.error(`${code}: `, `${message}`);
    }
  };

  return (
    <>
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
    <Link to={path}>{linkText}</Link>
    </>
  );
};

export default MyForm;