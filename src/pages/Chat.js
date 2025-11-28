import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMic, FiMenu, FiX, FiUser, FiSettings, FiHome, FiClock } from "react-icons/fi";
import { sendMessageToGPT } from "../api";
import "../App.css";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">EMUTI</div>
            <span className="logo-subtitle">Health Assistant</span>
          </div>
          <button className="close-btn" onClick={toggleSidebar}>
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </li>
            <li className="nav-item">
              <FiClock className="nav-icon" />
              <span>History</span>
            </li>
            <li className="nav-item">
              <FiUser className="nav-icon" />
              <span>Profile</span>
            </li>
            <li className="nav-item">
              <FiSettings className="nav-icon" />
              <span>Settings</span>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <div className="user-name">John Doe</div>
              <div className="user-status">Premium Member</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="menu-btn" onClick={toggleSidebar}>
              <FiMenu size={22} />
            </button>
            <h1 className="header-title">EMUTI Health Chat</h1>
          </div>
          <div className="header-profile">
            <div className="profile-badge">
              <div className="profile-circle">
                <FiUser size={16} />
              </div>
            </div>
          </div>
        </header>

        <div className="chat-container">
          <div className="chat-window">
            {chat.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-icon">👋</div>
                <h3>Welcome to EMUTI Health Assistant</h3>
                <p>How can I help you with your health concerns today?</p>
              </div>
            )}
            
            {chat.map((msg, i) => (
              <div key={i} className={`message-container ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message-container bot">
                <div className="chat-bubble bot loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <div className="input-container">
              <textarea
                ref={textareaRef}
                placeholder="Type your health question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                className="message-input"
              />
              <div className="input-actions">
                <button 
                  className={`send-btn ${message.trim() ? 'active' : ''}`}
                  onClick={handleSend}
                  disabled={!message.trim()}
                >
                  <FiSend size={18} />
                </button>
                <button className="mic-btn">
                  <FiMic size={18} />
                </button>
              </div>
            </div>
            <div className="disclaimer">
              <p>EMUTI provides health information, not medical diagnosis. For emergencies, contact healthcare professionals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}