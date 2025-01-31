import { useEffect, useState } from "react";

const useWebSocket = (url:string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const ws = new WebSocket(url);

  useEffect(() => {

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prev) => [...prev, event.data]); // Store received messages
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);
  }, []);

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
    } else {
      console.warn("WebSocket is already closed or not open.");
    }
  };

  return { messages, sendMessage, closeSocket };
};

export default useWebSocket;