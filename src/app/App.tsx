import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./style/index.css";

type Message = {
  id: string;
  text: string;
  timestamp: string;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${window.location.hostname}:5000`);

    ws.current.onmessage = async (event: MessageEvent) => {
      const dataText = await event.data.text();
      const newMessage: Message = JSON.parse(dataText);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const message: Message = {
        id: uuidv4(),
        text: input,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log(message);

      ws.current?.send(JSON.stringify(message));
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          flexWrap: "nowrap",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ width: "100%" }}>
            <span>[{msg.timestamp}]</span> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
