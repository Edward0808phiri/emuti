import React, { useState } from "react";
import { FiSend, FiMic, FiMenu, FiX } from "react-icons/fi";
import { sendMessageToGPT } from "./api";
import "./App.css";



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");

    const reply = await sendMessageToGPT(message);
    setChat([...newChat, { sender: "bot", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FiX size={20} />
        </button>
        <h2>EMUTI</h2>
        <ul>
          <li>Dashboard</li>
          <li>History</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Chat Section */}
      <div className="main-content">
        <header>
          <button className="menu-btn" onClick={toggleSidebar}>
            <FiMenu size={22} />
          </button>
          <h1>EMUTI Health Chat</h1>
          <div className="profile-circle"></div>
        </header>

        <div className="chat-window">
          {chat.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="loading">Thinking...</div>}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSend}>
            <FiSend size={20} />
          </button>
          <button className="mic-btn">
            <FiMic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
