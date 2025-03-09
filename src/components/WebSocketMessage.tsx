import React, {useState, useEffect} from 'react'
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CircularProgress from '@mui/material/CircularProgress'

interface WebSocketMessageProps {
    index: number;
    msg: string;
}

const WebSocketMessage: React.FC<WebSocketMessageProps> = ({
   index, msg
}) =>{
    let [renderMessage, setRenderMessage] = useState<boolean>(true)
    useEffect(()=>{
        if (index % 2 === 0){
            setRenderMessage(false)
            setTimeout(()=>{
                setRenderMessage(true)
            }, 1000)
        }
    }, [])
    return <div key={index} style={{marginTop: 10}}>
        {index % 2 === 0 
            ? <p className="messageIcon">
                <SmartToyIcon/>
            </p>
            : null
        }
        {!renderMessage && <CircularProgress size="15px" style={{float: 'left'}}/>}
        {renderMessage && <p className={index % 2 === 0 ? "message assistant" : "message"}>
            {msg.split("\n").length > 1 ? msg.split("\n").map((line, i)=>{
                    return <React.Fragment key={i}>{line}<br/><br/></React.Fragment>
                }) : msg
            }
        </p>}
    </div>
}

export default WebSocketMessage;