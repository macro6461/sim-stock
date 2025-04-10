import {useAtomValue, useSetAtom} from 'jotai';
import { authAtom } from '../../store/atoms/';
import {Button} from '@mui/material'
import { useEffect, useState } from 'react';
import {getSavedSims, deleteSavedSim} from '../../store/atoms/'
import DeleteIcon from "@mui/icons-material/Delete"
import ConfirmationModal from './ConfirmationModal'
import { SavedSim } from '../../api';

const Profile = () => {
    const {username, email, isPro} = useAtomValue(authAtom).user;
    const [selectedSim, setSelectedSim] = useState<null | string>(null)
    const savedSims = useAtomValue(authAtom).savedSims;
    const getSavedSimulations = useSetAtom(getSavedSims)
    const submitDelete = useSetAtom(deleteSavedSim)

    useEffect(()=>{
        getSavedSimulations()
    }, [])

    const deleteSim = (id: string) =>{
        submitDelete({simulationId: id})
        setSelectedSim(null)
    }

    return (
    <div>
        <h1> Profile</h1>   
        <p>Username: {username || "N/A"}</p> 
        <p>Email: {email}</p> 
        <Button>{isPro ? "Downgrade Account" : "Upgrade to Pro"}</Button>
        <h4>Saved Simulations</h4>
        {savedSims && savedSims.map((x: SavedSim, index) => {
            return <p key={index}>{x.userId} <DeleteIcon onClick={()=>setSelectedSim(x._id)}/></p>
        })}
        <ConfirmationModal text="Are you sure you want to delete this simulation?" close={()=>setSelectedSim(null)} callback={selectedSim ? () => deleteSim(selectedSim) : null} isOpen={!!selectedSim}/>
    </div>
    );
}

export default Profile;