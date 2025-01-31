import {useAtomValue, useSetAtom} from 'jotai';
import { authAtom } from '../../store/atoms/';

const Profile= () => {
    const {username, email} = useAtomValue(authAtom).user
    return (
    <div>
        <h1> Profile</h1>   
        <p>Username: {username || "N/A"}</p> 
        <p>Email: {email}</p> 
    </div>
    );
}

export default Profile;