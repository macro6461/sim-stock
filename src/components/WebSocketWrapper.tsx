import {useState} from 'react'
import useWebSocket from "../../hooks/useWebSocket";

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
        <div>
            <div>
                {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={handleClose}>Close</button>
        </div>
    )
}

export default WebSocketWrapper;