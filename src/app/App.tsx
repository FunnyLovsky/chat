import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./style/index.css";
import axios from "axios";

type Message = {
  id: string;
  text: string;
  timestamp: string;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (input.trim() !== "") {
      const message: Message = {
        id: uuidv4(),
        text: input,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log(message);

      await axios.post("/message/", message);
      setInput("");
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/messages/");
      console.log(data);

      if (data) {
        setMessages((prevMessages) => [...prevMessages, data]);
        await fetchMessages();
      }
    } catch (error) {
      setTimeout(fetchMessages, 1000);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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
