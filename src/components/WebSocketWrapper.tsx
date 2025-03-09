import {useEffect, useState, useRef} from 'react'
import useWebSocket from "../../hooks/useWebsocket";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import WebSocketMessage from './WebSocketMessage';

interface WebSocketWrapperProps {
    closeChat: ()=>void
}

const WebSocketWrapper: React.FC<WebSocketWrapperProps> = ({closeChat}) =>{
    const { messages, sendMessage, closeSocket } = useWebSocket("ws://localhost:1999");
    const [maxHeight, setMaxHeight] = useState<number | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    let messageRef = useRef<HTMLInputElement>(null);
    
    useEffect(()=>{
        checkHeight();
    }, [messages])

    const handleClose = () => {
        closeSocket()
        closeChat()
    }

    const handleSend = () => {
        let {value} = messageRef.current as HTMLInputElement
        sendMessage(value);
        messageRef.current!.value = ""; 
    };

    const checkHeight = () =>{
        if (wrapperRef.current) {
            const elementHeight = wrapperRef.current.getBoundingClientRect().height;
            const windowHeight = window.innerHeight; 
            if (elementHeight > windowHeight - 150){
                setMaxHeight(windowHeight - 150)
            }
        }
    }

    return (
        <div data-testid="websocket-wrapper" ref={wrapperRef}>
            <CloseIcon onClick={handleClose} className="modalClose" style={{marginBottom: 10}}/>
            <br/>
            <h4 className="chatHeader">SimStock Assistant</h4>
            <div className="messageContainer" style={{maxHeight: maxHeight ? maxHeight + 'px' : 'none'}}>
                {messages.map((msg, index) => {
                    return <WebSocketMessage key={index} index={index} msg={msg}/>
                })}
            </div>
            <br/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: 'solid 1px black', padding: 10}}>
                <input
                    ref={messageRef}
                    type="text"
                    style={{width: "100%"}}
                    placeholder="Ask me anything!"
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                      }} 
                />
                <SendIcon onClick={handleSend} style={{transform: "rotate(-50deg)", marginLeft: 5}}/>
            </div>
        </div>
    )
}

export default WebSocketWrapper;