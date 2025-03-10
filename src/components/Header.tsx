import {useState, useEffect} from 'react'
import {Button, Menu, MenuItem, Modal} from '@mui/material'
import {useAtomValue} from 'jotai';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { useAuth } from './auth/AuthContext';
import { authAtom } from '../../store/atoms';

const Header = () => {

    const [showLogout, setShowLogout] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isDum, setIsDum] = useState("Use Dummy")
    
      useEffect(()=>{
        if (localStorage.getItem('useDummy')){
          setIsDum("Use Real")
        }
      }, [])

    const user = useAtomValue(authAtom).user

    const { logout } = useAuth(); 

    const handleShowLogout = () =>{
        setShowLogout(!showLogout)
    }

    const handleShowMenu = (event:any) =>{
        setOpen(true)
        setAnchorEl(event.currentTarget);
    }

    const handleLogoutClose = () =>{
        setShowLogout(false)
    }


  const handleUseDummy = (useDum: string | null) =>{
    if (useDum){
      localStorage.removeItem("useDummy")
      setIsDum("Use Dummy")
    } else {
      localStorage.setItem("useDummy", "yes")
      setIsDum("Use Real")
    }
  }

    return (
        <>
        <div className="simStockMenu">
            <Link to="/simulate">SimStock</Link>
            <p>Welcome, {user.username}!</p>
            <MenuIcon onClick={handleShowMenu} fontSize="large"/>
            <Menu
                    anchorEl={anchorEl}
                    className="simStockMenuList"
                    open={open}
                    onClose={()=>setOpen(false)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                
            >
                <MenuItem onClick={()=>setOpen(false)}>
                    <Link to="/simulate">Simulate</Link>
                </MenuItem>
                <MenuItem onClick={()=>setOpen(false)}>
                    <Link to="/profile">Profile</Link>
                </MenuItem>
                <MenuItem onClick={()=>setOpen(false)}>
                    <Link to="/saved-sims">Saved Sims</Link>
                </MenuItem>
                <MenuItem onClick={handleShowLogout}>Logout</MenuItem>
            </Menu>
            <Modal
                open={showLogout}
                onClose={handleLogoutClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modalInner">
                    <div className="modalInnerMost">
                        <CloseIcon onClick={handleLogoutClose} className="modalClose"/>
                        <h3>Are you sure you want to log out?</h3>
                        <Button onClick={()=>logout()}>Confirm Log Out</Button>
                    </div>
                </div>
                
            </Modal>
            <Button onClick={()=>handleUseDummy(localStorage.getItem("useDummy"))}>{isDum}</Button>
        </div>
        <div style={{height: 40}}></div>
        </>
  );
};

export default Header;