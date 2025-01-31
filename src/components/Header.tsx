import {useState} from 'react'
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
    const [anchorElLogout, setAnchorElLogout] = useState(null)

    const user = useAtomValue(authAtom).user

    const { logout } = useAuth(); 

    const handleShowLogout = (event: any) =>{
        setShowLogout(!showLogout)
        setAnchorElLogout(event.currentTarget);
    }

    const handleShowMenu = (event:any) =>{
        setOpen(true)
        setAnchorEl(event.currentTarget);
    }

    const handleLogoutClose = () =>{
        setShowLogout(false)
    }

    return (
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
                // onBackdropClick={handleLogoutClose}
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
        </div>
  );
};

export default Header;