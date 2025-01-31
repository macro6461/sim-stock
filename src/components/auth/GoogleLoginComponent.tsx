import { GoogleLogin } from '@react-oauth/google';
import {useSetAtom} from "jotai"
import { googleAuthLogin } from "../../../store/atoms";
import { useAuth } from './AuthContext';

const GoogleLoginComponent = () => {
    const loginRegGoogle = useSetAtom(googleAuthLogin)
    const { login } = useAuth(); 

    const validateLogin = async (response:any) => {
        try {
            const data = await loginRegGoogle(response)
            login(data);
          } catch (err: any){
            console.error(err)
          }
      };

  return (
    <GoogleLogin
      onSuccess={(response) =>validateLogin(response)}
      onError={() => {
        console.log('Login/Registration Failed');
      }}
    />
  );
};

export default GoogleLoginComponent;