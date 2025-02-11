import { useEffect, useState } from "react";

const socketMap: { [key: string]: WebSocket } = {};

const useWebSocket = (url:string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socketMap[url]) {
        socketMap[url] = new WebSocket(url);
    }
    const ws = socketMap[url];
    setSocket(ws);

    ws.onmessage = (event) => {
        setMessages((prev) => [...prev, event.data]);
    };

    return () => {
        ws.onmessage = null; // Clean up message listener
    };
}, [url]);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  const closeSocket = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Closing WebSocket...");
      socket.close();
      setMessages([])
      setSocket(null)
      delete socketMap[url]
    } else {
      console.warn("WebSocket is already closed or not open.");
    }
  };

  return { messages, sendMessage, closeSocket };
};

export default useWebSocket;