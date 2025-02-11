import {useEffect, useState, useRef} from 'react'
import useWebSocket from "../../hooks/useWebsocket";
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';


const WebSocketWrapper = (props: any) =>{
    const { messages, sendMessage, closeSocket } = useWebSocket("ws://localhost:1999");
    const [maxHeight, setMaxHeight] = useState<number | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    let messageRef = useRef<HTMLInputElement>(null);
    
    useEffect(()=>{
        checkHeight();
    }, [messages])

    const handleClose = () => {
        closeSocket()
        props.closeChat(false)
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
            <div className="messageContainer" style={{maxHeight: maxHeight + 'px'}}>
                {messages.map((msg, index) => {
                    let isFromAssistant = index % 2 === 0
                    return <div key={index} style={{marginTop: 10}}>
                         {isFromAssistant 
                         ? <p className="messageIcon">
                                <SmartToyIcon/>
                            </p>
                            : null
                         }
                        <p className={isFromAssistant ? "message assistant" : "message"}>
                            {msg.split("\n").length > 1 ? msg.split("\n").map((line, i)=>{
                                return <React.Fragment key={i}>{line}<br/><br/></React.Fragment>
                            }) : msg}
                        </p>
                    </div>
                })}
            </div>
            <br/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: 'solid 1px black', padding: 10}}>
                <input
                    ref={messageRef}
                    type="text"
                    style={{width: "100%"}}
                    placeholder="Ask me anything!"
                />
                <SendIcon onClick={handleSend} style={{transform: "rotate(-50deg)", marginLeft: 5}}/>
            </div>
        </div>
    )
}

export default WebSocketWrapper;