import React, { useState } from "react";
import {useAtomValue} from 'jotai';
import { authAtom } from "../../../store/atoms";
import PasswordForm from "./PasswordForm";
import PinForm from "./PinForm";


const ForgotPassword = () => {
    const [useEmailForm, setUseEmailForm] = useState(true)
    const [emailFormData, setEmailFormData] = useState({ email: "", emailConfirm: ""});
    const [newPassFormData, setNewPassFormData] = useState({ password: "", confirmPassword: ""});
    const [emailSubmitted, setEmailSubmitted] = useState(false)
    const authError = useAtomValue(authAtom).error

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailFormData({ ...emailFormData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassFormData({ ...newPassFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (useEmailForm){
            setEmailSubmitted(true)
        } else {

        }

        // TO DO: add API request for submitting email.

    };

    const handleValidatePin = () => {
        // TO DO: add API request for validating PIN number.
        setUseEmailForm(false)
    }

    return (
        <>
        {useEmailForm 
            ? <>
                {emailSubmitted 
                    ? <PinForm handleValidatePin={handleValidatePin}/>
                    : <PasswordForm title="Forgot Password" property="Email" handleChange={handleEmailChange} formData={emailFormData} handleSubmit={handleSubmit}/>
                }
            </>
            : <PasswordForm title="New Password" property="Password" handleChange={handlePasswordChange} formData={newPassFormData} handleSubmit={handleSubmit}/>
        }
        {authError 
        ? <div className="errorContainer" >
            <p><span>Code:</span> {authError.code}</p>
            <p><span>Message:</span> {authError.message}</p>
            {authError.details ? <p><span>Details:</span> {authError.details}</p> : null}
            </div>
        : null
        }
        </>
    );
};

export default ForgotPassword;