import {useState} from 'react'
import WebSocketWrapper from './WebSocketWrapper';
import ForumIcon from '@mui/icons-material/Forum';

const ChatWindow = () =>{
    const [openChat, setOpenChat] = useState<boolean>(false);


    return (
        <div className="chatWindowContainer">
            {!openChat ? <ForumIcon onClick={()=>setOpenChat(true)} fontSize="large">Start Chatting!</ForumIcon> : null }
            {openChat
                ?   <WebSocketWrapper closeChat={()=>setOpenChat(false)} />
                :   null
        }
        </div>
    )
}

export default ChatWindow;