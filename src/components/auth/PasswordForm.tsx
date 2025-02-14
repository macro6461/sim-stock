import {useState, useEffect} from 'react'
import {FormControl, Input, FormLabel, Button} from "@mui/material";
import {GenericObject} from '../../../api'
import {  FormEventHandler } from "react";

interface PasswordFormProps {
    handleSubmit: FormEventHandler<HTMLFormElement>;
    formData: GenericObject;
    property: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>)=>void;
    title: string;
}

const PasswordForm : React.FC<PasswordFormProps> = ({ property, handleSubmit, formData, title, handleChange}) =>{
    const [enable, setEnable] = useState(false)
    const [showDontMatch, setShowDontMatch] = useState(false)
    const [showTooShort, setShowTooShort] = useState(false)
    let newProperty = property.toLowerCase()
    let secondProperty = newProperty + "Confirm"

    useEffect(()=>{
        handleValidate()
    }, [formData])

    const handleValidate = () =>{
        if (newProperty === 'password'){
            if (formData[newProperty] === formData[secondProperty]){
                setShowDontMatch(false)
                setEnable(true)
            } else {
                setShowDontMatch(true)
                setEnable(false)
            }

            if (formData[newProperty].length < 8){
                setShowTooShort(true)
            } else {
                setShowTooShort(false)
            }
        } else {
            setEnable(true)
        }
    }
    
    return (
    <>
        <h1>{title}</h1>
        <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
            <FormLabel htmlFor={newProperty} required>{property}</FormLabel>
            <Input name={newProperty} id={newProperty} type={newProperty} value={formData[newProperty]} onChange={handleChange}/>
        </FormControl>
        {
            newProperty === "password" 
                ?   <FormControl fullWidth margin="normal">
                        <FormLabel htmlFor={secondProperty} required >Confirm {property}</FormLabel>
                        <Input name={secondProperty} id={secondProperty} type={newProperty} value={formData[secondProperty]} onChange={handleChange} disabled={formData[newProperty].length < 8}/>
                    </FormControl>
                : null
        }
        <Button type="submit" variant="contained" disabled={!enable}>
            Submit
        </Button>
        </form>
        {showTooShort ? <p style={{color: 'red'}}> Password must be at least 8 characters long.</p> : null}
        {showDontMatch ? <p style={{color: 'red'}}>Passwords don't match!</p> : null}
        <br/>
    </>
  );
}

export default PasswordForm;