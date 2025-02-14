import {useAtomValue} from 'jotai';
import { authAtom } from '../../store/atoms/';
import {Button} from '@mui/material'

const Profile= () => {
    const {username, email, isPro} = useAtomValue(authAtom).user
    return (
    <div>
        <h1> Profile</h1>   
        <p>Username: {username || "N/A"}</p> 
        <p>Email: {email}</p> 

        <Button>{isPro ? "Downgrade Account" : "Upgrade to Pro"}</Button>

    </div>
    );
}

export default Profile;