import { GoogleLogin } from '@react-oauth/google';
import {useSetAtom} from "jotai"
import { googleAuthLogin } from "../../../store/atoms";
import { useAuth } from './AuthContext';

const GoogleLoginComponent = () => {
    const loginRegGoogle = useSetAtom(googleAuthLogin)
    const { login } = useAuth(); 

    const validateLogin = async (response:any) => {
        console.log("Google login success:", response);
        try {
            const data = await loginRegGoogle(response)
            debugger
            login(data);
          } catch (err: any){
            console.error(err)
          }
      };

  return (
    <GoogleLogin
      onSuccess={(response) =>validateLogin(response)}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
};

export default GoogleLoginComponent;