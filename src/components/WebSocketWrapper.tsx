import {useState} from 'react'
import useWebSocket from "../../hooks/useWebsocket";
import SendIcon from '@mui/icons-material/Send';


const WebSocketWrapper = (props: any) =>{
    const { messages, sendMessage, closeSocket } = useWebSocket("ws://localhost:1999");
    const [message, setMessage] = useState("");

    const handleClose = () => {
        closeSocket()
        props.closeChat(false)
    }

    const handleSend = () => {
        sendMessage(message);
        setMessage("");
    };
    return (
        <div data-testid="websocket-wrapper">
            <div>
                {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
                ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <SendIcon onClick={handleSend} style={{transform: "rotate(-50deg)", marginLeft: 5}}/>
            </div>
            <button onClick={handleClose}>Close</button>
        </div>
    )
}

export default WebSocketWrapper;