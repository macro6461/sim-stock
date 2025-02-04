import React, {useState} from 'react'
import WebSocketWrapper from './WebSocketWrapper';
import {Paper} from '@mui/material'
import ForumIcon from '@mui/icons-material/Forum';

const ChatWindow = () =>{
    const [openChat, setOpenChat] = useState<boolean>(false);


    return (
        <div className="chatWindowContainer">
            {!openChat ? <ForumIcon data-testid="ForumIcon" onClick={()=>setOpenChat(true)} fontSize="large">Start Chatting!</ForumIcon> : null }
            {openChat
                ?   <Paper elevation={24} style={{padding: 20}}>
                        <WebSocketWrapper closeChat={()=>setOpenChat(false)} />
                    </Paper>
                :   null
        }
        </div>
    )
}

export default ChatWindow;